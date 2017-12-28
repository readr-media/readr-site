const _ = require('lodash')
const { API_DEADLINE, API_HOST, API_PORT, API_PROTOCOL, API_TIMEOUT } = require('./config')
const { GCP_FILE_BUCKET, GOOGLE_CLIENT_ID, GOOGLE_RECAPTCHA_SECRET, DISPOSABLE_TOKEN_WHITE_LIST, SECRET_KEY } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT } = require('./config')
const { SERVER_PROTOCOL, SERVER_HOST } = require('./config')
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
  const url = `${SERVER_PROTOCOL}://${SERVER_HOST}/json/${jsonFileName}.json`
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

const basicGetRequest = (url, req, res, cb) => {
  try {
    redisFetching(req.url, ({ err, data }) => {
      if (!err && data) {
        res.json(JSON.parse(data))
      } else {
        superagent
        .get(url)
        .timeout(
          {
            response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
            deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
          }
        )
        .end(cb)
      }
    })
  } catch (e) {
    res.send(e)
    console.error(`error during fetch data from api : ${req.url}`)
    console.error(e)
  }
}

router.use('/profile', auth, function(req, res, next) {
  const targetProfile = jwtService.getId(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  const url = `${apiHost}/member/${targetProfile}`
  basicGetRequest(url, req, res, (err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      if (Object.keys(resData).length !== 0 && resData.constructor === Object) {
        // redisWriting(req.url, response.text)
      }
      res.json({
        name: resData.name,
        nickname: resData.nickname,
        mail: resData.mail,
        description: resData.description,
        id: resData.id
      })
    } else {
      res.json(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)  
    }
  })
})
router.use('/member', auth, function(req, res, next) {
  next()
})
router.use('/members', auth, function(req, res, next) {
  const role = jwtService.getRole(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  if (role === 1) {
    next()
  } else {
    res.status(403).send('Forbidden. Invalid token detected.').end()
  }
})
router.use('/post', auth, function(req, res, next) {
  next()
})

router.use('/status', auth, function(req, res) {
  res.status(200).send(true)
})

router.get('*', function(req, res) {
  !isTest && console.log(apiHost)  
  !isTest && console.log(decodeURIComponent(req.url))
  const url = `${apiHost}${req.url}`
  basicGetRequest(url, req, res, (err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      if (Object.keys(resData).length !== 0 && resData.constructor === Object) {
        // redisWriting(req.url, response.text)
      }
      res.json(resData)
    } else {
      res.json(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)  
    }
  })
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
        const perm = _.get(response, [ 'body', 'permissions' ], [])
        const token = jwtService.generateJwt({
          id: _.get(mem, [ 'id' ], req.body.id),
          email: _.get(mem, [ 'mail' ], req.body.email),
          name: _.get(mem, [ 'name' ]),
          role: _.get(mem, [ 'role' ], 1),
          keepAlive: req.body.keepAlive,
          secret: currSecret
        })
        const cookies = new Cookies( req, res, {} )
        cookies.set('csrf', token, { httpOnly: false, expires: new Date(Date.now() + (req.body.keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000) })
        res.status(200).send({ token, profile: {
          name: _.get(mem, [ 'name' ]),
          nickname: _.get(mem, [ 'nickname' ]),
          description: _.get(mem, [ 'description' ]),
          id: _.get(mem, [ 'id' ]),
          mail: _.get(mem, [ 'mail' ], req.body.email)
        }})    
      } else {
        res.status(400).send('Validated in fail. Please offer correct credentials.')
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

    const url = `${apiHost}/member`
    basicPostRequst(url, req, res, (err, resp) => {
      if (!err && resp) {
        res.status(200).end()
      } else {
        res.status(400).json(_.get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
      }
    })
  }

  if (req.body.register_mode === 'google') {
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
  } else {
    req.body.mail = req.body.email
    req.body.id = req.body.social_id ? req.body.social_id : req.body.email
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
    res.status(200).send({url: `https://storage.cloud.google.com/${GCP_FILE_BUCKET}/${bucketFile.name}`})
  })
  .catch((err) => {
    res.status(400).send('Upload Fail').end()
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
      res.json(err)
    }
  })
})

router.delete('*', auth, function (req, res) {
  const url = `${apiHost}${req.url}`
  superagent
  .delete(url)
  .end((err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      res.status(200).json(resData)
    } else {
      res.status(response.status).json(err)
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