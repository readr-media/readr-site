import { camelizeKeys, } from 'humps'
import { getHost, } from '../util/comm'
import { getToken, getSetupToken, saveToken, } from '../util/services'
import _ from 'lodash'
import qs from 'qs'

const debug = require('debug')('CLIENT:src:api')
const superagent = require('superagent')
const host = getHost()

function _buildQuery (params = {}) {
  let query = {}
  const whitelist = [ 'where', 'max_result', 'page', 'sort', 'sorting', 'ids', 'custom_editor', 'updated_by', 'keyword', 'stats', 'role', ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where') {
        const where = _.mapValues(params[ele], (value) => {
          value = Array.isArray(value) ? value : [ value, ]
          return { '$in': value, }
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
        if (res.text === 'not found') {
          reject(res.text)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      }
    })
  })
}

function _doFetchStrict (url, { cookie, }) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${cookie || getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          // resolve(camelizeKeys(res.body))
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
  })
}

function _doPost (url, params, token) {
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token || getToken()}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          debug(err)
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body), })
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
          resolve({ status: res.status, body: camelizeKeys(res.body), })
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
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
  })
}

export function deleteMember ({ params, }) {
  const url = `${host}/api/member/${params.id}`
  return _doDelete(url)
}

export function deleteMembers ({ params, }) {
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

export function addTags (params) {
  const url = `${host}/api/tags`
  return _doPost(url, params)
    .then(res => res.status)
    .catch(err => err)
}

export function addRewardPointsTransactions (params) {
  const url = `${host}/api/points`
  return _doPost(url, params)
    .then(res => res.status)
    .catch(err => err)
}

export function deletePost (id) {
  const url = `${host}/api/post/${id}`
  return _doDelete(url)
}

export function deletePosts ({ params, }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doDelete(url)
}

export function deletePostSelf (id) {
  const url = `${host}/api/post-self/${id}`
  return _doDelete(url)
}

export function deleteTags ({ params, }) {
  let url = `${host}/api/tags`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doDelete(url)
}

export function fetchCommentCount ({ params, }) {
  return new Promise((resolve) => {
    const url = `${host}/api/comment/count?asset_url=${params.assetUrl}`
    _doFetch(url).then(({ body, }) => {
      resolve(body.count)
    })
  })
}

export function fetchMeComments () {
  return new Promise((resolve) => {
    const url = `${host}/api/comment/me`
    _doFetchStrict(url, {}).then(({ body, }) => {
      resolve(body)
    })
  })
}

export function getFollowingByResource (params) {
  let url = `${host}/api/following/byresource`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
  })
}

export function getFollowingByUser (params) {
  let url = `${host}/api/following/byuser`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
  })
}

export function getDisposableToken (type) {
  const url = `${host}/api/token/${type}`
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body.token)
        }
      })
  })
}

export function getMembers ({ params, }) {
  let url = `${host}/api/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function getPublicMember ({ params, }) {
  let url = `${host}/api/member/public`
  url = `${url}/profile/${params.id}`
  return _doFetch(url)
}

export function getPublicMembers ({ params, }) {
  let url = `${host}/api/public/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetch(url)
}

export function getPublicVideos ({ params, }) {
  let url = `${host}/api/public/videos`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetch(url)
}

export function getPublicVideosCount () {
  let url = `${host}/api/public/videos/count`
  return _doFetch(url)
}

export function getMeta (targetUrl) {
  let url = `${host}/api/meta`
  return _doPost(url, { url: targetUrl, })
    .then(res => ({ status: res.status, body: camelizeKeys(res.body), }))
    .catch(err => err)
}

export function getPosts ({ params, }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function getPostsCount ({ params, }) {
  let url = `${host}/api/posts/count`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function getPublicPosts ({ params, }) {
  let url = `${host}/api/public/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetch(url)
}

export function getPublicProjectsList ({ params, }) {
  let url = `${host}/api/project/list`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetch(url)
}

export function getProfile ({ params = {},}) {
  const url = `${host}/api/profile`
  return _doFetchStrict(url, { cookie: params.cookie, })
}

export function getTags ({ params = {},}) {
  let url = `${host}/api/tags`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function getTagsCount () {
  let url = `${host}/api/tags/count`
  return _doFetchStrict(url, {})
}

export function getRewardPointsTransactions ({ params, }) {
  const url = `${host}/api/points/${params.id}`
  return _doFetchStrict(url, {})
}

export function checkLoginStatus ({ params = {},}) {
  const url = `${host}/api/status`

  return _doFetchStrict(url, { cookie: params.cookie, })
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
          resolve({ status: res.status, profile: res.body.profile, })
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
          resolve({ status: res.status, profile: res.body.profile, })
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
          reject({ status: res.status, err: res.body.Error, })
        } else {
          resolve({ status: res.status, })
        }
      })
  })
}

export function resetPwd (params) {
  const url = `${host}/api/recoverpwd/set`
  const token = getSetupToken()
  if (!token) {
    return Promise.resolve({ status: 403, })
  }
  return _doPost(url, params, token)
}

export function resetPwdEmail (params, token) {
  const url = `${host}/api/recoverpwd`
  return _doPost(url, params, token)
}

export function addMember (params) {
  const url = `${host}/api/register/admin`
  params.register_mode = 'ordinary'
  params.id = params.email
  params.mail = params.email
  params.active = 0
  return _doPost(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function setupBasicProfile ({ params, }) {
  const url = `${host}/api/initmember`
  const token = getSetupToken()
  if (!token) {
    return Promise.resolve({ status: 403, })
  }
  return _doPost(url, params, token)
}

export function updateMember ({ params, type, }) {
  const url = type !== 'role' ? `${host}/api/member` : `${host}/api/member/role`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updatePassword ({ params, }) {
  const url = `${host}/api/member/password`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updatePost ({ params, }) {
  const url = `${host}/api/post`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updateTags ({ params, }) {
  const url = `${host}/api/tags`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function uploadImage (file, type) {
  let url
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/image/member`
    } else if (type === 'post') {
      url = `${host}/api/image/post`
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

export function deleteMemberProfileThumbnails (id) {
  let url = `${host}/api/deleteMemberProfileThumbnails`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send({ id, })
      .end((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  })
}

export function verifyRecaptchaToken ({ token, }) {
  return new Promise((resolve, reject) => {
    const url = `${host}/api/verify-recaptcha-token`
    superagent
      .post(url)
      .send({ token, })
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function publishAction ({ params, }) {
  return new Promise((resolve, reject) => {
    const url = `${host}/api/publish-action`
    superagent
    .post(url)
    .set('Authorization', `Bearer ${getToken()}`)
    .send(params)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function publishPosts ({ params, }) {
  const url = `${host}/api/posts`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function search (keyword = '', params = {}) {
  let url = `${host}/api/search`
  debug('keyword', keyword)
  url = `${url}?query=${encodeURIComponent(`"${keyword}"`)}&hitsPerPage=${params.max_results}&page=${params.page - 1}`
  return _doFetch(url)
}
