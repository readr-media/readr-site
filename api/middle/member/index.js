const { get, } = require('lodash')
const { handlerError, } = require('../../comm')
const { banUserForTalk, checkoutUserPerms, syncAvatar, updateUserRoleForTalk, updateUserNameForTalk, } = require('../talk')
const config = require('../../config')
const debug = require('debug')('READR:api:member')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.put('/role', (req, res) => {
  debug('Got a req to update user\'s role')
  debug(req.body)
  const url = `${apiHost}/member`
  superagent
  .put(url)
  .send(req.body)
  .end((err, response) => {
    if (!err && response) {
      debug('Update user\'s role sucessfully')
      checkoutUserPerms(req.body.role).then((talk_role) => {
        return updateUserRoleForTalk(talk_role, req.body.mail).then(() => res.status(200).end())
      })
    } else {
      res.status(500).json(err)
    }
  })
})

router.put('/', (req, res, next) => {
  req.body.nickname && updateUserNameForTalk(req.user.email, req.body.nickname)
  next()
})

router.post('/syncavatar', (req, res) => {
  debug('Got a avatar sync req.')
  debug(req.body)
  debug(req.user)
  const email = get(req.user, 'email', '')
  const url = get(req.body, 'url', null)
  syncAvatar(email, url)
  .then(() => {
    res.status(200).send('Sync avatar successfully.')
  })
  .catch((err) => {
    const err_wrapper = handlerError(err, {})
    res.status(err_wrapper.status).send(err_wrapper.text)
    console.error(`Error occurred  during snyc avatar : ${req.url}`)
    console.error(err)
  })
})

router.post('*', () => {})

router.delete('*', (req, res, next) => {
  debug('going to del member')
  debug(req.body)
  debug(req.url)
  const userid = req.url.split('/')[ 1 ]
  userid && banUserForTalk(userid).then(() => {
    next()
  })
})

module.exports = router
