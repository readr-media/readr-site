const { get } = require('lodash')
const { sendActivationMail } = require('./comm')
const config = require('../../config')
const debug = require('debug')('READR:api:middle:member:register')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const sendRegisterReq = (req, res) => {
  if (!req.body.email || !(req.body.password || req.body.social_id)) {
    res.status(400).send({ message: 'Please offer all requirements.' })
    return
  }

  delete req.body.idToken
  delete req.body.email

  const url = `${apiHost}/register`

  superagent
  .post(url)
  .send(req.body)
  .end((err, resp) => {
    if (!err && resp) {
      sendActivationMail({ id: req.body.id, email: req.body.mail, way: 'member' }, (e, response, tokenForActivation) => {
        if (!e && response) {
          res.status(200).send({ token: tokenForActivation })
        } else {
          res.status(response.status).json(e)
          console.error(`error during register: ${url}`)
          console.error(e)
        }
      })
    } else {
      res.status(500).json(get(err, [ 'response', 'body' ], { Error: 'Error occured.' }))
      console.error(`error during register: ${url}`)
      console.error(err)
    }
  })
}

const preRigister = (req, res, next) => {
  debug(`Got a new reuqest of register:`)
  debug(req.body)
  debug(`At ${(new Date).toString()}`)

  if (req.body.register_mode === 'oauth-goo') {
    const auth = new GoogleAuth()
    const client = new auth.OAuth2(GOOGLE_CLIENT_ID, '', '')
    client.verifyIdToken(
      req.body.idToken,
      GOOGLE_CLIENT_ID,
      (e, login) => {
        if (e) {
          res.status(403).send(e.message).end()
          return
        }
        const payload = login.getPayload()
        if (payload[ 'aud' ] !== GOOGLE_CLIENT_ID) {
          res.status(403).send('Forbidden. Invalid token detected.').end()
          return
        }
        req.body.id = payload[ 'sub' ]
        req.body.mail = payload[ 'email' ]
        req.body.email = payload[ 'email' ]
        req.body.social_id = payload[ 'sub' ]
        next()
      })
  } else if (req.body.register_mode === 'oauth-fb') {
    req.body.mail = req.body.email
    req.body.id = req.body.social_id
    next()
  } else {
    req.body.mail = req.body.email
    req.body.id = req.body.email
    req.body.register_mode = 'ordinary'
    if (req.body.role !== null && req.body.role !== undefined && !req.body.password) {
      req.body.password = 'none'
    }
    next()
  }
}

router.post('/', preRigister, sendRegisterReq)
router.post('/admin', (req, res) => {
  debug('Add member by Admin')
  sendActivationMail({ id: req.body.id, email: req.body.mail, role: req.body.role, way: 'admin' }, (e, response) => {
    if (!e && response) {
      res.status(200).end()
    } else {
      res.status(response.status).json(e)
      console.error(`error during register`)
      console.error(e)
    }
  })
})

module.exports = router
