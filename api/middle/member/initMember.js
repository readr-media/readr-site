const { buildUserForTalk } = require('../talk')
const { get } = require('lodash')
const Cookies = require('cookies')
const config = require('../../config')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.post('/', (req, res) => {
  if (get(req, [ 'user', 'type' ]) !== 'init') { res.status(403).send(`Forbidden.`) }
  const id = req.user.id
  const role = req.user.role
  superagent
  .put(`${apiHost}/member/password`)
  .send({
    id,
    password: req.body.password
  })
  .end((err, response) => {
    if (!err && response) {
      superagent
      .put(`${apiHost}/member`)
      .send({
        id,
        nickname: req.body.nickname,
        role,
        active: 1
      })
      .end((e, r) => {
        if (!e && r) {
          buildUserForTalk({
            id,
            mail: id,
            nickname: req.body.nickname
          }).then(() => {
            const cookies = new Cookies( req, res, {} )
            cookies.set('setup', '', { httpOnly: false, expires: new Date(Date.now() - 1000) })  
            res.status(200).end()
          })
        } else {
          res.status(r.status).json(e)
        }
      })
    } else {
      res.status(500).json(err)
    }
  })
})

module.exports = router
