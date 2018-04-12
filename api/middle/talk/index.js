const { constructScope, fetchPermissions, } = require('../../services/perm')
const { find, } = require('lodash')
const config = require('../../config')
const debug = require('debug')('READR:middle:talk')
const superagent = require('superagent')

const MongoClient = require('mongodb').MongoClient
const mongourl = config.TALK_DB

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const updateTalkId = (member, talkId) => new Promise((resolve) => {
  const url = `${apiHost}/member`
  const payload = {
    id: member.id,
    talk_id: talkId,
  }
  superagent
    .put(url)
    .send(payload)
    .end((err, res) => {
      debug('Finished update talk_id back to the member', member.id)
      debug('err', err)
      resolve({ err, res, })
    })
})

const buildUserForTalk = (member) => new Promise((resolve) => {
  debug('Talk server host:', `${config.TALK_SERVER}/api/v1/users`)
  const username = member.id.replace(/@[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]*$/, '')
  superagent
    .post(`${config.TALK_SERVER}/api/v1/users`)
    .send({ 
      email: member.mail, // should make sure that it is email
      username,
      password: member.id,
      confirmPassword: member.id,
    })
    .end((err, res) => {
      debug('Finished insert member to Talk')
      debug('err', err)
      debug('res', res.body)
      updateTalkId(member, res.body.id).then(() => {
        resolve({ err, res, })
      })
    })
})

const checkoutUserPerms = (role) => fetchPermissions().then((perms) => {
  const scopes = constructScope(perms, role)
  const isModerator = find(scopes, (s) => (s === 'manageComment'))
  const talkRole = role !== config.ROLE_MAP.ADMIN
                      ? isModerator
                      ? 'MODERATOR'
                      : 'COMMENTER'
                      : 'ADMIN'
  debug('Talk role:', talkRole)
  return talkRole
})

const updateUser = (col, selector, data_query) => new Promise(resolve => MongoClient.connect(mongourl, (err, client) => {
  debug('selector', selector)
  debug('data_query', data_query)
  const db = client.db('talk')
  const collection = db.collection(col)
  collection.updateOne(selector, data_query, function () {
    client.close()
    resolve()
  })
}))

const syncAvatar = (email, url) => updateUser(
  'users',
  { 'profiles.id': { $in: [ email.toLowerCase(), ], }, },
  { $set: { metadata: { avatar: url, }, }, }
)

const updateUserForTalk = (email, { username, metadata, role, }) => {
  const data = {}
  const constructMetadata = metadata ? new Promise(resolve => {
    data.metadata = metadata
    resolve()
  }) : Promise.resolve()
  const constructNickname = username ? new Promise(resolve => {
    data.username = username
    data.lowercaseUsername = username.toLowerCase()
    resolve()
  }) : Promise.resolve()
  const checkoutRole = role ? checkoutUserPerms(role).then((talk_role) => {
    debug('Got talk_role', talk_role)
    data.role = talk_role
  }) : Promise.resolve()

  return Promise.all([
    constructMetadata,
    constructNickname,
    checkoutRole,
  ]).then(() => {
    debug('Time to update User', username || metadata || role)
    debug(email.toLowerCase())
    debug(data)
    return (username || metadata || role) && updateUser(
      'users',
      { 'profiles.id': { $in: [ email.toLowerCase(), ], }, },
      { $set: data, },
    )
  })
  
}
const updateUserRoleForTalk = (role, email) => updateUser(
  'users',
  { 'profiles.id': { $in: [ email.toLowerCase(), ], }, },
  { $set: { role : role, }, },
)
const updateUserNameForTalk = (email, username) => updateUser(
  'users',
  { 'profiles.id': { $in: [ email.toLowerCase(), ], }, },
  { $set: { username: username, lowercaseUsername: username.toLowerCase(), }, },
)
const banUserForTalk = (email) => updateUser(
  'users',
  { 'profiles.id': { $in: [ email.toLowerCase(), ], }, },
  { $set: { status: { banned: { status: true, }, }, }, },
)

module.exports = {
  buildUserForTalk,
  banUserForTalk,
  checkoutUserPerms,
  syncAvatar,
  updateUserForTalk,
  updateUserRoleForTalk,
  updateUserNameForTalk,
}
