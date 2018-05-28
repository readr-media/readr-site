const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, } = require('../../config')
const { authVerify, } = require('../member/comm')
const { authorize, } = require('../../services/perm')
const { fetchFromRedis, insertIntoRedis, } = require('../redisHandler')
const { get, } = require('lodash')
const { handlerError, } = require('../../comm')
const { publishAction, } = require('../../gcs.js')
const debug = require('debug')('READR:api:middle:following')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

router.post('/byuser', (req, res, next) => {
  req.url = '/following/byuser'
  next()
}, [ authVerify, authorize, ], (req, res) => {
  debug('Got a /following/byuser call.')
  const url = `${apiHost}/following/byuser`
  superagent
  .get(url)
  .send(req.body)
  .timeout(API_TIMEOUT)
  .end((err, response) => {
    if (!err && response) {
      const resData = JSON.parse(response.text)
      res.json(resData)
    } else {
      if (err.status === 404) {
        res.status(404).json([])
      } else {
        res.json(err)
        console.error(`Error occurred during fetch data from : ${url}`)
        console.error(err)  
      }
    }
  })
})

router.post('/byresource', (req, res, next) => {
  req.url = '/following/byresource'
  next()
}, fetchFromRedis, (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.json(resData)
  } else {
    const url = `${apiHost}/following/byresource`
    debug('Got a /following/byresource call')
    debug(req.body)
    debug('url', url)
    superagent
    .get(url)
    .set('Content-Type', 'application/json')
    .send(req.body)
    .timeout(API_TIMEOUT)
    .end((err, response) => {
      if (!err && response) {
        const resData = JSON.parse(response.text)
        res.json(resData)
        /**
         * if data not empty, go next to save data to redis
         * ToDo: should add some statements.
         */
        res.dataString = response.text
        next()
      } else {
        const err_wrapper = handlerError(err, res)
        res.status(err_wrapper.status).send(err_wrapper.text)
        console.error(`Error occurred  during fetch data from : ${url}`)
        console.error(err)
      }
    })
  }
}, insertIntoRedis)

router.post('/pubsub', (req, res) => {
  const action = get(req, 'body.action', 'follow')
  publishAction(req.body, {
    typs: 'follow',
    action,
  }).then(result => {
    res.status(200).send(result)
  }).catch(error => {
    res.status(500).json(error)
  })
})

module.exports = router
