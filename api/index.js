const _ = require('lodash')
const { API_DEADLINE, API_HOST, API_PORT, API_PROTOCOL, API_TIMEOUT } = require('./config')
const { GCP_FILE_BUCKET, GOOGLE_CLIENT_ID, GOOGLE_RECAPTCHA_SECRET, GCS_IMG_MEMBER_PATH, GCS_IMG_POST_PATH, DISPOSABLE_TOKEN_WHITE_LIST, SECRET_KEY } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT } = require('./config')
const { ENDPOINT_SECURE, SCOPES } = require('./config')
const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = require('./config')
const { camelizeKeys } = require('humps')
const { constructScope, fetchPermissions } = require('./services/perm')
const { initBucket, makeFilePublic, uploadFileToBucket, deleteFileFromBucket, publishAction } = require('./gcs.js')
const { processImage } = require('./sharp.js')
const Cookies = require('cookies')
const GoogleAuth = require('google-auth-library')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const config = require('./config')
const debug = require('debug')('READR:api')
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

const SECRET_LENGTH = 10
const authVerify = jwtExpress({ secret: config.JWT_SECRET })

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

const basicGetRequst = (url, req, res, cb) => {
  superagent
  .get(url)
  .end((err, response) => {
    cb && cb(err, response)
  })
}

const basicPostRequst = (url, req, res, cb) => {
  superagent
  .post(url)
  .send(req.body)
  .end((err, response) => {
    cb && cb(err, response)
  })
}

const basicPutRequst = (url, req, res, cb) => {
  superagent
  .put(url)
  .send(req.body)
  .end((err, response) => {
    cb && cb(err, response)
  })
}

const basicDeleteRequst = (url, req, res, cb) => {
  superagent
  .delete(url)
  .send(req.body)
  .end((err, response) => {
    cb && cb(err, response)
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
const fetchPublicPost = (url, req) => {
  return new Promise((resolve, reject) => {
    superagent
    .get(`${apiHost}${url}`)
    .end((err, res) => {
      if (!err && res) {
        resolve(camelizeKeys(res.body))
      } else {
        reject(err)
      }
    })
  })
}

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
    id, role, way
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
  jwtService.verifyToken(key, (error, decoded) => {
    if (error || !decoded.way) {
      res.status(403).send(`Invalid activation token.`)
    } else {
      req.decoded = decoded
      next()
    }
  })
}
router.use('/activate', activationKeyVerify, require('./middle/member/activation'))
router.use('/initmember', authVerify, function(req, res) {
  const id = req.user.id
  const role = req.user.role
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
router.use('/member', [ authVerify, authorize ], require('./middle/member'))
router.use('/comment', require('./middle/comment'))


/**
 * 
 * METHOD ALL
 * 
 */

router.all('/members', [ authVerify, authorize ], function(req, res, next) {
  debug('Got a /members request.')
  debug('User payload:')
  debug(req.user)
  next()
})
router.all('/post', [ authVerify, authorize ], function(req, res, next) {
  next()
})
router.all('/posts', [ authVerify, authorize ], function(req, res, next) {
  next()
})
router.all('/following', [ authVerify, authorize ], function(req, res, next) {
  next()
})


/**
 * 
 * METHOD GET
 * 
 */

router.get('/posts', authVerify, (req, res) => {
  if (req.user.role !== 9 && req.user.role !== 3) {
    if (!req.query.author) {
      return res.status(403).send('Forbidden. No right to access.').end()
    } else {
      const author = _.get(JSON.parse(req.query.author), [ '$in', 0 ])
      if (author !== req.user.id) {
        return res.status(403).send('Forbidden. No right to access.').end()
      }
    }
  }
  const url = `${apiHost}${req.url}`
  basicGetRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      const resData = JSON.parse(resp.text)
      return res.json(resData)
    } else {
      res.json(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)  
    }
  })
})

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

router.get('/public-posts', (req, res) => {
  const url = req.url.replace('public-posts', 'posts')
  fetchPublicPost(url, req)
  .then((response) => {
    // next()
    res.status(200).send(response)
  })
  .catch((err) => {
    if (err.status === 404) {
      res.status(200).send('not found')
      // console.error(`public post not found from : ${url}`)
      // console.error(err)
    } else {
      res.status(500).send(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)
    }
  })
})

router.get('/following/byuser', authVerify, (req, res) => {
  const url = `${apiHost}/following/byuser`
  superagent
  .get(url)
  .send(req.query)
  .end((err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      res.json(resData)
    } else {
      if (err.status === 404) {
        res.status(200).json([])
      } else {
        res.json(err)
        console.error(`error during fetch data from : ${url}`)
        console.error(err)  
      }
    }
  })
})

