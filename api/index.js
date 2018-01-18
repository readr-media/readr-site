const _ = require('lodash')
const { API_DEADLINE, API_HOST, API_PORT, API_PROTOCOL, API_TIMEOUT } = require('./config')
const { GCP_FILE_BUCKET, GOOGLE_CLIENT_ID, GOOGLE_RECAPTCHA_SECRET, GCS_IMG_MEMBER_PATH, GCS_IMG_POST_PATH, DISPOSABLE_TOKEN_WHITE_LIST, SECRET_KEY } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT } = require('./config')
const { ENDPOINT_SECURE, SCOPES } = require('./config')
const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = require('./config')
const { camelizeKeys } = require('humps')
const { initBucket, makeFilePublic, uploadFileToBucket, deleteFileFromBucket } = require('./gcs.js')
const { processImage } = require('./sharp.js')
const Cookies = require('cookies')
const GoogleAuth = require('google-auth-library')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const jwtExpress = require('express-jwt')
const jwtService = require('./service.js')
const multer  = require('multer')
const sharp = require('sharp')
const scrape = require('html-metadata')
const upload = multer({ dest: 'tmp/' })

const { fetchFromRedis, insertIntoRedis, redisFetching, redisWriting } = require('./middle/redisHandler')

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
const authVerify = jwtExpress({ secret: currSecret })

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

const fetchPermissions = () => {
  return new Promise((resolve, reject) => {
    const url = `/permission/all`
    redisFetching(url, ({ error, data }) => {
      if (!error && data) {
        resolve(JSON.parse(data))
      } else {
        superagent
        .get(`${apiHost}${url}`)
        .end((err, res) => {
          if (!err && res) {
            const dt = JSON.parse(res.text)
            if (Object.keys(dt).length !== 0) {
              redisWriting(url, res.text)
            }
            resolve(res.body)
          } else {
            console.log('Fetch permissions in false...', err)
            reject(err)
          }
        })
      }
    })
  })
}
const fetchProfile = (url, req) => {
  return new Promise((resolve, reject) => {
    superagent
    .get(`${apiHost}${url}`)
    .end((err, res) => {
      if (!err && res) {
        resolve(camelizeKeys(res.body))
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
const authorize = (req, res, next) => {
  const whitelist = _.get(ENDPOINT_SECURE, [ `${req.method}${req.url.replace(/\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*$/, '')}` ])
  if (whitelist) {
    fetchPermissions().then((perms) => {
      Promise.all([
        new Promise((resolve) => (resolve(_.get(whitelist, [ 'role' ]) ? _.find(_.get(whitelist, [ 'role' ]), (r) => (r === req.user.role)) : true))),
        new Promise((resolve) => (resolve(_.get(whitelist, [ 'perm' ]) ? _.get(whitelist, [ 'perm' ]).length === _.filter(_.get(whitelist, [ 'perm' ]), (p) => (_.find(_.filter(perms, { role: req.user.role }), { object: p }))).length : true)))
      ]).then((isAuthorized) => {
        const isRoleAuthorized = isAuthorized[ 0 ]
        const isPermsAuthorized = isAuthorized[ 1 ]
        if (isRoleAuthorized && isPermsAuthorized) {
          next()
        } else {
          res.status(403).send('Forbidden. No right to access.').end()
        }
      })
    })

  } else {
    next()
  }
}
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
    cb && cb(err, res, tokenForActivation)
  })
}


/**
 * 
 * special request handler
 * 
 */

const activationKeyVerify = function (req, res, next) {
  const key = req.url.split('/')[1]
  jwtService.verifyToken(key, currSecret, (error, decoded) => {
    if (error || !decoded.way) {
      res.status(403).send(`Invalid activation token.`)
    } else {
      req.decoded = decoded
      next()
    }
  })
}
router.use('/activate', activationKeyVerify, function(req, res) {
  const decoded = req.decoded
  superagent
  .get(`${apiHost}/member/${decoded.id}`)
  .end((err, data) => {
    if (err) {
      console.log(data.status)
      console.log(err)
      res.status(data.status).json(err)
    } else {
      if (_.get(data, [ 'body', '_items', 0, 'active' ]) === 0) {
        if (decoded.way !== 'admin') {
          const url = `${apiHost}/member`
          const payload = {
            id: decoded.id,
            role: decoded.role || 1,
            active: 1
          }
          superagent
          .put(url)
          .send(payload)
          .end((e, response) => {
            if (!e && response) {
              res.status(200).send(`
                <script>location.replace('/login')</script>
              `)
            } else {
              console.log(response.status)
              console.log(e)
              res.status(response.status).json(e)
            }
          })
        } else {
          const tokenForActivation = jwtService.generateActivateAccountJwt({
            id: decoded.id, role: decoded.role || 1, way: 'initmember', secret: currSecret
          })
          const cookies = new Cookies( req, res, {} )
          cookies.set('initmember', tokenForActivation, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })      
          res.status(200)
            .send(`
              <script>location.replace('/initmember')</script>
            `)
        }
      } else {
        res.status(200).send(`<script>location.replace('/')</script>`)
      }
    }
  })
})
router.use('/initmember', authVerify, function(req, res) {
  const id = jwtService.getId(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  const role = jwtService.getRole(_.get(_.get(req, [ 'headers', 'authorization' ], '').split(' '), [ 1 ], ''), currSecret)
  superagent
  .put(`${apiHost}/member/password`)
  .send({
    id,
    password: req.body.password
  })
  .end((err, response) => {
    if (!err && response) {
      superagent
      .put(`${apiHost}/member`)
      .send({
        id,
        nickname: req.body.nickname,
        role,
        active: 1
      })
      .end((e, response) => {
        if (!e && response) {
          res.status(200).end()
        } else {
          res.status(500).json(e)
        }
      })
    } else {
      res.status(500).json(err)
    }
  })
})


/**
 * 
 * METHOD ALL
 * 
 */

router.all('/member', [ authVerify, authorize ], function(req, res, next) {
  next()
})
router.all('/member/password', authVerify, function(req, res, next) {
  next()
})
router.all('/members', [ authVerify, authorize ], function(req, res, next) {
  next()
})
router.all('/post', [ authVerify, authorize ], function(req, res, next) {
  next()
})
router.all('/posts', [ authVerify, authorize ], function(req, res, next) {
  next()
})


/**
 * 
 * METHOD GET
 * 
 */

router.get('/profile', [ authVerify ], (req, res) => {
  const targetProfile = req.user.id
  const url = `/member/${targetProfile}`
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
      scopes,
      profileImage: profile.profileImage
    })
  }).catch((err) => {
    res.status(500).send(err)
    console.error(`error during fetch data from : ${url}`)
    console.error(err)
  })
})

