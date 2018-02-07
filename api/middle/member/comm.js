const config = require('../../config')
const jwtService = require('../../service.js')
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const sendActivationMail = ({ id, email, role, way }, cb) => {
  const tokenForActivation = jwtService.generateActivateAccountJwt({
    id, role, way
  })
  superagent
  .post(`${apiHost}/mail`)
  .send({
    receiver: [ email ],
    bcc: [ 'keithchiang@mirrormedia.mg','mushin@mirrormedia.mg' ],
    subject: 'Active',
    content: `
      hit the following url: <br>
      <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">click me</a>
    `
  })
  .end((err, resp) => {
    cb && cb(err, resp, tokenForActivation)
  })
}

module.exports = {
  sendActivationMail
}
