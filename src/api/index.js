import { getHost } from '../util/comm'
import { getToken, saveToken } from '../util/services'
import qs from 'qs'
const superagent = require('superagent')
// import { camelizeKeys } from 'humps'
const host = getHost()

function _buildQuery (params = {}) {
  let query = {}
  const whitelist = [ 'where', 'max_result', 'page', 'sort' ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where') {
        query[ele] = JSON.stringify(params[ele])
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

// function _doFetch (url) {
//   return new Promise((resolve, reject) => {
//     superagent
//     .get(url)
//     .end(function (err, res) {
//       if (err) {
//         reject(err)
//       } else {
//         // resolve(camelizeKeys(res.body))
//       }
//     })
//   })
// }

function _doFetchStrict (url) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          // resolve(camelizeKeys(res.body))
          resolve({ status: res.status, body: res.body })
        }
      })
  })
}

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

function _doPut (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .put(url)
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

function _doDelete (url) {
  return new Promise((resolve, reject) => {
    superagent
      .delete(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: res.body })
        }
      })
  })
}

export function deleteMember ({ params }) {
  const url = `${host}/api/member/${params.id}`
  return _doDelete(url)
}

export function addPost (params) {
  const url = `${host}/api/post`
  return _doPost(url, params)
    .then(res => res.status)
    .catch(err => err)
}

export function deletePost (id) {
  const url = `${host}/api/post/${id}`
  return _doDelete(url)
}

export function getDisposableToken (type) {
  const url = `${host}/api/token`
  return new Promise((resolve, reject) => {
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

export function getMembers ({ params }) {
  let url = `${host}/api/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url)
}

export function getPosts ({ params }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url)
}

export function getProfile () {
  const url = `${host}/api/profile`
  return _doFetchStrict(url)
}

export function checkLoginStatus () {
  const url = `${host}/api/status`
  return _doFetchStrict(url)
}

export function login (params, token) {
  const url = `${host}/api/login`
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
          resolve({ status: res.status, profile: res.body.profile })
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

export function register (params, token) {
  return new Promise((resolve, reject) => {
    const url = `${host}/api/register`
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token || getToken()}`)
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

export function addMember (params, token) {
  const url = `${host}/api/member`
  params.register_mode = 'ordinary'
  params.id = params.email
  params.mail = params.email
  return _doPost(url, params)
    .then(res => ({ status: res.status }))
    .catch(err => err)
}

export function updateMember ({ params }) {
  const url = `${host}/api/member`
  return _doPut(url, params)
    .then(res => ({ status: res.status }))
    .catch(err => err)
}

export function updatePost ({ params }) {
  const url = `${host}/api/post`
  return _doPut(url, params)
    .then(res => ({ status: res.status }))
    .catch(err => err)
}

export function uploadImage (file) {
  const url = `${host}/api/uploadImg`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(file)
      .end((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  })
}

export function verifyRecaptchaToken ({ token }) {
  return new Promise((resolve, reject) => {
    const url = `${host}/api/verify-recaptcha-token`
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
