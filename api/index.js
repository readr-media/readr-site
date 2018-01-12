const _ = require('lodash')
const { API_DEADLINE, API_HOST, API_PORT, API_PROTOCOL, API_TIMEOUT } = require('./config')
const { GCP_FILE_BUCKET, GOOGLE_CLIENT_ID, GOOGLE_RECAPTCHA_SECRET, DISPOSABLE_TOKEN_WHITE_LIST, SECRET_KEY } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT } = require('./config')
const { SCOPES } = require('./config')
const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = require('./config')
const { camelizeKeys } = require('humps')
const { initBucket, makeFilePublic, uploadFileToBucket } = require('./gcs.js')
const Cookies = require('cookies')
const GoogleAuth = require('google-auth-library')
const RedisConnectionPool = require('redis-connection-pool')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const jwtExpress = require('express-jwt')
const jwtService = require('./service.js')
const multer  = require('multer')
const upload = multer({ dest: 'tmp/' })

const router = express.Router()
const superagent = require('superagent')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT
const consoleLogOnDev = ({ msg, showSplitLine }) => {
  if (!isProd && !isTest) {
    showSplitLine && console.log('####################')
    console.log(msg)
    showSplitLine && console.log('####################')
  }
}

const SECRET_LENGTH = 10
const currSecret = SECRET_KEY || '_csrf_token_key'
// const currSecret = crypto.pseudoRandomBytes(SECRET_LENGTH).toString('base64')
const auth = jwtExpress({ secret: currSecret })

const fetchStaticJson = (req, res, next, jsonFileName) => {
  const url = `${SERVER_PROTOCOL}${SERVER_PORT ? ':' + SERVER_PORT : ''}://${SERVER_HOST}/json/${jsonFileName}.json`
  superagent
  .get(url)
  .end((err, response) => {
    if (!err && response) {
      res.json(JSON.parse(response.text))
    } else {
      res.send('{\'error\':' + err + '}')
      console.error(`error during fetch data from ${jsonFileName} : ${url}`)
      console.error(err)  
    }
  })
}

const redisPoolRead = RedisConnectionPool('myRedisPoolRead', {
  host: REDIS_READ_HOST,
  port: REDIS_READ_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: {
    auth_pass: REDIS_AUTH
  }
})
const redisPoolWrite = isProd ? RedisConnectionPool('myRedisPoolWrite', {
  host: REDIS_WRITE_HOST,
  port: REDIS_WRITE_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: {
    auth_pass: REDIS_AUTH
  }
}) : redisPoolRead
const redisFetching = (url, callback) => {
  redisPoolRead.get(decodeURIComponent(url), function (err, data) {
    redisPoolRead.ttl(decodeURIComponent(url), (_err, _data) => {
      if (!_err && _data) {
        if (_data === -1) {
          redisPoolWrite.del(decodeURIComponent(url), (_e, _d) => {
            if (_e) {
              console.log('deleting key ', decodeURIComponent(url), 'from redis in fail ', _e)
            }
          })
        }
      } else {
        console.log('fetching ttl in fail ', _err)
      }
    })
    callback && callback({ err, data })
  })
}
const redisWriting = (url, data, callback) => {
  redisPoolWrite.set(decodeURIComponent(url), data, function (err) {
    if(err) {
      console.log('redis writing in fail. ', decodeURIComponent(url), err)
    } else {
      redisPoolWrite.expire(decodeURIComponent(url), REDIS_TIMEOUT, function(error, d) {
        if(error) {
          console.log('failed to set redis expire time. ', decodeURIComponent(url), err)
        } else {
          callback && callback()
        }
      })
    }
  })
}

router.all('/', function(req, res, next) {
  next()
})

router.use('/grouped', function(req, res, next) {
  fetchStaticJson(req, res, next, 'grouped')
})

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())

const basicPostRequst = (url, req, res, cb) => {
  superagent
  .post(url)
  .send(req.body)
  .end((err, response) => {
    cb && cb(err, response)
  })
}

const basicGetRequest = (url, req, cb) => {
  try {
    redisFetching(req.url, ({ err, data }) => {
      if (!err && data) {
        cb && cb( err, data )
      } else {
        superagent
        .get(url)
        .timeout(
          {
            response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
            deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
          }
        )
        .end((e, r) => {
          const dt = JSON.parse(r.text)
          if (Object.keys(dt).length !== 0 && dt.constructor === Object) {
            // redisWriting(req.url, r.text)
          }
          cb && cb(e, r)
        })
      }
    })
  } catch (e) {
    cb && cb( e, null )
  }
}

