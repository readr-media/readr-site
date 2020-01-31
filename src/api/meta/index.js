import { constructUrlWithQuery, fetchInStrict } from 'src/api/comm'
import { getHost } from 'src/util/comm'
const host = getHost()

function fetchMeta (params) {
  const url = constructUrlWithQuery(`${host}/api/meta`, params)
  return fetchInStrict(url, {})
}

export {
  fetchMeta
}
