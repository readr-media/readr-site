const config = require('../../config')
const debug = require('debug')('READR:middle:talk')
const superagent = require('superagent')

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
      debug('Finished update talk_is back to the member', member.id)
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

module.exports = {
  buildUserForTalk,
}