const fetchPermissions = () => {
  return new Promise((resolve, reject) => {
    const url = `${apiHost}/permission/all`
    basicGetRequest(url, { url }, (err, res) => {
      if (!err && res) {
        resolve(res.body)
      } else {
        reject(err)
      }
    })
  })
}
const fetchProfile = (url, req) => {
  return new Promise((resolve, reject) => {
    basicGetRequest(url, req, (err, response) => {
      if (!err && response) {
        resolve(camelizeKeys(JSON.parse(response.text)))
      } else {
        reject(err)
        console.error(`error during fetch data from : ${url}`)
        console.error(err)  
      }
    })
  })
}
const constructScope = (perms, role) => (
  _.map(_.filter(SCOPES, (comp) => (
    _.get(comp, [ 'perm', 'length' ], 0) === _.filter(comp.perm, (perm) => (
      _.find(perms, (p) => (
        perm === p.object && p.role === role
      ))
    )).length && (comp.role 
      && typeof(comp.role) === 'object' 
      && comp.role.length > 0
        ? _.find(comp.role, (r) => (r === role))
        : true)
  )), (p) => (p.comp)) 
)

router.use('/profile', auth, function(req, res, next) {
  const targetProfile = jwtService.getId(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  const url = `${apiHost}/member/${targetProfile}`
  Promise.all([
    fetchProfile(url, req),
    fetchPermissions()
  ]).then((response) => {
    const profile = response[ 0 ][ 'items' ][ 0 ]
    const perms = response[ 1 ]
    const scopes = constructScope(perms, profile.role)
    res.json({
      name: profile.name,
      nickname: profile.nickname,
      mail: profile.mail,
      description: profile.description,
      id: profile.id,
      role: profile.role,
      scopes
    })
  }).catch((err) => {
    res.status(500).send(err)
    console.error(`error during fetch data from : ${url}`)
    console.error(err)
  })
})
router.use('/member', auth, function(req, res, next) {
  const role = jwtService.getRole(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  if (role === 9) {
    next()
  } else {
    res.status(403).send('Forbidden. No right to access.').end()
  }
})
router.use('/members', auth, function(req, res, next) {
  const role = jwtService.getRole(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  if (role === 9) {
    next()
  } else {
    res.status(403).send('Forbidden. Invalid token detected.').end()
  }
})
router.use('/post', auth, function(req, res, next) {
  next()
})

router.use('/posts', auth, function(req, res, next) {
  next()
})

router.use('/status', auth, function(req, res) {
  res.status(200).send(true)
})

router.use('/activate', function(req, res) {
  const tokenForActivation = req.url.split('/')[1]
  jwtService.verifyToken(tokenForActivation, currSecret, (error, decoded) => {
    const url = `${apiHost}/member`
     superagent
    .put(url)
    .send({
      id: decoded.id,
      role: decoded.role || 1,
      active: 1
    })
    .end((err, response) => {
      if (!err && response) {
        const redirect_path = decoded.way !== 'admin' ? '/login' : '/change-password'
        res.status(200).send(`
          <script>location.replace('${redirect_path}')</script>
        `)
      } else {
        console.log(response.status)
        console.log(err)
        res.status(response.status).json(err)
      }
    })
  })
})

router.get('*', function(req, res) {
  !isTest && console.log(apiHost)  
  !isTest && console.log(decodeURIComponent(req.url))
  const url = `${apiHost}${req.url}`
  basicGetRequest(url, req, (err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      res.json(resData)
    } else {
      res.json(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)  
    }
  })
})

router.post('/verify-recaptcha-token', (req, res) => {
  let url = 'https://www.google.com/recaptcha/api/siteverify'
  superagent
  .post(url)
  .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
  .send({
    secret: GOOGLE_RECAPTCHA_SECRET,
    response: req.body.token
  })
  .end((err, response) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(response.body)
    }
  })
})

router.post('/token', (req, res) => {
  const type = _.get(req, [ 'body', 'type' ])
  if (_.findIndex(DISPOSABLE_TOKEN_WHITE_LIST, (o) => (o === type)) > -1) {
    const token = jwtService.generateDisposableJwt({ host: SERVER_HOST, secret: currSecret })
    res.status(200).send({ token })
  } else {
    res.status(403).send('Forbidden.')
  }
})

