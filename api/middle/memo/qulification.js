const config = require('../../config')
// const jwtService = require('../../service.js')
// const jwtExpress = require('express-jwt')
const superagent = require('superagent')
const { find, get, } = require('lodash')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const debug = require('debug')('READR:api:middle:memo:qulification')

async function checkPerm (member, projects) {
  debug('Going to check perm for memos.', member)
  return await new Promise((resolve, reject) => {
    superagent
    .get(`${apiHost}/points/${member}/${config.POINT_OBJECT_TYPE.PROJECT_MEMO}`)
    .end((err, res) => {
      debug('Get res from api server.')
      debug(res.body)
      debug('projects')
      debug(projects)
      if (!err) {
        const records = get(res, 'body._items', [])
        const validatedProjects = projects.map(pid => find(records, r => `${r.object_id}` === `${pid}`))
        debug('validatedProjects', validatedProjects.length, validatedProjects.filter(r => r).length)
        debug(validatedProjects)
        const isAnyUnauthorized = validatedProjects.length > 1
          ? validatedProjects.length === validatedProjects.filter(r => r).length
          : validatedProjects[ 0 ]
        resolve(isAnyUnauthorized)
      } else {
        reject(err)
      }
    })  
  })
}

module.exports = {
  checkPerm,
}