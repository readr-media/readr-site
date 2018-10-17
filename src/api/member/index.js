import { constructUrlWithQuery, fetchInStrict, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'
import { getToken, } from 'src/util/services'
import superagent from 'superagent'
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

export function fetchPersonalSetting () {
  const url = `${host}/api/member/setting`
  return fetchInStrict(url, {})
}

export function register (params, token) {
  const url = `${host}/api/register`
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token || getToken()}`)
      .send(params)
      .end((error, response) => {
        if (error) {
          reject({ status: response.status, err: response.body.Error, mode: response.body.Mode, })
        } else {
          resolve({ status: response.status, })
        }
      })
  })
}