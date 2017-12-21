import { getHost } from '../util/comm'
import { currentUser, getToken, saveToken } from '../util/services' 
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

export function getDisposableToken (type) {
  let url = `${host}/api/token`
  return new Promise ((resolve, reject) => {
    superagent
    .post(url)
    .send({ type })
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body.token)
      }
    })
  })
}

export function login (params, token) {
  let url = `${host}/api/login`
  return new Promise((resolve, reject) => {
    superagent
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .send(
      params
    ).end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        saveToken(res.body.token)
        resolve({ status: res.status } )
      }
    })  
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

export function register (params, token) {
  return new Promise((resolve, reject) => {
    let url = `${host}/api/register`
    superagent
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .send(
      params
    )
    .end(function (err, res) {
      if (err) {
        reject({ status: res.status, err: res.body.Error })
      } else {
        resolve({ status: res.status })
      }
    })
  })
}

export function verifyRecaptchaToken ({ token }) {
  return new Promise((resolve, reject) => {
    let url = `${host}/api/verify-recaptcha-token`
    superagent
    .post(url)
    .send({ token })
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}
