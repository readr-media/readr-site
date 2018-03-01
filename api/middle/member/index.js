const { constructScope, fetchPermissions } = require('../../services/perm')
const { redisFetching, redisWriting } = require('../redisHandler')
const { find, pick } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:api:member')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const MongoClient = require('mongodb').MongoClient
const mongourl = config.TALK_DB

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const checkoutUserPerms = (role, email) => new Promise((resolve) => {
  fetchPermissions().then((perms) => {
    const scopes = constructScope(perms, role)
    const isModerator = find(scopes, (s) => (s === 'manageComment'))
    const talkRole = role !== config.ROLE_MAP.ADMIN
                        ? isModerator
                        ? 'MODERATOR'
                        : 'COMMENTER'
                        : 'ADMIN'
    debug('About to update user to be', talkRole)
    updateUserRoleForTalk(talkRole, email).then(() => {
      resolve()
    })
  })
})

const updateUserRoleForTalk = (role, email) => new Promise((resolve) => {
  MongoClient.connect(mongourl, function(err, client) {
    debug("Connected successfully to server")
    const db = client.db('talk')
    const collection = db.collection('users')
    collection.updateOne({ "profiles.id": { $in: [ email ] } }
      , { $set: { role : role } }, function(err, result) {
      debug('Updating ', email, '\'s role to', role, 'to talk')
      client.close()
      resolve()
    })
  })
})

const updateUserNameForTalk = (email, username) => new Promise((resolve) => {
  MongoClient.connect(mongourl, function(err, client) {
    debug("Connected successfully to server")
    const db = client.db('talk')
    const collection = db.collection('users')
    collection.updateOne({ "profiles.id": { $in: [ email ] } }
      , { $set: { username: username, lowercaseUsername: username.toLowerCase() } }, function(err, result) {
      debug('Updating ', email, '\'s username to', username, 'to talk')
      client.close()
      resolve()
    })
  })
})

const banUserForTalk = (email) => new Promise((resolve) => {
  MongoClient.connect(mongourl, function(err, client) {
    debug("Connected successfully to server")
    const db = client.db('talk')
    const collection = db.collection('users')
    collection.updateOne({ "profiles.id": { $in: [ email ] } }
      , { $set: { status: { banned: { status: true }}}}, function(err, result) {
      debug('Ban ', email)
      client.close()
      resolve()
    })
  })
})

router.put('/role', (req, res) => {
  debug('Got a req to update user\'s role')
  debug(req.body)
  const url = `${apiHost}/member`
  superagent
  .put(url)
  .send(req.body)
  .end((err, response) => {
    if (!err && response) {
      debug('Update user\'s role sucessfully')
      checkoutUserPerms(req.body.role, req.body.mail).then(() => res.status(200).end())
    } else {
      res.status(500).json(err)
    }
  })
})

router.put('/', (req, res, next) => {
  req.body.nickname && updateUserNameForTalk(req.user.email, req.body.nickname)
  next()
})

router.post('*', (req, res) => {})

router.delete('*', (req, res, next) => {
  debug('going to del member')
  debug(req.body)
  debug(req.url)
  const userid = req.url.split('/')[ 1 ]
  userid && banUserForTalk(userid).then(() => {
    next()
  })
})

router.get('/profile/:id', (req, res) => {
  const id = req.params.id
  const url = `${apiHost}/member/${id}`
  if (!id) { res.status(403).send(`Forbidden.`) }
  debug('Abt to fetch public member data.')
  debug('>>>', req.url)
  // res.send('ok')
  redisFetching(`member${req.url}`, ({ err, data }) => {
    if (!err && data) {
      debug('Fetch public member data from Redis.')
      debug('>>>', req.url)
      const mem = JSON.parse(data)
      res.json({
        'items': mem['_items'].map((object) => pick(object, [ 'id', 'nickname', 'description', 'profile_image']))
      })
    } else {
      superagent
      .get(url)
      .end((e, response) => {
        debug('Fetchpublic member data from api.', url)
        if (!e && response) {
          redisWriting(`member${req.url}`, response.text)
          const mem = JSON.parse(response.text)
          res.json({
            'items': mem['_items'].map((object) => pick(object, [ 'id', 'nickname', 'description', 'profile_image']))
          })
        } else {
          res.status(response.status).send('{\'error\':' + e + '}')
          console.error(`error during fetch data from: member${req.url}`)
          console.error(e)  
        }
      })
    }
  })
})

module.exports = router
