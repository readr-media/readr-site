const { API_DEADLINE, API_HOST, API_PORT, API_PROTOCOL, API_TIMEOUT } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT } = require('./config')
const { SERVER_PROTOCOL, SERVER_HOST } = require('./config')
const Cookies = require('cookies')
const RedisConnectionPool = require('redis-connection-pool')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const express = require('express')
const isProd = process.env.NODE_ENV === 'production'
const jwt = require('jsonwebtoken')
const jwtExpress = require('express-jwt')

const router = express.Router()
const superagent = require('superagent')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT
const consoleLogOnDev = ({ msg, showSplitLine }) => {
  if (!isProd) {
    showSplitLine && console.log('####################')
    console.log(msg)
    showSplitLine && console.log('####################')
  }
}

const SECRET_KEY = `_csrf_secret`
const SECRET_LENGTH = 10
const currSecret = crypto.pseudoRandomBytes(SECRET_LENGTH).toString('base64')

const generateJwt = ({ id, email, keepAlive }) => {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + (keepAlive ? 30 : 1))
  return jwt.sign({
    id: id,
    email: email,
    exp: parseInt(expiry.getTime() / 1000)
  }, currSecret)
}
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
router.use('/member', auth, function(req, res, next) {
  next()
})
router.get('*', function(req, res) {
  console.log(apiHost)  
  console.log(decodeURIComponent(req.url))
  const url = `${apiHost}${req.url}`
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
        .end((err, response) => {
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
      }
    })
  } catch (e) {
    res.send(e)
    console.error(`error during fetch data from api : ${req.url}`)
    console.error(e)
  }
})

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())

const basicPostRequst = (url, req, res) => {
  superagent
  .post(url)
  .send(req.body)
  .end((err, response) => {
    if (!err && response) {
      res.status(200).end()
    } else {
      res.json(err)
    }
  })
}

router.post('/login', (req, res) => {
  consoleLogOnDev({
    msg: `Got a new reuqest of login:
          mail -> ${req.body.email}
          At ${(new Date).toString()}`
  })
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: 'Please offer id/password.' })
    return
  }

  /**
   * ToDo:
   *    Should send a post req to the api server here.
   *    Then send the proper res to client.
   */

  const token = generateJwt({
    id: '--',
    email: req.body.email,
    keepAlive: req.body.keepAlive
  })
  const cookies = new Cookies( req, res, {} )
  cookies.set('csrf', token, { httpOnly: false, expires: new Date(Date.now() + (req.body.keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000) })
  res.status(200).send({ token })
})

router.post('/register', (req, res) => {
  consoleLogOnDev({
    msg: `Got a new reuqest of register:
          nickname -> ${req.body.nickname}
          mail -> ${req.body.email}
          At ${(new Date).toString()}`
  })
  if (!req.body.email || !req.body.password || !req.body.nickname) {
    res.status(400).send({ message: 'Please offer all requirements.' })
    return
  }
  req.body.mail = req.body.email
  const url = `${apiHost}/member`
  basicPostRequst(url, req, res)
})

router.post('/article', auth, function (req, res) {
  const url = `${apiHost}${req.url}`
  basicPostRequst(url, req, res)
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
      res.status(200).end()
    } else {
      res.json(err)
    }
  })
})

module.exports = router