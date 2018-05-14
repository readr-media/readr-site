const debug = require('debug')('READR:api:proxy')
const express = require('express')
const http = require('http')
const router = express.Router()
// const publicQueryValidation = require('../../services/validate')
// const schema = require('./schema')
const superagent = require('superagent')
const zlib = require('zlib')
const { API_TIMEOUT, API_DEADLINE, TALK_SERVER, TALK_SERVER_HOST, TALK_SERVER_PORT, TALK_SERVER_ROOT, } = require('../../config')
const { GraphQLClient, } = require('graphql-request')
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
    debug('File.', req.url)
    const options = {
      host: TALK_SERVER_HOST || 'localhost',
      port: `${TALK_SERVER_PORT}` || '80',
      path: `${TALK_SERVER_ROOT || ''}${req.url}`,
      method: 'GET',
      headers,
    }
    debug('options:')
    debug(options)
    const request = http.request(options, (response) => {  
      res.set(response.headers)
      response.pipe(res).pipe(zlib.createGzip())
    }).on('error', (err) => {
      const err_wrapper = handlerError(err)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`error during fetch stuff from : ${TALK_SERVER}${req.url}`)
      console.error(err)
    })
    req.pipe(request)
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
  client.request(query, variables).then(data => {
    debug(data)
    res.send({ data, })
  }).catch(err => {
    debug(err)
    const err_wrapper = handlerError(err)
    res.status(err_wrapper.status).json(err_wrapper.text)
  })
})

module.exports = router