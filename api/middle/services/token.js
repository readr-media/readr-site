const { findIndex, } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:api:services:token')
const express = require('express')
const jwtService = require('../../service.js')
const router = express.Router()

// const jwtExpress = require('express-jwt')
// const authVerify = jwtExpress({ secret: config.JWT_SECRET })

const setupClientCache = (req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate")
  res.header("Pragma", "no-cache")
  res.header("Expires", "0")
  next()
}

router.get('/:type', setupClientCache, (req, res) => {
  const type = req.params.type
  debug('Token type:', type)
  if (findIndex(config.DISPOSABLE_TOKEN_WHITE_LIST, (o) => (o === type)) > -1) {
    const token = jwtService.generateDisposableJwt({ host: config.SERVER_HOST, })
    res.status(200).send({ token, })
  } else {
    res.status(403).send('Forbidden.')
  }
})
router.get('*', (req, res) => {
  res.status(403).send('Forbidden.')
})

module.exports = router