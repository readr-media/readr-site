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
  REDIS_TIMEOUT, } = require('../config')

const debug = require('debug')('READR:api:middle:redisHandler')

const redisPoolRead = RedisConnectionPool('myRedisPoolRead', {
  host: REDIS_READ_HOST,
  port: REDIS_READ_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: {
    auth_pass: REDIS_AUTH,
  },
})

const redisPoolWrite = isProd ? RedisConnectionPool('myRedisPoolWrite', {
  host: REDIS_WRITE_HOST,
  port: REDIS_WRITE_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: {
    auth_pass: REDIS_AUTH,
  },
}) : redisPoolRead

const redisFetching = (key, callback) => {
  debug('Fetching data from redis.')
  debug(decodeURIComponent(key))
  redisPoolRead.get(decodeURIComponent(key), (error, data) => {
    if (!error) {
      redisPoolRead.ttl(decodeURIComponent(key), (err, dt) => {
        if (!err && dt) {
          debug('Ttl:', dt)
          if (dt <= -1) {
            redisPoolWrite.del(decodeURIComponent(key), (e) => {
              if (e) {
                console.error('REDIS: deleting key ', decodeURIComponent(key), 'from redis in fail ', e)
              }
              console.error('REDIS: deleting key ', decodeURIComponent(key), 'from redis in fail ', e)
              callback && callback({ e, data, })
            })
          } else {
            callback && callback({ err, data, })
          }
        } else {
          console.error('REDIS: fetching ttl in fail ', err)
          callback && callback({ err, data, })
        }
      })
    } else {
      console.error('REDIS: fetching key/data in fail ', error)
      callback && callback({ error, data, })
    }
  })
}
const redisWriting = (key, data, callback, timeout) => {
  debug('Setting key/data to redis. Timeout:', timeout || REDIS_TIMEOUT)
  debug(decodeURIComponent(key))
  redisPoolWrite.set(decodeURIComponent(key), data, (err) => {
    if(err) {
      console.error('redis writing in fail. ', decodeURIComponent(key), err)
    } else {
      redisPoolWrite.expire(decodeURIComponent(key), timeout || REDIS_TIMEOUT, function(error) {
        if(error) {
          console.error('failed to set redis expire time. ', decodeURIComponent(key), err)
        } else {
          debug('Wrote redis successfully.')
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
  redisFetching(req.url, ({ error, data, }) => {
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
  redisWriting,
}
