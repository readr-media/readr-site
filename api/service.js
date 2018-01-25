const { set } = require('lodash')
const config = require('./config')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const generateJwt = ({ id, email, name, nickname, role, keepAlive, scopes, secret }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  if (!config.JWT_SECRET) {
    throw new Error('no signing key on secret, cannot sign');
  }
  const claims = {
    id: id,
    email,
    nickname,
    role,
    scopes,
    username: name,
  }
  set(claims, config.JWT_USER_ID_CLAIM, '9d488d8f-c400-45f8-b059-cd69adb78d1c')
  return jwt.sign(
    claims,
    config.JWT_SECRET,
    {
      algorithm: config.JWT_ALG,
      audience: config.JWT_AUDIENCE,
      expiresIn: parseInt(expiry.getTime() / 1000),
      issuer: config.JWT_ISSUER,
      jwtid: uuid.v4()
    }
  )
}

const generateDisposableJwt = ({ host, secret }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  return jwt.sign({
    host: config.SERVER_HOST || '',
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

const generateActivateAccountJwt = ({ id, role, way, secret }) => {
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id,
    role,
    way,
    exp: parseInt(expiry.getTime() / 1000)
  }, secret)
}

const verifyToken = (token, secret, cb) => {
  jwt.verify(token, secret, cb)
}

module.exports = {
  generateJwt,
  generateDisposableJwt,
  generateActivateAccountJwt,
  verifyToken
}
