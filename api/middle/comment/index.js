const { find } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:api:comment')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')


router.get('/count', (req, res) => {
  const paramsStr = req.url.split('?')[1]
  const params = paramsStr ? paramsStr.split('&') : []
  let asset_url = find(params, (p) => (p.indexOf('asset_url') > -1))
  asset_url = asset_url ? asset_url.split('=')[ 1 ] : ''
  debug('About to fetch comment count of asset_url')
  debug('paramsStr', paramsStr)
  debug('params', params)
  debug('asset_url', asset_url)
  superagent
  .get(`${config.TALK_SERVER}/api/v1/graph/ql/graphql?query={commentCount(query:{asset_url:"${asset_url}"})}`)
  .end((e, r) => {
    if (!e && r) {
      debug('res.body:')
      debug(r.body)
      res.send({
        count: r.body.data.commentCount
      })
    } else {
      debug('err', e)
      res.status(500).json(e)
    }
  })
})

module.exports = router
