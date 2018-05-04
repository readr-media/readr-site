const { buildUserForTalk, updateUserForTalk, } = require('../talk')
const { fetchMem, } = require('./comm')
const { handlerError, } = require('../../comm')
const { sendInitializingSuccessEmail, } = require('./comm')
const { get, } = require('lodash')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:middle:member:initMember')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const update_default_data = (req, res, next) => {
  const avatar_default = 'https://www.readr.tw/public/icons/exclamation.png'
  const id = get(req, 'user.id')
  const nickname = get(req, 'body.nickname')
  const role = get(req, 'user.role')
  debug('Goin to give a basic profile to talk')
  updateUserForTalk(id, {
    username: nickname,
    metadata: { avatar: avatar_default, },
    role,
  }).then(() => {
    debug('Update talk data for member successfully.')
    next()
  })
}

const send_email_for_initializing_successfully = (req) => {
  sendInitializingSuccessEmail({ email: get(req, 'user.id'), }).then(({ error, }) => {
    if (!error) {
      debug('Sending email to notify member about initializing completion successfully.')
    } else {
      debug('Sending email to notify member about initializing completion in fail.', get(req, 'user.id'))
    }
  })
}

router.post('/', (req, res, next) => {
  if (get(req, [ 'user', 'type', ]) !== 'init') { res.status(403).send(`Forbidden.`) }
  debug('Got a call to init mem.')
  debug(req.user)
  const id = req.user.id
  const role = req.user.role
  fetchMem({ id, })
  .then(({ res: data, }) => {
    const member = get(data, [ 'body', '_items', 0, ])
    debug('Got mem:')
    debug(member)
    superagent
    .put(`${apiHost}/member/password`)
    .send({
      id: `${get(member, 'id')}`,
      password: req.body.password,
    })
    .end((err, response) => {
      if (!err && response) {
        superagent
        .put(`${apiHost}/member`)
        .send({
          id: get(member, 'id'),
          nickname: req.body.nickname,
          role,
          active: 1,
        })
        .end((e, r) => {
          if (!e && r) {
            buildUserForTalk({
              id: get(member, 'id'),
              mail: get(member, 'mail'),
              nickname: req.body.nickname,
            }).then(() => {
              const cookies = new Cookies( req, res, {} )
              cookies.set('setup', '', {
                httpOnly: false,
                domain: config.DOMAIN,
                expires: new Date(Date.now() - 1000),
              })  
              res.status(200).end()
  
              /**
               * Go update nickname and default avatar_img to talk server
               */
              next()
            })
          } else {
            const err_wrapper = handlerError(e, r)
            res.status(err_wrapper.status).send(err_wrapper.text)
            console.error(`Error occurred during initing mem.`)
            console.error(e)
          }
        })
      } else {
        const err_wrapper = handlerError(err, response)
        res.status(err_wrapper.status).send(err_wrapper.text)
        console.error(`Error occurred during initing mem.`)
        console.error(err)
      }
    })
  })
  .catch(({ err, res: response, }) => {
    const err_wrapper = handlerError(err, response)
    res.status(err_wrapper.status).send(err_wrapper.text)
    console.error(`Error occurred during initing mem.`)
    console.error(err)
  })
}, update_default_data, send_email_for_initializing_successfully)

module.exports = router
