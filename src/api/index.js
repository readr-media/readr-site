
import { getHost } from '../util/comm'
import { currentUser, getToken, saveToken } from '../util/services' 
import uuidv4 from 'uuid/v4'
const superagent = require('superagent')
// import { camelizeKeys } from 'humps'
const host = getHost()

function _doFetch (url) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    // .query('')
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(camelizeKeys(res.body))
      }
    })
  })
}

function _doPost (url, params) {
  return new Promise((resolve) => {
    superagent
    .post(url)
    .set('Authorization', `Bearer ${getToken()}`)
    .send(params)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve({ status: res.status, body: res.body })
      }
    })
  })
}

export function register (params) {
  return new Promise((resolve, reject) => {
    let url = `${host}/api/register`
    const uuid = uuidv4()
    params.id = uuid

    superagent
    .post(url)
    .send(
      params
    )
    .end(function (err, res) {
      if (err) {
        reject({ status: res.body.status })
      } else {
        resolve({ status: res.body.status })
      }
    })
  })
}

export function login (params) {
  let url = `${host}/api/login`
  return _doPost (url, {
    email: params.email,
    password: params.password,
    keepAlive: params.keepAlive
  }).then((res) => {
    saveToken(res.body.token)
    return { status: res.status }
  })
}

export function logout () {
  return new Promise((resolve) => {
    window && (window.localStorage.removeItem('csrf'))
    resolve()
  })
}