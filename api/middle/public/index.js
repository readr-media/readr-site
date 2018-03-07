const { fetchFromRedis, redisFetching, redisWriting, insertIntoRedis } = require('../redisHandler')
const { find, pick } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:api:public')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const publicQueryValidation = require('./validate')
const schema = require('./schema')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.get('/members', publicQueryValidation.validate(schema.members), (req, res, next) => {
  const url = `${apiHost}${req.url}`
  debug('Abt to fetch public members data.')
  debug('>>>', req.url)
  redisFetching(`member${req.url}`, ({ err, data }) => {
    if (!err && data) {
      debug('Fetch public members data from Redis.')
      debug('>>>', req.url)
      const mem = JSON.parse(data)
      res.json({
        'items': mem['_items'].map((object) => pick(object, [ 'id', 'nickname', 'description', 'profile_image']))
      })
    } else {
      superagent
      .get(url)
      .end((e, response) => {
        debug('Fetch public members data from api.', url)
        if (!e && response) {
          redisWriting(`member${req.url}`, response.text)
          const mem = JSON.parse(response.text)
          res.json({
            'items': mem['_items'].map((object) => pick(object, [ 'id', 'nickname', 'description', 'profile_image']))
          })
        } else {
          res.status(response.status).send('{\'error\':' + e + '}')
          console.error(`error during fetch public data from: member${req.url}`)
          console.error(e)
        }
      })
    }
  })
})

router.get('/posts', publicQueryValidation.validate(schema.posts), (req, res, next) => {
  const activePostQueryString = '{"$in":[1]}'
  if (Object.keys(req.query).length === 0) {
    req.url += `?active=${activePostQueryString}`
  } else {
    req.url += `&active=${activePostQueryString}`
  }
  next()
},
fetchFromRedis,
function (req, res, next) {
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
          response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
      .end((e, r) => {
        if (!e && r) {
          const dt = JSON.parse(r.text)
          if (dt['_items'] !== null && dt.constructor === Object) {
            res.dataString = r.text
            /**
             * if data not empty, go next to save data to redis
             */
            next()
          }
          const resData = JSON.parse(r.text)
          res.json(resData)
        } else {
          res.json(e)
          console.error(`error during fetch public data from : ${url}`)
          console.error(e)  
        }
      })
    }
}, insertIntoRedis)

module.exports = router
