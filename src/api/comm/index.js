import qs from 'qs'
import superagent from 'superagent'
import { camelizeKeys } from 'humps'
import { getToken } from 'src/util/services'
import { get, mapKeys, mapValues, snakeCase } from 'lodash'

const debug = require('debug')('CLIENT:api:comm')

export function _buildQuery (params = {}) {
  let query = {}
  const whitelist = [
    'where',
    'max_result',
    'page',
    'sort',
    'id',
    'ids',
    'custom_editor',
    'updated_by',
    'keyword',
    'stats',
    'role',
    'publish_status',
    'project_id',
    'object_ids',
    'resource',
    'resource_id',
    'resource_type',
    'parent',
    'slug',
    'slugs',
    'project_slugs',
    'report_slugs',
    'member_id',
    'memo_publish_status',
    'project_publish_status',
    'emotion',
    'fields',
    'pay_type',
    'url',
    'tagged_resources',
    'tagging_type',
    'type',
    'show_author',
    'show_updater',
    'show_tag',
    'show_comment',
    'embed',
    'start_at',
    'status',
    'active',
    'poll_id',
    'created_at',
    'mode',
    'target_ids'
  ]
  const snakeCaseParams = mapKeys(params, (value, key) => snakeCase(key))
  whitelist.forEach((ele) => {
    if (snakeCaseParams.hasOwnProperty(ele)) {
      if (ele === 'where') {
        const where = mapValues(snakeCaseParams[ele], (value) => {
          value = Array.isArray(value) ? value : [ value ]
          return { '$in': value }
        })
        Object.keys(where).forEach((key) => {
          query[key] = JSON.stringify(where[key])
        })
      } else if (Array.isArray(snakeCaseParams[ele])) {
        query[ele] = JSON.stringify(snakeCaseParams[ele])
      } else {
        query[ele] = snakeCaseParams[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

export function constructUrlWithQuery (url, params) {
  const _query = _buildQuery(params)
  let _url = url
  if (_query && (_query.length > 0)) {
    _url = _url + `?${_query}`
  }
  return _url
}

export function fetch (url) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .timeout({ response: 3000 })
      .then(res => resolve({ status: res.status, body: camelizeKeys(res.body) }))
      .catch(err => reject(err))
  })
}

// export function fetch (url) {
//   return new Promise((resolve, reject) => {
//     const s = Date.now()
//     const response = !process.browser && 3000
//     superagent
//       .get(url)
//       .timeout({ response })
//       .end(function (err, res) {
//         if (err) {
//           if (!process.browser) {
//             console.info('err occurred while fetching:', url, 'in', `${Date.now() - s}ms`, get(err, 'message'))
//             /** Use resolve instead of reject to avoiding blocking on server-side */
//             resolve(get(err, 'message'))
//           } else {
//             reject(new Error({ err, res }))
//           }
//         } else {
//         // resolve(camelizeKeys(res.body))
//           if (res.text === 'not found' || res.status !== 200) {
//             if (!process.browser) {
//               console.info('not found while fetching:', url, 'in', `${Date.now() - s}ms`)
//               /** Use resolve instead of reject to avoiding blocking on server-side */
//               resolve(res.text)
//             } else {
//               reject(res.text)
//             }
//           } else {
//             !process.browser && console.info('fetch:', url, 'in', `${Date.now() - s}ms`)
//             resolve({ status: res.status, body: camelizeKeys(res.body) })
//           }
//         }
//       })
//   })
// }

export function post (url, params, token) {
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token || getToken()}`)
      .send(params)
      .then(res => {
        resolve({ status: res.status, body: camelizeKeys(res.body) })
      })
      .catch(err => {
        debug(err)
        reject(err)
      })
  })
}

export function put (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .put(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(params)
      .then(res => {
        resolve({ status: res.status, body: camelizeKeys(res.body) })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function del (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .delete(url)
      .send(params || {})
      .set('Authorization', `Bearer ${getToken()}`)
      .then(res => {
        resolve({ status: res.status, body: camelizeKeys(res.body) })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function fetchInStrict (url, { cookie }) {
  return new Promise((resolve, reject) => {
    const s = Date.now()
    const response = !process.browser && 3000
    superagent
      .get(url)
      .set('Authorization', `Bearer ${cookie || getToken()}`)
      .timeout({ response })
      .end(function (err, res) {
        if (err) {
          if (!process.browser) {
            console.info('err occurred while fetching:', url, 'in', `${Date.now() - s}ms`, get(err, 'message'))
            resolve(get(err, 'message'))
          } else {
            reject(new Error({ err, res }))
          }
        } else {
          // resolve(camelizeKeys(res.body))
          !process.browser && console.info('fetch:', url, 'in', `${Date.now() - s}ms`)
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}
