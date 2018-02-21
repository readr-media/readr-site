const { buildUserForTalk } = require('../talk')
const _ = require('lodash')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:member:activation')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const activateMem = (member) => new Promise((resolve) => {
  const url = `${apiHost}/member`
  const payload = {
    id: member.id,
    role: member.role || 1,
    active: 1
  }
  superagent
    .put(url)
    .send(payload)
    .end((err, res) => {
      debug('Finished avtivating the member', member.id)
      resolve({ err, res })
    })
})

const fetchMem = (member) => new Promise((resolve) => {
  superagent
  .get(`${apiHost}/member/${member.id}`)
  .end((err, res) => {
    resolve({ err, res })
  })
})

const activate = (req, res) => {
  debug('req.url', req.url)
  const decoded = req.decoded
  fetchMem(decoded).then(({ err, res: data }) => {
    debug('Fecth member data sucessfully.')
    const member = _.get(data, [ 'body', '_items', 0 ])
    if (err) {
      console.log(data.status)
      console.log(err)
      res.status(data.status).json(err)
    } else {
      debug('data', _.get(data, [ 'body', '_items', 0, 'active' ]))
      if (_.get(member, [ 'active' ]) === 0) {
        if (decoded.way !== 'admin') {
          debug('About to send req to activate mem')
          activateMem(member).then(({ err: e, res: r }) => {
            if (!e && r) {
              buildUserForTalk(member).then(() => {
                res.redirect(302, '/login')
              })
            } else {
              console.log(r.status)
              console.log(e)
              res.status(r.status).json(e)
            }
          })
        } else {
          const tokenForActivation = jwtService.generateActivateAccountJwt({
            id: decoded.id, role: decoded.role || 1, way: 'initmember', secret: currSecret
          })
          const cookies = new Cookies( req, res, {} )
          cookies.set('initmember', tokenForActivation, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })      
          res.redirect(302, '/initmember')
        }
      } else {
        res.redirect(302, '/')
      }
    }
  })
}

router.get('*', activate)

module.exports = router