router.get('/status', authVerify, function(req, res) {
  res.status(200).send(true)
})

/**
 * 
 * METHOD POST
 * 
 */

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

router.post('/login', authVerify, (req, res) => {
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

router.post('/register', authVerify, (req, res) => {
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
        sendActivationMail({ id: req.body.id, way: 'member' }, (e, response, tokenForActivation) => {
          if (!e && response) {
            res.status(200).send({ token: tokenForActivation })
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

router.post('/post', authVerify, (req, res) => {
  const url = `${apiHost}${req.url}`
  basicPostRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      res.status(200).end()
    } else {
      res.status(400).json(_.get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
    }
  })
})

router.post('/uploadMemberImg', authVerify, upload.single('image'), (req, res) => {
  const url = `${apiHost}${req.url}`
  const bucket = initBucket(GCP_FILE_BUCKET)
  const file = req.file
  
  uploadFileToBucket(bucket, file.path, {
    destination: `${GCS_IMG_MEMBER_PATH}/${file.originalname}`,
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

router.post('/uploadPostImg', authVerify, upload.single('image'), (req, res) => {
  const url = `${apiHost}${req.url}`
  const bucket = initBucket(GCP_FILE_BUCKET)
  const file = req.file
  
  processImage(file)
    .then((images) => {
      const origImg = _.trim(images[0], 'tmp/')
      Promise.all(images.map((path) => {
        const fileName = _.trim(path, 'tmp/')
        return uploadFileToBucket(bucket, path, {
          destination: `${GCS_IMG_POST_PATH}/${fileName}`,
          metadata: {
            contentType: file.mimetype
          }
        }).then((bucketFile) => {
          console.info(`file ${fileName}(${path}) completed uploading to bucket `)
          fs.unlink(path, (err) => {
            if (err) {
              console.error(`Error: delete ${path} fail`)
            }
            console.info(`successfully deleted ${path}`)
          })
          makeFilePublic(bucketFile)
        })
      }))
      .then(() => {
        res.status(200).send({url: `http://dev.readr.tw${GCS_IMG_POST_PATH}/${origImg}`})
      })
    })
    .catch((err) => {
      res.status(400).send('Upload Fail').end()
    })
})

router.post('/deleteImg', (req, res) => {
  const url = `${apiHost}${req.url}`
  const bucket = initBucket(GCP_FILE_BUCKET)
  const filePath = req.body.filePath
  deleteFileFromBucket(bucket, {
    destination: `/assets/images/${filePath}`
  }).then((bucketFile) => {
    res.status(200).send(`file ${filePath} completely delete from bucket `)
  })
  .catch((err) => {
    res.status(400).send('Delete Fail').end()
  })
})

router.post('/meta', authVerify, (req, res) => {
  if (!req.body.url) {
    res.status(400).end()
  }
  const url = req.body.url
  scrape(url).then((metadata) => {
    res.status(200).send(metadata).end()
  })
})


/**
 * 
 * ERROR HANDLER
 * 
 */


router.route('*')
  .get(fetchFromRedis, function (req, res, next) {
    const url = `${apiHost}${req.url}`
    if (res.redis) {
      console.log('fetch data from Redis.', req.url)
      const resData = JSON.parse(res.redis)
      res.json(resData)
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
          if (!e && r) {
            const dt = JSON.parse(r.text)
            if (Object.keys(dt).length !== 0 && dt.constructor === Object) {
              res.dataString = r.text
              /**
               * if data not empty, go next to save data to redis
               * if endpoint is not /members, go next to save data to redis
               */
              if (req.url.indexOf('/members') === -1) {
                next()
              }
            }
            const resData = JSON.parse(r.text)
            res.json(resData)
          } else {
            res.json(e)
            console.error(`error during fetch data from : ${url}`)
            console.error(e)  
          }
        })
      }
  }, insertIntoRedis)
  .post(authVerify, (req, res) => {
    console.log('??')
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
  .put(authVerify, function (req, res) {
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
  .delete(authVerify, function (req, res) {
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