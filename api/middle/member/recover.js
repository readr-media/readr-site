const { fetchMem, sendRecoverPwdEmail, verifyToken, } = require('./comm')
const { redisFetching, redisWriting, } = require('../redisHandler')
const { get, } = require('lodash')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:member:recoverpwd')
const express = require('express')
const jwtExpress = require('express-jwt')
const jwtService = require('../../service.js')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const authVerify = jwtExpress({
  secret: config.JWT_SECRET,
  isRevoked: (req, payload, done) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
    redisFetching(token, ({ error, data, }) => {
      error && console.error('Error occurred during fetching token from redis.')
      error && console.error(error)
      done(null, !!data)
    })
  },
})
router.post('/', authVerify, (req, res) => {
  /**
   * Check if the account exists at first.
   */
  debug('About to check if the account exists.')
  debug('Payload:')
  debug(req.body)

  const account = req.body && req.body.email
  // const url = `${apiHost}/member/${account}`
  if (!account) { res.status(400).end() }
  fetchMem({ id: account, }).then(({ err, res: response, }) => {
    if (!err) {
      /**
       * About to send gen token and go reset process.
       */
      debug('account')
      debug(response.body)
      sendRecoverPwdEmail({
        email: account,
      }, (e, r) => {
        debug('Sending done.')
        if (!e) {
          res.status(200).end()
        } else {
          res.status(r.status).json(e)
          console.error(`Error occurred during sending reset email.`)
          console.error(e)
        }
      })
    } else {
      debug('response.status:', response.status)
      debug(err)
      res.status(response.status).send(err)
      console.error('Got error from request to api:')
      console.error(err)
    }
  })
})

router.post('/set', authVerify, (req, res) => {
  debug('Going to set up pwd:', get(req, [ 'user', ]))
  debug(req.body)
  if (get(req, [ 'user', 'type', ]) !== 'reset') { res.status(403).send(`Forbidden.`) }
  const id = req.user.id
  superagent
  .put(`${apiHost}/member/password`)
  .send({
    id,
    password: req.body.password,
  })
  .end((err, response) => {
    if (!err && response) {
      debug('reset pwd successfully.')
      const cookies = new Cookies( req, res, {} )
      cookies.set('setup', '', { httpOnly: false, expires: new Date(Date.now() - 1000), })  
      /**
       * Revoke the token
       */
      const tokenShouldBeBanned = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
      redisWriting(tokenShouldBeBanned, 'setuppwd-ed', null, 24 * 60 * 60 * 1000)        
      res.status(response.status).end()
    } else {
      res.status(response.status).json(err)
      console.error('Error occurred during reseting pwd.')
      console.error(err)
    }
  })

})

router.get('*', verifyToken, (req, res) => {
  const decoded = req.decoded
  const curr_token = req.url.split('/')[1]
  if (!decoded) { res.status(403).send(`Forbidden.`) }
  debug('About to go reset pwd')
  debug('>>>', decoded.id)
  const token = jwtService.generateResetToken({
    id: decoded.id,
    type: 'reset',
  })
  const cookies = new Cookies( req, res, {} )
  cookies.set('setup', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), })      
  res.redirect(302, '/setup/reset')
  /**
   * Revoke the token
   */
  redisWriting(curr_token, 'presetuppwd-ed', null, 24 * 60 * 60 * 1000) 
})

module.exports = router
