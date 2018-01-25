const { ENDPOINT_SECURE, SCOPES } = require('../config')
const { filter, find, get, map } = require('lodash')

const constructScope = (perms, role) => (
  map(filter(SCOPES, (comp) => (
    get(comp, [ 'perm', 'length' ], 0) === filter(comp.perm, (perm) => (
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
module.exports = {
  constructScope
}