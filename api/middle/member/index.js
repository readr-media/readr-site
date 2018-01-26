const { constructScope, fetchPermissions } = require('../../services/perm')
const { find } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:api:member')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const MongoClient = require('mongodb').MongoClient
const mongourl = 'mongodb://localhost:27017'

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
  const dbName = 'talk'
  MongoClient.connect(mongourl, function(err, client) {
    debug("Connected successfully to server")
    const db = client.db(dbName)
    const collection = db.collection('users')
    collection.updateOne({ "profiles.id": { $in: [ email ] } }
      , { $set: { role : role } }, function(err, result) {
      debug("Updated the document with the field a equal to 2");
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

module.exports = router
