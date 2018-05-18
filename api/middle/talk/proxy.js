const Cookies = require('cookies')
const debug = require('debug')('READR:api:proxy')
const express = require('express')
const hyperquest = require('hyperquest')
const jwtService = require('../../service.js')
const router = express.Router()
const superagent = require('superagent')
const { API_TIMEOUT, API_DEADLINE, TALK_SERVER, } = require('../../config')
const { GraphQLClient, } = require('graphql-request')
const { checkPerm, } = require('../memo/qulification')
const { fetchMemoSingle, } = require('../memo/comm')
const { get, } = require('lodash')
const { handlerError, } = require('../../comm')

router.get('*', (req, res) => {
  debug('Got a call to fetch stuff for talk.')
  debug(req.url)
  const exp_content_type_text = /text\//
  const exp_target_file = /(?:.js)|(?:.css)/
  const headers = Object.assign({}, req.headers)

  if (headers[ 'accept-encoding' ]) {
    headers[ 'accept-encoding' ] = 'gzip'
  }

  if (exp_target_file.test(req.url)) {
    debug('File.', req.url, `${TALK_SERVER}${req.url}`)
    hyperquest(`${TALK_SERVER}${req.url}`, {
      method: 'GET',
      headers,
    }, (err, response) => {
      if (!err) {
        res.set(response.headers)
        response.pipe(res)
      } else {
        const err_wrapper = handlerError(err)
        res.status(err_wrapper.status).json(err_wrapper.text)      
        console.error(`error during fetch stuff from : ${TALK_SERVER}${req.url}`)
        console.error(err)        
      }     
    })      
  } else {
    debug('Request')
    superagent
      .get(`${TALK_SERVER}${req.url}`)
      .set(headers)
      .timeout(
        {
          response: API_TIMEOUT,
          deadline: API_DEADLINE ? API_DEADLINE : 60000,
        }
      )
      .end((err, response) => {
        if (!err) {
          const res_headers = Object.assign({}, response.headers)
          // delete res_headers[ 'content-encoding' ]        
          res.set(res_headers)
          if (exp_content_type_text.test(String(response.headers['content-type']))) {
            res.send(response.text)
          } else {
            res.send(response.body)
          }
        } else {
          const err_wrapper = handlerError(err, response)
          res.status(err_wrapper.status).json(err_wrapper.text)      
          console.error(`error during fetch stuff from : ${TALK_SERVER}${req.url}`)
          console.error(err)
        }
      })
    }
})

router.post('/api/v1/graph/ql', (req, res) => {
  const headers = Object.assign({}, req.headers)
  const client = new GraphQLClient(`${TALK_SERVER}/api/v1/graph/ql`, { headers, })

  const query = req.body.query
  const variables = req.body.variables
  
  debug('headers:')
  debug(headers)

  const fetchFromTalk = () => client.request(query, variables).then(data => {
    debug(data)
    res.send({ data, })
  }).catch(err => {
    debug(err)
    const err_wrapper = handlerError(err)
    res.status(err_wrapper.status).json(err_wrapper.text)
  })


  const asset_url = get(variables, 'assetUrl')
  const exp_asset_url = /\/memo\/([0-9]*)$/
  debug('asset_url', asset_url)

  const isAssetsMemo = asset_url && asset_url.match(exp_asset_url)
  debug('isAssetsMemo', isAssetsMemo)
  
  if (isAssetsMemo) {
    const cookies = new Cookies( req, res, {} )
    const cookie =  cookies.get('csrf')
    const memo_id = get(isAssetsMemo, 1)
    debug('memo_id', memo_id)
    debug('cookie', cookie)
    jwtService.verifyToken(cookie, (err, decoded) => {
      if (err) {
        res.status(403).send(`Invalid token.`)
        return
      } else {
        debug('decoded:')
        debug(decoded)
        fetchMemoSingle(memo_id)
        .then(memo => {
          const proj_id = get(memo, '_items.project_id', '')
          debug('proj_id', proj_id)
          return checkPerm(get(decoded, 'id'), [ proj_id, ])
        })
        .then(isAnyUnauthorized => {
          debug('isAnyUnauthorized', isAnyUnauthorized)          
          if (!isAnyUnauthorized) { res.status(403).send({ data: { assets: {}, setting: {}, }, message: 'Forbidden.', }) }
          fetchFromTalk()
        })
        .catch(err => {
          debug('err')
          debug(err)
          const err_wrapper = handlerError(err)
          res.status(err_wrapper.status).json(err_wrapper.text)
        })
      }
    })    
  } else {
    fetchFromTalk()
  }
})

module.exports = router