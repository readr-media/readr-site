import { constructUrlWithQuery, fetch, fetchInStrict } from 'src/api/comm'
import { get } from 'lodash'
import { getHost } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:comm')
const host = getHost()

export function getPublicMemo ({ params }) {
  const url = constructUrlWithQuery(`${host}/api/public/memo/${get(params, 'memoId')}`, params)
  return fetch(url)
}

export function getPublicMemos ({ params }) {
  const url = constructUrlWithQuery(`${host}/api/public/memos`, params)
  return fetch(url)
}

export function getMemo ({ params }) {
  const url = constructUrlWithQuery(`${host}/api/memo/${get(params, 'memoId')}`, params)
  return fetchInStrict(url, {})
}

export function getMemos ({ params }) {
  const url = constructUrlWithQuery(`${host}/api/memos`, params)
  return fetchInStrict(url, {})
}
