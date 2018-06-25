import { constructUrlWithQuery, fetchInStrict, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:comm')
const host = getHost()

export function getMembers ({ params, }) {
  const url = constructUrlWithQuery(`${host}/api/members`, params)
  return fetchInStrict(url, {})
}

export function getMembersByName ({ params, }) {
  const url = constructUrlWithQuery(`${host}/api/members/nickname`, params)
  return fetchInStrict(url, {})
}