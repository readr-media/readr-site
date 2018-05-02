const debug = require('debug')('READR:api:memos')
const express = require('express')
const router = express.Router()
const publicQueryValidation = require('../../services/validate')
const schema = require('./schema')

router.get('*', publicQueryValidation.validate(schema.memos), (req, res, next) => {
  /**
   * ToDo: have to check if client has the right to fetch memos of this proj.
   */
  debug('Pass!')
  debug('Pass!')
  debug('Pass!')
  next()
})

module.exports = router