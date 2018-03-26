const config = require('../../config')
const jwtService = require('../../service.js')
const jwtExpress = require('express-jwt')
const superagent = require('superagent')

const { redisFetching, } = require('../redisHandler')

const debug = require('debug')('READR:api:member:comm')
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const sendActivationMail = ({ id, email, role, type, }, cb) => {
  const tokenForActivation = jwtService.generateActivateAccountJwt({
    id, role, type,
  })
  sendEmail({
    email,
    subject: 'Active',
    token: tokenForActivation,
    cb,
    content: `hit the following url: <br>
      <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">click me</a>`,
  })
}
const sendRecoverPwdEmail = ({ email, }, cb) => {
  const token = jwtService.generateResetToken({
    id: email,
    type: 'email',
  })
  sendEmail({
    email,
    subject: 'Reset',
    token,
    cb,
    content: `hit the following url: <br>
      <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/recoverpwd/${token}">click me</a>`,
  })
}
const sendEmail = ({ email, content, cb, subject, token, }) => {
  debug('About to send email')
  debug('>>>', subject)
  debug('>>>', email)
  superagent
  .post(`${apiHost}/mail`)
  .send({
    receiver: [ email, ],
    bcc: [ 'keithchiang@mirrormedia.mg','mushin@mirrormedia.mg', ],
    subject,
    content,
  })
  .end((err, res) => {
    debug('Sending done.')
    cb && cb(err, res, token)
  })
}
const fetchMem = (member) => new Promise((resolve) => {
  superagent
  .get(`${apiHost}/member/${member.id}`)
  .end((err, res) => {
    debug('err')
    debug(err)
    resolve({ err, res, })
  })
})

const verifyToken = function (req, res, next) {
  const key = req.url.split('/')[1]
  redisFetching(key, ({ error, data, }) => {
    error && console.error('Error occurred during fetching token from redis.')
    error && console.error(error)
    data && debug(data)
    if (!data) {
      jwtService.verifyToken(key, (err, decoded) => {
        if (err) {
          res.status(403).send(`Invalid token.`)
        } else {
          req.decoded = decoded
          next()
        }
      })
    } else {
      res.status(403).send(`Expired token.`)      
    }
  })
}

const authVerify = jwtExpress({
  secret: config.JWT_SECRET,
  isRevoked: (req, payload, done) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
    redisFetching(token, ({ error, data, }) => {
      error && console.error('Error occurred during fetching token from redis.')
      error && console.error(error)
      done(null, !!data)
    })
  },
})

module.exports = {
  authVerify,
  fetchMem,
  sendActivationMail,
  sendRecoverPwdEmail,
  verifyToken,
}
