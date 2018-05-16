const config = require('../../config')
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const debug = require('debug')('READR:api:middle:memo:comm')

async function fetchMemoSingle (memo_id) {
  debug('Going to fetch memo.', memo_id)
  return await new Promise((resolve, reject) => {
    const url = `${apiHost}/memo/${memo_id}`
    superagent
    .get(url)
    .timeout(config.API_TIMEOUT)
    .end((e, r) => {
      if (!e && r) {
        const resData = JSON.parse(r.text)
        debug('resData:')
        debug(resData)
        resolve(resData)
      } else {
        reject(e)
      }
    })    
  })
}

module.exports = {
  fetchMemoSingle,
}