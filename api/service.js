const jwt = require('jsonwebtoken')

const generateJwt = ({ id, email, keepAlive, secret }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id: id,
    email: email,
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

const generateDisposableJwt = ({ secret }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  return jwt.sign({
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

module.exports = {
  generateJwt,
  generateDisposableJwt
}