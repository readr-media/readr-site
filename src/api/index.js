import { getHost } from '../util/comm'
import { getToken, saveToken } from '../util/services'
import uuidv4 from 'uuid/v4'
const superagent = require('superagent')
// import { camelizeKeys } from 'humps'
const host = getHost()

// function _doFetch (url) {
//   return new Promise((resolve, reject) => {
//     superagent
//     .get(url)
//     // .query('')
//     .end(function (err, res) {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(camelizeKeys(res.body))
//       }
//     })
//   })
// }

function _doPost (url, params) {
  return new Promise((resolve, reject) => {
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
    const url = `${host}/api/register`
    const uuid = uuidv4()
    params.id = uuid

    superagent
      .post(url)
      .send(
        params
      )
      .end(function (err, res) {
        if (err) {
          reject({ status: res.status })
        } else {
          resolve({ status: res.status })
        }
      })
  })
}

export function login (params) {
  const url = `${host}/api/login`
  return _doPost(url, {
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

export function articleAdd (params) {
  const url = `${host}/api/article`
  return _doPost(url, params)
    .then(res => res.status)
    .catch(err => err)
}
