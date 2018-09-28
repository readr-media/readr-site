import { _buildQuery, del, post, put, fetch, fetchInStrict, } from 'src/api/comm'
import { camelizeKeys, } from 'humps'
import { getHost, } from 'src/util/comm'
import { getToken, getSetupToken, saveToken, } from 'src/util/services'
import _ from 'lodash'
import validator from 'validator'
const debug = require('debug')('CLIENT:src:api')
const superagent = require('superagent')
const host = getHost()

export function deleteMember ({ params, }) {
  const url = `${host}/api/member/${params.id}`
  return del(url)
}

export function deleteMembers ({ params, }) {
  let url = `${host}/api/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return del(url)
}

export function addPost (params) {
  const url = `${host}/api/post`
  return post(url, params)
}

export function deletePost (id) {
  const url = `${host}/api/post/${id}`
  return del(url)
}

export function deletePosts ({ params, }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return del(url)
}

export function deletePostSelf (id) {
  const url = `${host}/api/post-self/${id}`
  return del(url)
}

export function addComment ({ params, }) {
  let url = `${host}/api/comment`
  const query = _buildQuery(params.query)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }  
  delete params.query
  return post(url, params,)
}

export function addCommentReport ({ params, }) {
  const url = `${host}/api/comment/report`
  return post(url, params,)
}

export function fetchComment ({ params, }) {
  let url = `${host}/api/comment`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetchInStrict(url, {})
}

export function fetchCommentPublic ({ params, }) {
  let url = `${host}/api/public/comment`
  const query = _buildQuery(params)
  debug('params', params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }    
  return fetch(url, {})
}

export function deleteComment ({ params, }) {
  let url = `${host}/api/comment`
  const query = _buildQuery(params.query)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  delete params.query
  return del(url, params)
}

export function hideComment ({ params, }) {
  let url = `${host}/api/comment/hide`
  const query = _buildQuery(params.query)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  delete params.query
  return put(url, params)
}

export function updateComment ({ params, }) {
  let url = `${host}/api/comment`
  const query = _buildQuery(params.query)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  delete params.query
  return put(url, params,)
}

export function fetchCommentCount ({ params, }) {
  return new Promise((resolve) => {
    const url = `${host}/api/comment/count?asset_url=${params.assetUrl}`
    fetch(url).then(({ body, }) => {
      resolve(body.count)
    })
  })
}

export function fetchMeComments () {
  return new Promise((resolve) => {
    const url = `${host}/api/comment/me`
    fetchInStrict(url, {}).then(({ body, }) => {
      resolve(body)
    })
  })
}

export function getFollowingByResource (params) {
  let url = `${host}/api/following/resource`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
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

export function getFollowingByUser (params) {
  let url = `${host}/api/following/user`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
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

export function follow ({ params, }) {
  return new Promise((resolve, reject) => {
    const url = `${host}/api/following/pubsub`
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
  return fetchInStrict(url, {})
}

export function getMembersCount () {
  let url = `${host}/api/members/count`
  return fetchInStrict(url, {})
}

export function getPublicMember ({ params, }) {
  let url = `${host}/api/public/profile/${params.id}`
  // url = `${url}/profile/${params.id}`
  return fetch(url)
}

export function getPublicMembers ({ params, }) {
  let url = `${host}/api/public/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetch(url)
}

export function getPublicVideos ({ params, }) {
  let url = `${host}/api/public/videos`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetch(url)
}

export function getPublicVideosCount () {
  let url = `${host}/api/public/videos/count`
  return fetch(url)
}

export function getMeta (targetUrl) {
  let url = `${host}/api/meta`
  return post(url, { url: targetUrl, })
    .then(res => ({ status: res.status, body: camelizeKeys(res.body), }))
    .catch(err => err)
}

export function getNotification (id) {
  let url = `${host}/api/member/notification/${id}`
  return fetchInStrict(url, {})  
}

export function getPost ({ params, }) {
  let url = `${host}/api/public/post/${params.id}`
  return fetch(url, {})
}

export function getPosts ({ params, }) {
  let url = `${host}/api/posts`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetchInStrict(url, {})
}

export function getPostsCount ({ params, }) {
  let url = `${host}/api/posts/count`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetchInStrict(url, {})
}

export function getPublicPosts ({ params, }) {
  let url = `${host}/api/public/posts`
  if (params.category === 'latest') {
    url = `${host}/api/public/posts/latest`
  } else if (params.category === 'hot') {
    url = `${host}/api/public/posts/hot`
  }
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetch(url)
}

export function getPublicProjectsList ({ params, }) {
  let url = `${host}/api/public/projects`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetch(url)
}

export function getPublicReportsList ({ params, }) {
  let url = `${host}/api/public/reports`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return fetch(url)
}

export function getProfile ({ params = {},}) {
  const url = `${host}/api/profile`
  return fetchInStrict(url, { cookie: params.cookie, })
}

export function checkLoginStatus ({ params = {},}) {
  const url = `${host}/api/status`

  return fetchInStrict(url, { cookie: params.cookie, })
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

export function invite (params) {
  const url = `${host}/api/invitation`
  return post(url, params)
}

export function fetchInvitationQuota () {
  const url = `${host}/api/invitation/quota`
  return fetchInStrict(url, {}).then((res) => {
    if (_.get(res, 'status') === 200) {
      const quota = typeof(_.get(res, 'body.quota')) === 'string'
        ? validator.toInt(_.get(res, 'body.quota'))
        : _.get(res, 'body.quota', 0)
      return quota
    } else {
      return 0
    }
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
  return post(url, params, token)
}

export function resetPwdEmail (params, token) {
  const url = `${host}/api/recoverpwd`
  return post(url, params, token)
}

export function addMember (params) {
  const url = `${host}/api/register/admin`
  params.register_mode = 'ordinary'
  params.id = params.email
  params.mail = params.email
  params.active = 0
  return post(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function setupBasicProfile ({ params, }) {
  const url = `${host}/api/initmember`
  const token = getSetupToken()
  if (!token) {
    return Promise.resolve({ status: 403, })
  }
  return post(url, params, token)
}

export function updateMember ({ params, type, }) {
  const url = type !== 'role' ? `${host}/api/member` : `${host}/api/member/role`
  return put(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updateNotificationStatus ({ params, }) {
  const url = `${host}/api/member/notification/ack`
  return put(url, params)
}

export function updatePassword ({ params, }) {
  const url = `${host}/api/member/password`
  return put(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updatePost ({ params, }) {
  const url = `${host}/api/post`
  return put(url, params)
}

export function uploadImage (file, type) {
  let url
  debug('Goin to send upload req.')
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

export function publishPosts ({ params, }) {
  const url = `${host}/api/posts`
  return put(url, params)
}

export function search (keyword = '', params = {}) {
  let url = `${host}/api/search`
  debug('keyword', keyword)
  url = `${url}?query=${encodeURIComponent(`"${keyword}"`)}&hitsPerPage=${params.max_results}&page=${params.page - 1}`
  return fetch(url)
}

// export function syncAvatar (params) {
//   const url = `${host}/api/member/syncavatar`
//   return post(url, params)
// }
