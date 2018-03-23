const { filter, find, get, map, } = require('lodash')
const { redisFetching, redisWriting, } = require('../middle/redisHandler')
const config = require('../config')
const debug = require('debug')('READR:api:perms')
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const constructScope = (perms, role) => (
  map(filter(config.SCOPES, (comp) => (
    get(comp, [ 'perm', 'length', ], 0) === filter(comp.perm, (perm) => (
      find(perms, (p) => (
        perm === p.object && p.role === role
      ))
    )).length && (comp.role 
      && typeof(comp.role) === 'object' 
      && comp.role.length > 0
        ? find(comp.role, (r) => (r === role))
        : true)
  )), (p) => (p.comp)) 
)

const fetchPermissions = () => {
  return new Promise((resolve, reject) => {
    debug('About to fetch permissions')
    const url = `/permission/all`
    redisFetching(url, ({ error, data, }) => {
      if (!error && data) {
        debug('Got permissions from Redis secessfully')
        resolve(JSON.parse(data))
      } else {
        debug('About to fetch permissions from api')
        superagent
        .get(`${apiHost}${url}`)
        .end((err, res) => {
          if (!err && res) {
            const dt = JSON.parse(res.text)
            debug('Got permissions from api sucessfully.')
            if (Object.keys(dt).length !== 0) {
              redisWriting(url, res.text)
            }
            resolve(res.body)
          } else {
            console.log('Fetch permissions in false...', err)
            reject(err)
          }
        })
      }
    })
  })
}

module.exports = {
  constructScope,
  fetchPermissions,
}