router.post('/login', auth, (req, res) => {
  consoleLogOnDev({
    msg: `Got a new reuqest of login:
          mail -> ${req.body.email}
          At ${(new Date).toString()}`
  })

  const sendRequest = () => {
    if ((!req.body.email || !req.body.password) && (req.body.login_mode === 'google' && req.body.login_mode === 'facebook')) {
      res.status(400).send({ message: 'Please offer id/password.' })
      return
    }
    const url = `${apiHost}/login`
    basicPostRequst(url, req, res, (err, response) => {
      if (!err && response) {
        const mem = _.get(response, [ 'body', 'member' ], {})
        const scopes = constructScope(_.get(response, [ 'body', 'permissions' ]), _.get(mem, [ 'role' ], 1))
        const token = jwtService.generateJwt({
          id: _.get(mem, [ 'id' ], req.body.id),
          email: _.get(mem, [ 'mail' ], req.body.email),
          name: _.get(mem, [ 'name' ]),
          role: _.get(mem, [ 'role' ], 1),
          keepAlive: req.body.keepAlive,
          scopes,
          secret: currSecret
        })
        const cookies = new Cookies( req, res, {} )
        cookies.set('csrf', token, { httpOnly: false, expires: new Date(Date.now() + (req.body.keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000) })
        res.status(200).send({ token, profile: {
          name: _.get(mem, [ 'name' ]),
          nickname: _.get(mem, [ 'nickname' ]),
          description: _.get(mem, [ 'description' ]),
          id: _.get(mem, [ 'id' ]),
          mail: _.get(mem, [ 'mail' ], req.body.email),
          role: _.get(mem, [ 'role' ], req.body.email),
          scopes
        }})    
      } else {
        res.status(401).send('Validated in fail. Please offer correct credentials.')
      }
    })
    
  }

  if (req.body.login_mode === 'google') {
    const auth = new GoogleAuth
    const client = new auth.OAuth2(GOOGLE_CLIENT_ID, '', '');
    client.verifyIdToken(
      req.body.idToken,
      GOOGLE_CLIENT_ID,
      (e, login) => {
        const payload = login.getPayload()
        if (payload[ 'aud' ] !== GOOGLE_CLIENT_ID) {
          res.status(403).send('Forbidden. Invalid token detected.').end()
          return
        }
        req.body.id = payload[ 'sub' ]
        req.body.mail = payload[ 'email' ]
        req.body.email = payload[ 'email' ]
        req.body.register_mode = 'oauth-goo'
        sendRequest()
      })
  } else if (req.body.login_mode === 'facebook') {
    // req.body.mail = payload[ 'email' ]
    // req.body.email = payload[ 'email' ]
    req.body.register_mode = 'oauth-fb'    
    sendRequest()
  } else {
    req.body.id = req.body.email
    req.body.register_mode = 'ordinary'    
    sendRequest()
  }  
})

const sendActivationMail = ({ id, role, way }, cb) => {
  const tokenForActivation = jwtService.generateActivateAccountJwt({
    id, role, way, secret: currSecret
  })
  basicPostRequst(`${apiHost}/mail`, { 
    body: {
      receiver: ['keithchiang@mirrormedia.mg','mushin@mirrormedia.mg'],
      subject: 'Active',
      content: `
        hit the following url: <br>
        <a href="${SERVER_PROTOCOL}://${SERVER_HOST}${SERVER_PORT ? ':' + SERVER_PORT : ''}/api/activate/${tokenForActivation}">click me</a>
      `
    }
  }, {}, (err, res) => {
    cb && cb(err, res)
  })
}
router.post('/register', auth, (req, res) => {
  consoleLogOnDev({
    msg: `Got a new reuqest of register:
          nickname -> ${req.body.nickname}
          mail -> ${req.body.email}
          gender -> ${req.body.gender}
          social_id -> ${req.body.social_id}
          register_mode -> ${req.body.register_mode}
          At ${(new Date).toString()}`
  })

  const sendRequest = () => {
    if (!req.body.email || !(req.body.password || req.body.social_id)) {
      res.status(400).send({ message: 'Please offer all requirements.' })
      return
    }

    delete req.body.idToken
    delete req.body.email

    const url = `${apiHost}/register`
    basicPostRequst(url, req, res, (err, resp) => {
      if (!err && resp) {
        sendActivationMail({ id: req.body.id, way: 'member' }, (e, response) => {
          if (!e && response) {
            res.status(200).end()
          } else {
            res.status(response.status).json(e)
            console.error(`error during register: ${url}`)
            console.error(e)
          }
        })
      } else {
        res.status(500).json(_.get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
        console.error(`error during register: ${url}`)
        console.error(err)
      }
    })
  }

  if (req.body.register_mode === 'oauth-goo') {
    const auth = new GoogleAuth
    const client = new auth.OAuth2(GOOGLE_CLIENT_ID, '', '')
    client.verifyIdToken(
      req.body.idToken,
      GOOGLE_CLIENT_ID,
      (e, login) => {
        if (e) {
          res.status(403).send(e.message).end()
          return
        }
        const payload = login.getPayload()
        if (payload[ 'aud' ] !== GOOGLE_CLIENT_ID) {
          res.status(403).send('Forbidden. Invalid token detected.').end()
          return
        }
        req.body.id = payload[ 'sub' ]
        req.body.mail = payload[ 'email' ]
        req.body.email = payload[ 'email' ]
        req.body.social_id = payload[ 'sub' ]
        sendRequest()
      })
  } else if (req.body.register_mode === 'oauth-fb') {
    req.body.mail = req.body.email
    req.body.id = req.body.social_id
    sendRequest()
  } else {
    req.body.mail = req.body.email
    req.body.id = req.body.email
    req.body.register_mode = 'ordinary'
    if (req.body.role !== null && req.body.role !== undefined && !req.body.password) {
      req.body.password = 'none'
    }
    sendRequest()
  }
})

router.post('/post', auth, (req, res) => {
  const url = `${apiHost}${req.url}`
  basicPostRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      res.status(200).end()
    } else {
      res.status(400).json(_.get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
    }
  })
})