router.get('/following/byresource', authVerify, (req, res) => {
  const url = `${apiHost}/following/byresource`
  superagent
  .get(url)
  .send(req.query)
  .end((err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      return res.json(resData)
    } else {
      res.json(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)  
    }
  })
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
    const token = jwtService.generateDisposableJwt({ host: SERVER_HOST })
    res.status(200).send({ token })
  } else {
    res.status(403).send('Forbidden.')
  }
})

router.post('/login', authVerify, require('./middle/member/login'))

router.post('/register', authVerify, (req, res) => {
  debug(`Got a new reuqest of register:
    nickname -> ${req.body.nickname}
    mail -> ${req.body.email}
    gender -> ${req.body.gender}
    social_id -> ${req.body.social_id}
    register_mode -> ${req.body.register_mode}
    At ${(new Date).toString()}`)

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
    const auth = new GoogleAuth()
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
  if (req.body.active === 1 && req.user.role === 2) {
    return res.status(403).send('Forbidden. No right to access.').end()
  }
  if ((req.body.og_description || req.body.og_image || req.body.og_title || req.body.published_at) && req.user.role === 2) {
    return res.status(403).send('Forbidden. No right to access.').end()
  }
  if (req.body.author !== req.user.id) {
    req.body.author = req.user.id
  }
  const url = `${apiHost}${req.url}`
  basicPostRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      return res.status(200).end()
    } else {
      return res.status(400).json(_.get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
    }
  })
})

router.post('/image-member', authVerify, upload.single('image'), (req, res) => {
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

router.post('/image-post', authVerify, upload.single('image'), (req, res) => {
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
      res.status(500).send(err)
      console.error(`error during fetch data from : ${url}`)
      console.error(err)
    })
})

router.post('/deleteImg', (req, res) => {
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

router.post('/deleteMemberImg', (req, res) => {
  const bucket = initBucket(GCP_FILE_BUCKET)
  const filePath = req.body.filePath
  deleteFileFromBucket(bucket, {
    destination: `${GCS_IMG_MEMBER_PATH}/${filePath}`
  }).then((bucketFile) => {
    res.status(200).send(`file ${filePath} completely delete from /assets/images/members/ in bucket`)
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
  .catch((err) => {
    res.status(500).send(err)
    console.error(`error during fetch data from : ${url}`)
    console.error(err)
  })
})

router.post('/publish-action', (req, res) => {
  publishAction(req.body)
})

/**
 * 
 * METHOD PUT
 * 
 */

router.put('/post', authVerify, (req, res) => {
  if (!req.body.author) {
    return res.status(403).send('Forbidden. No right to access.').end()
  }
  if (req.body.author !== req.user.id && req.user.role !== 9 && req.user.role !== 3) {
    return res.status(403).send('Forbidden. No right to access.').end()
  }
  const url = `${apiHost}${req.url}`
  basicPutRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      return res.status(200).end()
    } else {
      return res.status(500).json(err)
    }
  })
})

/**
 * 
 * METHOD DELETE
 * 
 */

router.delete('/post-self/:id', authVerify, (req, res) => {
  const url = `${apiHost}/post/${req.params.id}`
  basicDeleteRequst(url, req, res, (err, resp) => {
    if (!err && resp) {
      return res.status(200).end()
    } else {
      return res.status(500).json(err)
    }
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
              if (req.url.indexOf('/members') === -1 && req.url.indexOf('/post') === -1 && req.url.indexOf('/posts') === -1) {
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
    debug('Got a put req', req.url)
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