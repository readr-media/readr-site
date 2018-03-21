const { set } = require('lodash')
const config = require('./config')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const generateJwt = ({ id, email, name, nickname, role, keepAlive, scopes, talk_id }) => {
  const expiry = new Date(Date.now() + (keepAlive ? 30 : 1) * 24 * 60 * 60 * 1000)
  if (!config.JWT_SECRET) {
    throw new Error('no signing key on secret, cannot sign')
  }
  const claims = {
    id: id,
    email,
    nickname,
    role,
    scopes,
    username: name,
  }
  
  set(claims, config.JWT_USER_ID_CLAIM, talk_id)
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

const generateDisposableJwt = () => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  return jwt.sign({
    host: config.SERVER_HOST || '',
    exp: parseInt(expiry.getTime() / 1000)
  }, config.JWT_SECRET)
}

const generateResetToken = ({ id, type }) => {
  const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
  const claims = { id, type }
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

const generateActivateAccountJwt = ({ id, role, type }) => {
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  return jwt.sign({
    id,
    role,
    type,
    exp: parseInt(expiry.getTime() / 1000)
  }, config.JWT_SECRET)
}

const verifyToken = (token, cb) => {
  jwt.verify(token, config.JWT_SECRET, cb)
}

module.exports = {
  generateJwt,
  generateDisposableJwt,
  generateResetToken,
  generateActivateAccountJwt,
  verifyToken
}
