const { find } = require('lodash')
const { GraphQLClient } = require('graphql-request')
const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:comment')
const express = require('express')
const router = express.Router()

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })

router.get('/count', (req, res) => {
  const paramsStr = req.url.split('?')[1]
  const params = paramsStr ? paramsStr.split('&') : []
  let asset_url = find(params, (p) => (p.indexOf('asset_url') > -1))
  asset_url = asset_url ? asset_url.split('=')[ 1 ] : ''
  debug('About to fetch comment count of asset_url')
  debug('paramsStr', paramsStr)
  debug('params', params)
  debug('asset_url', asset_url)
  debug('url', `${config.TALK_SERVER}/api/v1/graph/ql/graphql?query={commentCount(query:{asset_url:"${asset_url}"})}`)

  const client = new GraphQLClient(`${config.TALK_SERVER}/api/v1/graph/ql`, { headers: {} })
  const query = `query { count: commentCount(query:{ asset_url:"${asset_url}" })}`
  client.request(query).then(data => {
    debug(data)
    res.send(data)
  }).catch(err => {
    debug('err', err)
    res.status(err.response.status).json(err.response.errors)
  })
})
router.get('/me', authVerify, (req, res) => {
  const cookies = new Cookies( req, res, {} )
  const tokent = cookies.get('csrf')

  const client = new GraphQLClient(`${config.TALK_SERVER}/api/v1/graph/ql`, {
    headers: {
      Authorization: `Bearer ${tokent}`
      // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImdvdHB3ZEBnb3Rwd2QuY29tIiwiZW1haWwiOiJnb3Rwd2RAZ290cHdkLmNvbSIsInJvbGUiOjMsInNjb3BlcyI6WyJlZGl0UG9zdE9nIl0sInVzZXJuYW1lIjoiIiwic3ViIjoiOTRiOWExODctNzA0NS00ZjUxLWJmMTMtZGRhMWZkYmMxMTBkIiwiaWF0IjoxNTE3Nzk4MzM1LCJleHAiOjMwMzU2ODMwNzAsImF1ZCI6InJlYWRyIiwiaXNzIjoiaHR0cDovLzEyNy4wLjAuMSIsImp0aSI6ImJjMmQ2YjAwLWZhMTQtNDg4NS05NjVjLWQ2ZDJlZjUzNWFhMCJ9.xHi-XjUceVIGoV9NQbBHmI8h7enesac0b43x3rWT3JY'
    },
  })
  const query = `
    query CoralEmbedStream_Profile {
      me {
        id
        username
        comments(query: {limit: 10}) {
          ...TalkSettings_CommentConnectionFragment
        }
      }
    }
    fragment TalkSettings_CommentConnectionFragment on CommentConnection {
      nodes {
        id
        body
        replyCount
        action_summaries {
          count
          __typename
        }
        asset {
          id
          title
          url
        }
        created_at
      }
      endCursor
      hasNextPage
    }
  `
  client.request(query).then(data => {
    res.send({
      me: data.me
    })
  }).catch(err => {
    debug('err', err)
    res.status(err.response.status).json(err.response.errors)
  })
})

module.exports = router
