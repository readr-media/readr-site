const { set } = require('lodash')
const config = require('./config')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const generateJwt = ({ id, email, name, nickname, role, keepAlive, scopes }) => {
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
  set(claims, config.JWT_USER_ID_CLAIM, 'f79bb78a-efc8-4412-a911-ce26e1ca380c')
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

const generateDisposableJwt = ({ host }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  return jwt.sign({
    host: config.SERVER_HOST || '',
    exp: parseInt(expiry.getTime() / 1000)
  }, config.JWT_SECRET)
}

const generateActivateAccountJwt = ({ id, role, way }) => {
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id,
    role,
    way,
    exp: parseInt(expiry.getTime() / 1000)
  }, config.JWT_SECRET)
}

const verifyToken = (token, cb) => {
  jwt.verify(token, config.JWT_SECRET, cb)
}

module.exports = {
  generateJwt,
  generateDisposableJwt,
  generateActivateAccountJwt,
  verifyToken
}
