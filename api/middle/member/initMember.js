const config = require('../../config')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.post('/', (req, res) => {
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
      .end((e, response) => {
        if (!e && response) {
          res.status(200).end()
        } else {
          res.status(500).json(e)
        }
      })
    } else {
      res.status(500).json(err)
    }
  })
})

module.exports = router
