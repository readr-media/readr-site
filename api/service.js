const jwt = require('jsonwebtoken')
const { SERVER_HOST } = require('./config')

const generateJwt = ({ id, email, name, nickname, role, keepAlive, secret }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id: id,
    email,
    name,
    nickname,
    role, 
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

const getId = (token, secret) => {
  const decoded = jwt.verify(token, secret)
  return decoded.id
}
const getRole = (token, secret) => {
  const decoded = jwt.verify(token, secret)
  return decoded.role
}

module.exports = {
  generateJwt,
  generateDisposableJwt,
  getId,
  getRole
}