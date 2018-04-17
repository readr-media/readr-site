const { OAuth2Client, } = require('google-auth-library')
const { constructScope, } = require('../../services/perm')
const { get, } = require('lodash')
const { redisWriting, } = require('../redisHandler')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api/middle/member')
const express = require('express')
const jwtService = require('../../service.js')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const login = (req, res) => {
  debug('About to send login req.')
  if ((!req.body.email || !req.body.password) && (req.body.login_mode === 'google' && req.body.login_mode === 'facebook')) {
    res.status(400).send({ message: 'Please offer id/password.', })
    return
  }
  const tokenShouldBeBanned = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
  const url = `${apiHost}/login`
  superagent
    .post(url)
    .send(req.body)
    .end((err, response) => {
      debug('Got response from login req.')
      debug('login_mode:', req.body.login_mode)
      if (!err && response) {
        const mem = get(response, [ 'body', 'member', ], {})
        const scopes = constructScope(get(response, [ 'body', 'permissions', ]), get(mem, [ 'role', ], 1))
        const token = jwtService.generateJwt({
          id: get(mem, 'id', req.body.id),
          memuuid: get(mem, 'uuid'),
          email: get(mem, 'mail', req.body.email),
          name: get(mem, 'name'),
          nickname: get(mem, 'nickname'),
          role: get(mem, 'role', 1),
          talk_id: get(mem, 'talk_id', ''),
          keepAlive: req.body.keepAlive,
          scopes,
        })
        
        const cookies = new Cookies( req, res, {} )
        cookies.set(config.JWT_SIGNING_COOKIE_NAME, token, {
          httpOnly: false,
          domain: config.DOMAIN,
          // secure: process.env.NODE_ENV === 'production',
          expires: new Date(Date.now() + (req.body.keepAlive ? 14 : 1) * 24 * 60 * 60 * 1000),
        })
        /**
         * Revoke the token
         */
        redisWriting(tokenShouldBeBanned, 'logged', null, 24 * 60 * 60 * 1000)
        res.status(200).send({ token, profile: {
          name: get(mem, 'name'),
          nickname: get(mem, 'nickname'),
          description: get(mem, 'description'),
          id: get(mem, 'id'),
          uuid: get(mem, 'uuid'),
          mail: get(mem, 'mail', req.body.email),
          role: get(mem, 'role', 1),
          scopes,
          profileImage: get(mem, 'profileImage'),
          points: get(mem, 'points'),
        },})
      } else {
        debug('Validated in fail. Please offer correct credentials.')
        res.status(401).send('Validated in fail. Please offer correct credentials.')
      }
    })
}

const preLogin = (req, res, next) => {
  debug(`Got a new reuqest of login:
    mail -> ${req.body.email}
    At ${(new Date).toString()}`)

  if (req.body.login_mode === 'google') {
    const client = new OAuth2Client(config.GOOGLE_CLIENT_ID, '', '')
    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: config.GOOGLE_CLIENT_ID,
    }, (e, login) => {
      const payload = login.getPayload()
      if (payload[ 'aud' ] !== config.GOOGLE_CLIENT_ID) {
        res.status(403).send('Forbidden. Invalid token detected.').end()
        return
      }
      req.body.id = payload[ 'sub' ]
      req.body.mail = payload[ 'email' ]
      req.body.email = payload[ 'email' ]
      req.body.register_mode = 'oauth-goo'
      next()
    })
  } else if (req.body.login_mode === 'facebook') {
    req.body.register_mode = 'oauth-fb'    
    next()
  } else {
    req.body.id = req.body.email
    req.body.register_mode = 'ordinary'    
    next()
  }  
}

router.post('*', preLogin, login)
module.exports = router