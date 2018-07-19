import { constructUrlWithQuery, del, fetchInStrict, post, put, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'

// const debug = require('debug')('CLIENT:api:tag')
const host = getHost()

export function addTags (params) {
  const url = `${host}/api/tags`
  return post(url, params)
}

export function deleteTags ({ params, }) {
  const url = constructUrlWithQuery(`${host}/api/tags`, params)
  return del(url)
}

export function getTags ({ params = {}, }) {
  const url = constructUrlWithQuery(`${host}/api/tags`, params)
  return fetchInStrict(url, {})
}

export function getTagsCount ({ params = {}, }) {
  const url = constructUrlWithQuery(`${host}/api/tags/count`, params)
  return fetchInStrict(url, {})
}

export function updateTags ({ params, }) {
  const url = `${host}/api/tags`
  return put(url, params)
}
