import { camelizeKeys } from 'humps'
import { getHost } from '../util/comm'
import { delInitMemToken, getToken, getInitMemToken, saveToken } from '../util/services'
import _ from 'lodash'
import qs from 'qs'

const superagent = require('superagent')
const host = getHost()

function _buildQuery (params = {}) {
  let query = {}
  const whitelist = [ 'where', 'max_result', 'page', 'sort', 'ids' ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where') {
        const where = _.mapValues(params[ele], (value) => {
          value = Array.isArray(value) ? value : [ value ]
          return { '$in': value }
        })
        Object.keys(where).forEach((key) => {
          query[key] = JSON.stringify(where[key])
        })
      } else if (ele === 'ids') {
        query[ele] = JSON.stringify(params[ele])
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

function _doFetch (url) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        // resolve(camelizeKeys(res.body))
        resolve({ status: res.status, body: camelizeKeys(res.body) })
      }
    })
  })
}

function _doFetchStrict (url, { cookie }) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${cookie || getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          // resolve(camelizeKeys(res.body))
          resolve({ status: res.status, body: camelizeKeys(res.body) })
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
          resolve({ status: res.status, body: camelizeKeys(res.body) })
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
          resolve({ status: res.status, body: camelizeKeys(res.body) })
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
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

export function deleteMember ({ params }) {
  const url = `${host}/api/member/${params.id}`
  return _doDelete(url)
}

export function deleteMembers ({ params }) {
  let url = `${host}/api/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
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

export function deletePostSelf (id) {
  const url = `${host}/api/post-self/${id}`
  return _doDelete(url)
}

export function getFollowingByResource (params) {
  let url = `${host}/api/following/byresource`
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .send(params)
      .set('Authorization', `Bearer ${getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

export function getFollowingByUser (params) {
  let url = `${host}/api/following/byuser`
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .query(params)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
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
  return _doFetchStrict(url, {})
}

export function getMeta (targetUrl) {
  let url = `${host}/api/meta`
  return _doPost(url, { url: targetUrl })
    .then(res => ({ status: res.status, body: camelizeKeys(res.body) }))
    .catch(err => err)
}

export function getPosts ({ params }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function getPublicPosts ({ params }) {
  let url = `${host}/api/public-posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetch(url)
}

export function getProfile ({ params = {}}) {
  const url = `${host}/api/profile`
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function checkLoginStatus ({ params = {}}) {
  const url = `${host}/api/status`

  return _doFetchStrict(url, { cookie: params.cookie })
}

export function checkPassword (params) {
  const url = `${host}/api/login`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
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
  params.active = 0
  return _doPost(url, params)
    .then(res => ({ status: res.status }))
    .catch(err => err)
}

export function setupBasicProfile ({ params }) {
  return new Promise((resolve) => {
    const token = getInitMemToken()
    if (!token) {
      return resolve({ status: 403 })
    }
    const url = `${host}/api/initmember`
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          reject({ status: res.status, err: res.body.Error })
        } else {
          if (res.status === 200) {
            delInitMemToken()
          }
          resolve({ status: res.status })
        }
      })
  })
}

export function updateMember ({ params, type }) {
  const url = type !== 'role' ? `${host}/api/member` : `${host}/api/member/role`
  return _doPut(url, params)
    .then(res => ({ status: res.status }))
    .catch(err => err)
}

export function updatePassword ({ params }) {
  const url = `${host}/api/member/password`
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

export function uploadImage (file, type) {
  let url
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/image-member`
    } else if (type === 'post') {
      url = `${host}/api/image-post`
    } else {
      reject()
    }
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

export function deleteImage (file, type) {
  let url
  const param = { 'filePath': file }
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/deleteMemberImg`
    } else {
      reject()
    }
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(param)
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
