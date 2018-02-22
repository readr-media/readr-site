import _ from 'lodash'
import Cookie from 'vue-cookie'

export function saveToken (token) {
  process.browser && window && window.localStorage.setItem('csrf', token)
}
export function getToken () {
  if (process.browser && window) {
    let token = Cookie.get('csrf')
    token = token || (window && window.localStorage.getItem('csrf'))
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
    return _.filter(_.get(this.store, [ 'state', 'profile', 'scopes' ]), (s) => (s === comp)).length > 0
  }
}
const readrPerm = new ReadrPerm()
ReadrPerm.install = (Vue) => {
  Vue.mixin({
    created () {
      readrPerm.init(this.$store)
    }
  })

  Vue.prototype.$can = (comp) => readrPerm.permVerify(comp)
}
export default ReadrPerm
export function removeToken () {
  return new Promise((resolve) => {
    window && Cookie.delete('csrf')
    window && (window.localStorage.removeItem('csrf'))
    resolve()
  })
}
