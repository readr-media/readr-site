const { get, } = require('lodash')
const { handlerError, } = require('../../comm')
const { publishAction, } = require('../../gcs.js')
const { setupClientCache, } = require('../comm')
const config = require('../../config')
const debug = require('debug')('READR:api:comment')
const express = require('express')
const superagent = require('superagent')
const router = express.Router()

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

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

const getCommentSingle = (req, res, next) => {
  debug('Going to fetch this comment first.', req.body.id)
  const url = `${apiHost}/comment/${req.body.id}`
  superagent
  .get(url)
  .timeout(config.API_TIMEOUT)
  .end((e, r) => {
    req.comment = { e, r, }
    next()
  })
}

// router.get('/count', fetchFromRedis, (req, res, next) => {
//   res.header("Cache-Control", "public, max-age=3600")
//   if (res.redis) {
//     console.error('fetch data from Redis.', req.url)
//     const resData = JSON.parse(res.redis)
//     res.json(resData)
//   } else {
//     const paramsStr = req.url.split('?')[1]
//     const params = paramsStr ? paramsStr.split('&') : []
//     let asset_url = find(params, (p) => (p.indexOf('asset_url') > -1))
//     asset_url = asset_url ? asset_url.split('=')[ 1 ] : ''
//     debug('About to fetch comment count of asset_url')
//     debug('paramsStr', paramsStr)
//     debug('params', params)
//     debug('asset_url', asset_url)
//     debug('url', `${config.TALK_SERVER}/api/v1/graph/ql/graphql?query={commentCount(query:{asset_url:"${asset_url}"})}`)
  
//     const client = new GraphQLClient(`${config.TALK_SERVER}/api/v1/graph/ql`, { headers: {}, })
//     const query = `query { count: commentCount(query:{ asset_url:"${asset_url}" })}`
//     client.request(query).then(data => {
//       debug(data)

//       if (data['count'] !== undefined && data.constructor === Object) {
//         const dt = JSON.stringify(data)
//         res.dataString = dt
//         /**
//          * if data not empty, go next to save data to redis
//          */
//         next()
//       }

//       res.send(data)
//     }).catch(err => {
//       debug('err', err)
//       const err_wrapper = handlerError(err)
//       res.status(err_wrapper.status).json(err_wrapper.text)
//     })
//   }
// }, insertIntoRedis)

router.get('/', [ setupClientCache, getComment, ], (req, res) => {
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

router.delete('/', (req, res, next) => {
  req.body.id = req.body.ids[ 0 ]
  next()
}, getCommentSingle, (req, res) => {
  debug('Got a comment del call!', req.url)
  debug(req.params)
  debug(req.body)

  const { e, r, } = req.comment
  if (!e) {
    const author = get(r, 'body._items.author')
    const userId = get(req, 'user.id')
    const userRole = get(req, 'user.role')
    debug('author', author)
    debug('user', userId)
    if (userId !== author && config.ROLE_MAP.ADMIN !== userRole) { return res.status(403).send(`Forbidden.`) }

    publishAction(req.body, {
      type: 'comment',
      action: 'delete',
    }).then(result => {
      debug('result:')
      debug(result)
      res.send({ status: 200, text: 'deleting a comment successfully.', })
    }).catch(error => {
      const err_wrapper = handlerError(error)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during deleting comment: ${req.body.id}`)
      console.error(error)    
    })
  } else {
    const err_wrapper = handlerError(e, r)
    res.status(err_wrapper.status).json(err_wrapper.text)      
    console.error(`Error occurred during Updating comment: ${req.body.ids}`)
    console.error(e)   
  }
  
})

router.post('/', (req, res) => {
  debug('Got a comment post call!', req.url)
  debug(req.body)
  const author = req.user.id
  const payload = Object.assign({}, req.body, {
    author,
    status: 1,
    active: 1,
  })
  const url = `${apiHost}/comment`
  publishAction(payload, {
    type: 'comment',
    action: 'post',
  }).then(result => {
    debug('result:')
    debug(result)
    res.send({ status: 200, text: 'Adding a new comment successfully.', })
  }).catch(error => {
    const err_wrapper = handlerError(error)
    res.status(err_wrapper.status).json(err_wrapper.text)      
    console.error(`Error occurred during adding comment: ${url}`)
    console.error(error)    
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

router.put('/', getCommentSingle, (req, res) => {
  debug('Got a comment put call!', req.url)
  debug(req.body)

  const { e, r, } = req.comment
  if (!e) {
    const author = get(r, 'body._items.author')
    const userId = get(req, 'user.id')
    const userRole = get(req, 'user.role')
    debug('author', author)
    debug('user', userId)
    if (userId !== author && config.ROLE_MAP.ADMIN !== userRole) { return res.status(403).send(`Forbidden.`) }

    const url = `${apiHost}/comment`
    publishAction(req.body, {
      type: 'comment',
      action: 'put',
    }).then(result => {
      debug('result:')
      debug(result)
      res.send({ status: 200, text: 'Updating a comment successfully.', })
    }).catch(error => {
      const err_wrapper = handlerError(error)
      res.status(err_wrapper.status).json(err_wrapper.text)      
      console.error(`Error occurred during Updating comment: ${url}`)
      console.error(error)    
    })
  } else {
    const err_wrapper = handlerError(e, r)
    res.status(err_wrapper.status).json(err_wrapper.text)      
    console.error(`Error occurred during Updating comment: ${req.body.id}`)
    console.error(e)      
  }
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
