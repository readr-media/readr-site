const debug = require('debug')('READR:api:memos')
const express = require('express')
const router = express.Router()
const publicQueryValidation = require('../../services/validate')
const schema = require('./schema')
const superagent = require('superagent')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, } = require('../../config')
const { checkPerm, } = require('./qulification')
const { fetchMemoSingle, } = require('./comm')
const { get, } = require('lodash')
const { handlerError, } = require('../../comm')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

router.get('/', publicQueryValidation.validate(schema.memos), (req, res) => {
  const user_id = get(req, 'user.id')
  const project_id = JSON.parse(get(req, 'query.project_id', '[]'))
  debug('user_id', user_id)
  debug('project_id', project_id, typeof(project_id))

  checkPerm(user_id, [ ...project_id, ])
  .then(isAnyUnauthorized => {
    debug('isAnyUnauthorized', isAnyUnauthorized)
    if (isAnyUnauthorized) {
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
    } else {
      res.status(403).send(`Forbidden.`)
    }
  })
  .catch(err => {
    debug('err')
    debug(err)
    const err_wrapper = handlerError(err)
    res.status(err_wrapper.status).json(err_wrapper.text)
  })
})
router.get('/count', (req, res) => {
  debug('Going to get memos count.')
  /**
   * Not implment yet.
   */
  res.send({ count: 0, })
})
router.get('/:id', (req, res) => {
  let memo_data
  const exp_count = /\/count/
  debug('Going to get single memo.', req.params.id)
  debug('isCount', exp_count.test(req.params.id))
  fetchMemoSingle(req.params.id)
  .then(memo => {
    memo_data = memo
    const proj_id = get(memo_data, '_items.project_id', '')
    debug('proj_id', proj_id)
    return checkPerm(get(req, 'user.id'), [ proj_id, ])
  })
  .then(isAnyUnauthorized => {
    debug('isAnyUnauthorized', isAnyUnauthorized)          
    if (!isAnyUnauthorized) { return res.status(403).send(`Forbidden.`) }
    res.json(memo_data)
  })
  .catch(err => {
    debug('err')
    debug(err)
    const err_wrapper = handlerError(err)
    res.status(err_wrapper.status).json(err_wrapper.text)
  })  
})

module.exports = router