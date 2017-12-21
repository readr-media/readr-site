const jwt = require('jsonwebtoken')
const { SERVER_HOST } = require('./config')

const generateJwt = ({ id, email, keepAlive, secret }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id: id,
    email: email,
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

const generateDisposableJwt = ({ host, secret }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  return jwt.sign({
    host: SERVER_HOST || '',
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

module.exports = {
  generateJwt,
  generateDisposableJwt
}