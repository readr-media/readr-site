const { get, } = require('lodash')
const { handlerError, } = require('../../comm')
const { fetchFromRedisCmd, } = require('../redisHandler')
const config = require('../../config')
const debug = require('debug')('READR:api:middle:notification')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.get('/:id?', (req, res, next) => {
  debug('Got a notification data call.')
  debug(req.user)
  const user_id = get(req, 'user.id')
  req.redis_get = {
    cmd: 'LRANGE',
    key: `notify_${user_id}`,
    field: [ 0, 49, ],
  }
  next()
}, fetchFromRedisCmd, (req, res) => {
  debug('Stuff from redis:')
  debug(res.redis)
  // res.header("Cache-Control", "public, max-age=3600")
  res.json({ items: res.redis, })
})
router.put('/ack', (req, res) => {
  debug('Gor a notification ack updating call.')
  debug(req.body)
  
  const user_id = get(req, 'user.id')
  const url = `${apiHost}/notify/read`
  debug('url', url)
  debug('params', Object.assign({}, req.body, { member_id: user_id, }))

  superagent
  .put(url)
  .send(Object.assign({}, req.body, { member_id: user_id, })).end((err, resp) => {
    if (!err) {
      debug('Sending acks to Pub/sub center successfully.')
      res.send({ status: 'Successfully.', })
    } else {
      const err_wrapper = handlerError(err, resp)
      res.status(err_wrapper.status).send(err_wrapper.text)
      console.error(`Error occurred during Sending acks to Pub/sub center`)
      console.error(err)
    }
  })
})

module.exports = router
