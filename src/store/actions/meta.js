/* eslint no-unused-vars: 0 */
import { fetchMeta } from 'src/api/meta'

// const debug = require('debug')('CLIENT:store:actions:meta')

const GET_META = ({ commit }, { url }) => {
  return fetchMeta({ url })
}

export {
  GET_META
}
