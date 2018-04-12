const { buildUserForTalk, updateUserForTalk, } = require('../talk')
const { get, } = require('lodash')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:middle:member:initMember')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const update_default_data = (req) => {
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
  })
}

router.post('/', (req, res, next) => {
  if (get(req, [ 'user', 'type', ]) !== 'init') { res.status(403).send(`Forbidden.`) }
  const id = req.user.id
  const role = req.user.role
  superagent
  .put(`${apiHost}/member/password`)
  .send({
    id,
    password: req.body.password,
  })
  .end((err, response) => {
    if (!err && response) {
      superagent
      .put(`${apiHost}/member`)
      .send({
        id,
        nickname: req.body.nickname,
        role,
        active: 1,
      })
      .end((e, r) => {
        if (!e && r) {
          buildUserForTalk({
            id,
            mail: id,
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
          res.status(r.status).json(e)
        }
      })
    } else {
      res.status(500).json(err)
    }
  })
}, update_default_data)

module.exports = router
