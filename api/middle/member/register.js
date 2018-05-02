const { OAuth2Client, } = require('google-auth-library')
const { get, } = require('lodash')
const { redisWriting, } = require('../redisHandler')
const { sendActivationMail, } = require('./comm')
const { API_HOST, API_PORT, API_PROTOCOL, GOOGLE_CLIENT_ID, } = require('../../config')
const debug = require('debug')('READR:api:middle:member:register')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT
const sendRegisterReq = (req, res) => {
  if (!req.body.email || !(req.body.password || req.body.social_id)) {
    res.status(400).send({ message: 'Please offer all requirements.', })
    return
  }

  const tokenShouldBeBanned = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
  delete req.body.idToken
  delete req.body.email
  // delete req.body.id

  const url = `${apiHost}/register`

  superagent
  .post(url)
  .send(req.body)
  .end((err, resp) => {
    if (!err && resp) {
      sendActivationMail({ id: req.body.mail, email: req.body.mail, type: 'member', }, (e, response, tokenForActivation) => {
        if (!e && response) {
          res.status(200).send({ token: tokenForActivation, })
          /**
           * Revoke the token
           */
          redisWriting(tokenShouldBeBanned, 'registered', null, 24 * 60 * 60 * 1000)
        } else {
          res.status(response.status).json(e)
          console.error(`error during register: ${url}`)
          console.error(e)
        }
      })
    } else {
      res.status(500).json(get(err, [ 'response', 'body', ], { Error: 'Error occured.', }))
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
    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
    debug('Registering by google account.')
    const verify = async () => {
      return await client.verifyIdToken({
          idToken: req.body.idToken,
          audience: GOOGLE_CLIENT_ID,
      })
    }
    verify().then((ticket) => {
      debug('Going to fetch data from payload.')
      const payload = ticket.getPayload()
      if (payload[ 'aud' ] !== GOOGLE_CLIENT_ID) {
        res.status(403).send('Forbidden. Invalid token detected.').end()
        return
      }
      req.body.id = payload[ 'sub' ]
      req.body.nickname = req.body.nickname || payload[ 'name' ]
      req.body.profile_image = payload[ 'picture' ] || null
      req.body.mail = payload[ 'email' ]
      req.body.email = payload[ 'email' ]
      req.body.social_id = payload[ 'sub' ]
      debug(payload)
      debug(req.body)
      next()
    }).catch((e) => {
      debug(e.message)
      res.status(403).send(e.message).end()
      return
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
router.post('/admin', (req, res, next) => {
  const url = `${apiHost}/member`
  delete req.body.id
  superagent
    .post(url)
    .send(req.body)
    .end((err, resp) => {
      if (!err) {
        debug('Added member by Admin successfully.')
        next()
      } else {
        res.status(resp.status).json(err)
        console.error(`Error occurred during register`)
        console.error(err)
      }
    })
}, (req, res) => {
  sendActivationMail({ id: req.body.mail, email: req.body.mail, role: req.body.role, type: 'init', }, (e, response) => {
    if (!e && response) {
      debug('A member added by Admin')
      debug(req.body)
      res.status(200).end()
    } else {
      res.status(response.status).json(e)
      console.error(`Error occurred during register`)
      console.error(e)
    }
  })
})

module.exports = router
