const config = require('../../config')
const debug = require('debug')('READR:api:gcLogger')
const express = require('express')
const router = express.Router()

const Logging = require('@google-cloud/logging')
const loggingClient = Logging({
  projectId: config.GCP_PROJECT_ID,
  keyFilename: config.GCP_KEYFILE,
})

router.post('/', (req, res) => {
  debug('Got Logging call!(from ip', req.clientIp, ')')
  const data = Object.assign({}, req.body, { ip: req.clientIp, }) || {}
  const log = loggingClient.log(config.GCP_STACKDRIVER_LOG_NAME)
  const metadata = { resource: { type: 'global', }, }
  const entry = log.entry(metadata, data)

  log.write(entry).then(() => {
    debug('Logging successfully.')
  })
  .catch(err => {
    console.error('Client info logging error occurred:', err)
  })

  /**
   * response whatever, it doesn't matter if logging in fail
   */
  res.send({ msg: 'Got a loggin req.', })
})

module.exports = router