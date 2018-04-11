const { filter, get, map, } = require('lodash')
const { handlerError, } = require('../../comm')
const { sendInvitationEmail, } = require('./comm')
const { setupClientCache, } = require('../comm')
const { fetchFromRedisCmd, insertIntoRedisSadd, } = require('../redisHandler')
const config = require('../../config')
const debug = require('debug')('READR:api:middle:invitation')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const validator = require('validator')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.post('/', (req, res, next) => {
  debug('Got a invite call.')
  // debug(req.user)
  const emails = map(get(req.body, 'emails'), email => ({ email, status: 0, })) || []
  const url = `${apiHost}/member`
  const process = emails.length ? map(emails, (email_item) => new Promise(resolve => {
    superagent
    .post(url)
    .send({
      register_mode: 'ordinary',
      id: email_item.email,
      mail: email_item.email,
      active: 0,
      role: 1,
    }).end((err, resp) => {
      if (!err) {
        debug('Added member by inviting successfully.', email_item.email)
        email_item.status = 1
      } else {
        const err_wrapper = handlerError(err, resp)
        // res.status(err_wrapper.status).send(err_wrapper.text)
        console.error(`Error occurred during register`, email_item.email)
        console.error(err)
        email_item.status = 2
        email_item.msg = err_wrapper.text
      }
      resolve()
    })
  })) : [ new Promise(rslv => rslv()), ]
  
  debug(emails)
  Promise.all(process).then(() => {
    if (emails.length === 0) {
      res.send('No target is supposed to be invited.')
    } else {
      res.emails = emails
      next()
    }
  })
}, (req, res, next) => {
  debug('Goin to send email.')
  debug(res.emails)
  debug('res.emails.length ?', res.emails.length)
  debug(filter(res.emails, { status: 1, }))
  const process = res.emails.length ? map(filter(res.emails, { status: 1, }), (email_item, index) => new Promise(resolve => {
    debug('Abt to send invitation to', email_item.email)
    sendInvitationEmail({
      id: email_item.email,
      email: email_item.email,
      inviter: get(req, 'user.nickname', get(req, 'user.mail')),
      role: 1,
      type: 'init',
    }).then(({ error, response, }) => {
      if (!error && response) {
        debug(`Sending a invitation to ${email_item.email} successfully.`)
      } else {
        const err_wrapper = handlerError(error, response)
        email_item.status = 2
        email_item.msg = err_wrapper.text
        console.error(`Error occurred during sending invitation to`, res.emails[ index ],)
        console.error(error)
      }
      resolve()
    })
  })) : [ new Promise(rslv => rslv()), ]

  Promise.all(process).then(() => {
    debug(res.emails)
    res.send({ emails: res.emails, })
    
    const user_id = get(req, 'user.id')
    req.sadd = {
      key: `invited-${user_id}`,
      value: map(filter(res.emails, { status: 1, }), (email_item) => (email_item.email)),
    }
    debug('Goin to set valid emails to redis...')
    debug(req.sadd)
    if (get(req, 'sadd.value.length', 0)) {
      next()
    }
  })
}, insertIntoRedisSadd)

router.get('/quota', setupClientCache, (req, res, next) => {
  debug('Got a call for quota')
  const user_id = get(req, 'user.id')
  req.redis_get = {
    cmd: 'HMGET',
    key: `invite-${user_id}`,
    field: [ 'score', 'follow', 'comment', 'downline', ],
  }
  next()
}, fetchFromRedisCmd, (req, res, next) => {
  debug('Stuff from redis:')
  debug(res.redis)
  debug('score:', validator.toInt(get(res, [ 'redis', 0, ], '0') || '0'))
  debug('downline:', validator.toInt(get(res, [ 'redis', 3, ], '0') || '0'))
  res.downline = validator.toInt(get(res, [ 'redis', 3, ], '0') || '0')
  res.score =  validator.toInt(get(res, [ 'redis', 0, ], '0') || '0')

  const user_id = get(req, 'user.id')
  req.redis_get = {
    cmd: 'SCARD',
    key: `invited-${user_id}`,
  }
  debug('Go next...')
  next()
}, fetchFromRedisCmd, (req, res) => {
  const invited_count = get(res, 'redis', 0)
  debug('Invited people count:', invited_count)

  let quota = get(res, 'score', 0) - (invited_count - get(res, 'downline', 0))
  quota = get(res, 'downline', 0) === 0 ? get(res, 'score', 0) - invited_count : quota
  debug('quota', quota)
  res.send({ quota, })
})

module.exports = router