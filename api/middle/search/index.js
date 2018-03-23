const config = require('../../config')
const debug = require('debug')('READR:api:search')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const { fetchFromRedis, insertIntoRedis, } = require('../redisHandler')
const { get, } = require('lodash')

router.get('/', fetchFromRedis, function(req, res, next) {
  debug('Got a search call.')
  let query = req.query
  let url = `${config.SEARCH_PROTOCOL}://${config.SEARCH_HOST}${config.SEARCH_ENDPOINT}`
  debug('>>> query', query)
  // res.send({})
  
  if (res.redis) {
    debug('****************')
    debug(res.redis)
    console.log('fetch data from Redis.', req.url)
    const resData = JSON.parse(res.redis)
    res.json(resData)
  } else {
    superagent
    .get(url)
    .timeout(config.SEARCH_API_TIMEOUT)
    .set('X-Algolia-API-Key', config.SEARCH_API_KEY)
    .set('X-Algolia-Application-Id', config.SEARCH_API_APPID)
    .query(query)
    .end(function(e, r) {
      debug('###############')
      if (e) {
        const status = get(r, 'status') || get(e, 'status') || 500
        res.status(status).send('{\'error\':' + e + '}')
        console.error(`error during fetch data from search : ${req.url}`)
        console.error(e)    
      } else {
        const dt = JSON.parse(r.text)
        if (Object.keys(dt).length !== 0 && dt.constructor === Object) {
          /**
           * if data not empty, go next to save data to redis
           */
          res.dataString = r.text
          debug('#####*****#####')
          debug('data')
          next()
        }
        const resData = JSON.parse(r.text)
        debug(resData)
        res.json(resData)
      }
    })
  }
}, insertIntoRedis)

module.exports = router