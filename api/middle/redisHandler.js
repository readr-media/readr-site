const isProd = process.env.NODE_ENV === 'production'
// const isTest = process.env.NODE_ENV === 'test'
const RedisConnectionPool = require('redis-connection-pool')

const { 
  REDIS_AUTH,
  REDIS_MAX_CLIENT,
  REDIS_READ_HOST,
  REDIS_READ_PORT,
  REDIS_WRITE_HOST,
  REDIS_WRITE_PORT,
  REDIS_TIMEOUT } = require('../config')

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
  redisPoolRead.get(decodeURIComponent(url), (error, data) => {
    redisPoolRead.ttl(decodeURIComponent(url), (err, dt) => {
      if (!err && dt) {
        if (dt <= -1) {
          redisPoolWrite.del(decodeURIComponent(url), (e) => {
            if (e) {
              console.log('deleting key ', decodeURIComponent(url), 'from redis in fail ', e)
            }
          })
        }
      } else {
        console.log('fetching ttl in fail ', err)
      }
    })
    callback && callback({ error, data })
  })
}
const redisWriting = (url, data, callback) => {
  redisPoolWrite.set(decodeURIComponent(url), data, (err) => {
    if(err) {
      console.log('redis writing in fail. ', decodeURIComponent(url), err)
    } else {
      redisPoolWrite.expire(decodeURIComponent(url), REDIS_TIMEOUT, function(error) {
        if(error) {
          console.log('failed to set redis expire time. ', decodeURIComponent(url), err)
        } else {
          callback && callback()
        }
      })
    }
  })
}
const insertIntoRedis = (req, res) => {
  redisWriting(req.url, res.dataString, () => {
    // next()
  })
}
const fetchFromRedis = (req, res, next) => {
  redisFetching(req.url, ({ error, data }) => {
    if (!error) {
      res.redis = data
      next()
    } else {
      next(error)
    }
  })
}

module.exports = {
  fetchFromRedis,
  insertIntoRedis,
  redisFetching,
  redisWriting
}