router.post('/uploadImg', upload.single('image'), (req, res) => {
  const url = `${apiHost}${req.url}`
  const bucket = initBucket(GCP_FILE_BUCKET)
  const file = req.file
  
  uploadFileToBucket(bucket, file.path, {
    destination: `/assets/images/${file.originalname}`,
    metadata: {
      contentType: file.mimetype
    }
  }).then((bucketFile) => {
    console.info(`file ${file.originalname}(${file.path}) completed uploading to bucket `)
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(`Error: delete ${file.path} fail`)
      }
      console.info(`successfully deleted ${file.path}`)
    })
    return makeFilePublic(bucketFile)
  }).then((bucketFile) => {
    res.status(200).send({url: `https://dev.readr.tw/${bucketFile.name}`})
  })
  .catch((err) => {
    res.status(400).send('Upload Fail').end()
  })
})

router.post('*', auth, (req, res) => {
  const url = `${apiHost}${req.url}`
   superagent
  .post(url)
  .send(req.body)
  .end((err, response) => {
    if (!err && response) {
      if (req.url.indexOf('member') === -1) {
        res.status(200).end()
      } else {
        sendActivationMail({ id: req.body.id, role: req.body.role, way: 'admin' }, (e, response) => {
          if (!e && response) {
            res.status(200).end()
          } else {
            res.status(response.status).json(e)
            console.error(`error during register: ${url}`)
            console.error(e)
          }
        })
      }
    } else {
      console.log('error occurred when handling a req: ', req.url)
      console.log(err)
      res.status(500).json(err)
    }
  })
})

router.put('*', auth, function (req, res) {
  const url = `${apiHost}${req.url}`
  superagent
  .put(url)
  .send(req.body)
  .end((err, response) => {
    if (!err && response) {
      res.status(200).end()
    } else {
      res.status(500).json(err)
    }
  })
})

router.delete('*', auth, function (req, res) {
  const url = `${apiHost}${req.url}`
  const params = req.body || {}
  superagent
  .delete(url)
  .end((err, response) => {
    if (!err && response) {
      res.status(200).end()
    } else {
      console.log('Error occurred when deleting stuff', err)
      res.status(500).json(err)
    }
  })
})

router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError' && req.url.indexOf('/status') === -1) {
    res.status(401).send('invalid token...')
  } else if (err && req.url.indexOf('/status') > -1) {
    if (err.name === 'UnauthorizedError') {
      res.status(200).send(false)
    } else {
      console.log('Error occurred when checking login status', err)
    }
  }
})

module.exports = router