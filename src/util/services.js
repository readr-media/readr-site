import { camelizeKeys, } from 'humps'
import { filter, get, } from 'lodash'
import { getHost, } from './comm'
import Cookie from 'vue-cookie'
import superagent from 'superagent'

const debug = require('debug')('CLIENT:services')
const host = getHost()

// export function saveToken (token) {
//   process.browser && window && window.localStorage.setItem('csrf', token)
// }
export function saveToken () {}
export function getToken () {
  if (process.browser && window) {
    let token = Cookie.get('csrf')
    // token = token || (window && window.localStorage.getItem('csrf'))
    return token
  } else {
    return undefined
  }
}

export function getSetupToken () {
  if (process.browser && window) {
    const token = Cookie.get('setup')
    return token
  } else {
    return undefined
  }  
}

export function delInitMemToken () {
  if (process.browser && window) {
    const token = Cookie.delete('initmember')
    return token
  }
}
export class ReadrPerm {
  init (store) {
    this.store = store
  }
  permVerify (comp) {
    return filter(get(this.store, 'state.profile.scopes'), (s) => (s === comp)).length > 0
  }
}
const readrPerm = new ReadrPerm()
ReadrPerm.install = (Vue) => {
  Vue.mixin({
    created () {
      readrPerm.init(this.$store)
    },
  })

  Vue.prototype.$can = (comp) => readrPerm.permVerify(comp)
}
export default ReadrPerm
export function removeToken (domain) {
  return new Promise((resolve) => {
    debug('domain', domain)
    if (window) {
      if (domain) {
        Cookie.delete('csrf', { domain, })
      } else {
        Cookie.delete('csrf')
      }
    }
    // window && (window.localStorage.removeItem('csrf'))
    resolve()
  })
}
export function getProfile (cookie) {
  return new Promise(resolve => {
    const token = cookie || getToken()
    if (token) {
      const url = `${host}/api/profile`
      superagent
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .end(function (err, res) {
        if (err) {
          debug(err)
          resolve(err)
        } else {
          debug({ status: res.status, body: camelizeKeys(res.body), })
          resolve({ profile: camelizeKeys(res.body), })
        }
      })
    } else {
      resolve()
    }
  })
}
