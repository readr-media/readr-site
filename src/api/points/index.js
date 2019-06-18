import { constructUrlWithQuery, fetchInStrict, post } from 'src/api/comm'
import { getHost } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:point')
const host = getHost()

export function getPointHistories ({ params }) {
  let url = constructUrlWithQuery(`${host}/api/points${params.objectType ? '/' + params.objectType : ''}`, params)
  return fetchInStrict(url, {})
}

export function getPointCurrent ({ params }) {
  let url = constructUrlWithQuery(`${host}/api/points/current`, params)
  return fetchInStrict(url, {})
}

export function addRewardPointsTransactions (params) {
  const url = `${host}/api/points`
  return post(url, params)
    .then(res => res.status)
    .catch(err => { throw err })
}

export function donate (params) {
  const url = `${host}/api/donate`
  // const url = `${host}/api/points`
  return post(url, params)
    .then(res => res.status)
    .catch(err => { throw err })
}
