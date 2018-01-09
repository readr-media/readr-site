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
export function permVerify (comp) {
  const token = getToken()
  if (token) {
    return _.filter(_.get(JSON.parse(window.atob(token.split('.')[1])), [ 'scopes' ]), (s) => (s === comp)).length
  } else {
    return false
  }
}
export function removeToken () {
  return new Promise((resolve) => {
    window && Cookie.delete('csrf')
    window && (window.localStorage.removeItem('csrf'))
    resolve()
  })
}
