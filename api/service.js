const jwt = require('jsonwebtoken')
const { SERVER_HOST } = require('./config')

const generateJwt = ({ id, email, name, nickname, role, keepAlive, scopes, secret }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id: id,
    email,
    username: name,
    nickname,
    scopes,
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

const generateActivateAccountJwt = ({ id, role, way, secret }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 1000)
  return jwt.sign({
    id,
    role,
    way,
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
const verifyToken = (token, secret, cb) => {
  jwt.verify(token, secret, cb)
}

module.exports = {
  generateJwt,
  generateDisposableJwt,
  generateActivateAccountJwt,
  getId,
  getRole,
  verifyToken
}
