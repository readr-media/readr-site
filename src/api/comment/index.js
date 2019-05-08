
import { constructUrlWithQuery, fetchInStrict } from 'src/api/comm'
import { getHost } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:comment')
const host = getHost()

export function fetchCommentForHome ({ params }) {
  let url = constructUrlWithQuery(`${host}/api/public/home/comment`, params)
  return fetchInStrict(url, {})
}
