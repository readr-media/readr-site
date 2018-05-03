// const debug = require('debug')('READR:api:memos')
const express = require('express')
const router = express.Router()
const publicQueryValidation = require('../../services/validate')
const schema = require('./schema')
const superagent = require('superagent')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, } = require('../../config')
const { handlerError, } = require('../../comm')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

router.get('/', publicQueryValidation.validate(schema.memos), (req, res) => {
  /**
   * ToDo: have to check if client has the right to fetch memos of this proj.
   */
  const url = `${apiHost}/memos${req.url}`
  superagent
  .get(url)
  .timeout(API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      // debug(r)
      const resData = JSON.parse(r.text)
      res.json(resData)
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`error during fetch public post data from : ${url}`)
      console.error(e)
    }
  })
})
router.get('/:id', (req, res) => {
  /**
   * ToDo: have to check if client has the right to fetch memos of this proj.
   */
  const url = `${apiHost}/memo/${req.params.id}`
  superagent
  .get(url)
  .timeout(API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      // debug(r)
      const resData = JSON.parse(r.text)
      res.json(resData)
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`error during fetch public post data from : ${url}`)
      console.error(e)
    }
  })
})

module.exports = router