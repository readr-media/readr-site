
import { getHost } from '../util/comm'
import uuidv4 from 'uuid/v4'
const superagent = require('superagent')
// import { camelizeKeys } from 'humps'
const host = getHost()

function _doFetch (url) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    // .query('')
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(camelizeKeys(res.body))
      }
    })
  })
}

export function register (param) {
  return new Promise((resolve) => {
    let url = `${host}/api/member`
    const uuid = uuidv4()
    param.id = uuid
    console.log('param', param)
    superagent
    .post(url)
    .send(
      param
    )
    .end(function (err, res) {
      if (err) {
        reject({ status: res.body.status })
      } else {
        resolve({ status: res.body.status })
      }
    })
  })
}