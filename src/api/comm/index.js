import qs from 'qs'
import superagent from 'superagent'
import { camelizeKeys, } from 'humps'
import { getToken, } from 'src/util/services'
import { mapKeys, mapValues, snakeCase, } from 'lodash'

const debug = require('debug')('CLIENT:api:comm')

export function _buildQuery (params = {}) {
  let query = {}
  const whitelist = [
    'where',
    'max_result',
    'page',
    'sort',
    'sorting',
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
    'slugs',
    'project_slugs',
    'report_slugs',
    'member_id',
    'memo_publish_status',
    'emotion',
    'fields',
    'pay_type',
  ]
  const snakeCaseParams = mapKeys(params, (value, key) => snakeCase(key))
  whitelist.forEach((ele) => {
    if (snakeCaseParams.hasOwnProperty(ele)) {
      if (ele === 'where') {
        const where = mapValues(snakeCaseParams[ele], (value) => {
          value = Array.isArray(value) ? value : [ value, ]
          return { '$in': value, }
        })
        Object.keys(where).forEach((key) => {
          query[key] = JSON.stringify(where[key])
        })
      } else if (ele === 'ids'
        || ele === 'fields' 
        || ele === 'project_id' 
        || ele === 'object_ids' 
        || ele === 'slugs' 
        || ele === 'project_slugs' 
        || ele === 'report_slugs') {
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
    .end(function (err, res) {
      if (err) {
        reject({ err, res, })
      } else {
        // resolve(camelizeKeys(res.body))
        if (res.text === 'not found' || res.status !== 200) {
          reject(res.text)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      }
    })
  })
}

export function post (url, params, token) {
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

export function put (url, params) {
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

export function del (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .delete(url)
      .send(params || {})
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

export function fetchInStrict (url, { cookie, }) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${cookie || getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject({ err, res, })
        } else {
          // resolve(camelizeKeys(res.body))
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
  })
}
