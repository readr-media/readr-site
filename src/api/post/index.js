import { constructUrlWithQuery, fetchInStrict } from 'src/api/comm'
import { getHost } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:post')
const host = getHost()

export function getPostsByTag ({ params }) {
  const url = constructUrlWithQuery(`${host}/api/tags`, params)
  return fetchInStrict(url, {})
}
