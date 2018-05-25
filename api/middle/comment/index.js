const { GraphQLClient, } = require('graphql-request')
const { fetchFromRedis, insertIntoRedis, } = require('../redisHandler')
const { find, } = require('lodash')
const { handlerError, } = require('../../comm')
// const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:comment')
const express = require('express')
const superagent = require('superagent')
const router = express.Router()

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

// const jwtExpress = require('express-jwt')
// const authVerify = jwtExpress({ secret: config.JWT_SECRET, })

const getComment = (req, res, next) => {
  const url = `${apiHost}/comment${req.url}`
  superagent
  .get(url)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    req.comment = { e, r, }
    next()
  })
}

router.get('/count', fetchFromRedis, (req, res, next) => {
  res.header("Cache-Control", "public, max-age=3600")
  if (res.redis) {
    console.error('fetch data from Redis.', req.url)
    const resData = JSON.parse(res.redis)
    res.json(resData)
  } else {
    const paramsStr = req.url.split('?')[1]
    const params = paramsStr ? paramsStr.split('&') : []
    let asset_url = find(params, (p) => (p.indexOf('asset_url') > -1))
    asset_url = asset_url ? asset_url.split('=')[ 1 ] : ''
    debug('About to fetch comment count of asset_url')
    debug('paramsStr', paramsStr)
    debug('params', params)
    debug('asset_url', asset_url)
    debug('url', `${config.TALK_SERVER}/api/v1/graph/ql/graphql?query={commentCount(query:{asset_url:"${asset_url}"})}`)
  
    const client = new GraphQLClient(`${config.TALK_SERVER}/api/v1/graph/ql`, { headers: {}, })
    const query = `query { count: commentCount(query:{ asset_url:"${asset_url}" })}`
    client.request(query).then(data => {
      debug(data)

      if (data['count'] !== undefined && data.constructor === Object) {
        const dt = JSON.stringify(data)
        res.dataString = dt
        /**
         * if data not empty, go next to save data to redis
         */
        next()
      }

      res.send(data)
    }).catch(err => {
      debug('err', err)
      const err_wrapper = handlerError(err)
      res.status(err_wrapper.status).json(err_wrapper.text)
    })
  }
}, insertIntoRedis)

router.get('/', getComment, (req, res) => {
  debug('Got a comment call!', req.url)
  const { e, r, } = req.comment
  if (!e && r) {
    debug('respaonse:')
    debug(r.body)
    const resData = JSON.parse(r.text)
    res.json(resData)
  } else {
    const err_wrapper = handlerError(e, r)
    res.status(err_wrapper.status).json(err_wrapper.text)      
    console.error(`Error occurred during fetch comment data from : ${req.url}`)
    console.error(e)
  }  
})

router.delete('/', (req, res) => {
  debug('Got a comment del call!', req.url)
  debug(req.params)
  debug(req.body)
  // const url = `${apiHost}/comment`
  const url = `${apiHost}/comment/status`
  superagent
  // .delete(url)
  .put(url)
  .send(req.body)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      res.send({ status: 200, text: 'Deleting a comment successfully.', })
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during deleting comment data from : ${url}`)
      console.error(e)
    }
  })  
})

router.post('/', (req, res) => {
  debug('Got a comment post call!', req.url)
  debug(req.body)
  const author = req.user.id
  const payload = Object.assign({}, req.body, {
    author: author,
    status: 1,
    active: 1,
  })
  const url = `${apiHost}/comment`
  superagent
  .post(url)
  .send(payload)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      res.send({ status: 200, text: 'Adding a new comment successfully.', })
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during adding comment: ${url}`)
      console.error(e)
    }
  })  
})

router.post('/report', (req, res) => {
  debug('Got a comment report post call!', req.url)
  debug(req.body)
  const reporter = req.user.id
  const payload = Object.assign({}, req.body, {
    reporter,
  })
  const url = `${apiHost}/reported_comment`
  superagent
  .post(url)
  .send(payload)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      res.send({ status: 200, text: 'Adding a new comment report successfully.', })
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during adding comment report: ${url}`)
      console.error(e)
    }
  })  
})

router.put('/', (req, res) => {
  debug('Got a comment put call!', req.url)
  debug(req.body)
  const url = `${apiHost}/comment`
  superagent
  .put(url)
  .send(req.body)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    if (!e && r) {
      res.send({ status: 200, text: 'Updating a new comment successfully.', })
    } else {
      const err_wrapper = handlerError(e, r)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during Updating comment: ${url}`)
      console.error(e)
    }
  })  
})

// router.get('/me', authVerify, (req, res) => {
//   const cookies = new Cookies( req, res, {} )
//   const tokent = cookies.get('csrf')

//   const client = new GraphQLClient(`${config.TALK_SERVER}/api/v1/graph/ql`, {
//     headers: {
//       Authorization: `Bearer ${tokent}`,
//       // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImdvdHB3ZEBnb3Rwd2QuY29tIiwiZW1haWwiOiJnb3Rwd2RAZ290cHdkLmNvbSIsInJvbGUiOjMsInNjb3BlcyI6WyJlZGl0UG9zdE9nIl0sInVzZXJuYW1lIjoiIiwic3ViIjoiOTRiOWExODctNzA0NS00ZjUxLWJmMTMtZGRhMWZkYmMxMTBkIiwiaWF0IjoxNTE3Nzk4MzM1LCJleHAiOjMwMzU2ODMwNzAsImF1ZCI6InJlYWRyIiwiaXNzIjoiaHR0cDovLzEyNy4wLjAuMSIsImp0aSI6ImJjMmQ2YjAwLWZhMTQtNDg4NS05NjVjLWQ2ZDJlZjUzNWFhMCJ9.xHi-XjUceVIGoV9NQbBHmI8h7enesac0b43x3rWT3JY'
//     },
//   })
//   const query = `
//     query CoralEmbedStream_Profile {
//       me {
//         id
//         username
//         comments(query: {limit: 10}) {
//           ...TalkSettings_CommentConnectionFragment
//         }
//       }
//     }
//     fragment TalkSettings_CommentConnectionFragment on CommentConnection {
//       nodes {
//         id
//         body
//         replyCount
//         action_summaries {
//           count
//           __typename
//         }
//         asset {
//           id
//           title
//           url
//         }
//         created_at
//       }
//       endCursor
//       hasNextPage
//     }
//   `
//   client.request(query).then(data => {
//     res.send({
//       me: data.me,
//     })
//   }).catch(err => {
//     debug('err', err)
//     res.status(err.response.status).json(err.response.errors)
//   })
// })

module.exports = router
