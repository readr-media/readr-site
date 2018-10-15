import { camelizeKeys, } from 'humps'
import { filter, get, } from 'lodash'
import { getHost, } from './comm'
import Cookie from 'vue-cookie'
import superagent from 'superagent'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'html-truncate'
import uuidv4 from 'uuid/v4'

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
          resolve({ status: res.status, err, })
        } else {
          debug({ status: res.status, body: camelizeKeys(res.body), })
          resolve({ profile: camelizeKeys(res.body), status: res.status, })
        }
      })
    } else {
      resolve()
    }
  })
}
function logTraceXHR (params) {
  return new Promise(resolve => {
    const token = getToken()
    if (token) {
      const url = `${host}/api/trace`
      superagent
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          debug(err)
          resolve(err)
        } else {
          debug({ status: res.status, body: camelizeKeys(res.body), })
          resolve({ status: res.status, body: camelizeKeys(res.body), })
        }
      })
    } else {
      resolve()
    }    
  })
}
export function isAlinkDescendant (child) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node.tagName === 'A') {
      return { isAlink: true, href: node.href, }
    }
    node = node.parentNode
  }
  return { isAlink: false, href: '', }
}
function constructLog ({ category, description, eventType, sub, target, useragent, ...rest }) {
 return new Promise(resolve => {
    debug('useragent', useragent)
    const innerText = target.innerText ? sanitizeHtml(target.innerText, { allowedTags: [ '', ], }) : ''
    const isAlinkCheck = target.tagName === 'A' ? { isAlink: true, href: target.href, } : isAlinkDescendant(target)
    const dt = Date.now()
    if (!window.mmThisRuntimeClientId) {
      window.mmThisRuntimeClientId = uuidv4()
      window.mmThisRuntimeDatetimeStart = moment(dt).format('YYYY.MM.DD HH:mm:ss')
    }
    resolve({
      'useragent': useragent,
      'category': category,
      'client-id': sub,
      'current-runtime-id': window.mmThisRuntimeClientId,
      'current-runtime-start': window.mmThisRuntimeDatetimeStart,
      'curr-url': window.location.href,
      'datetime': moment(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      'description': description,
      'event-type': eventType,
      'redirect-to': isAlinkCheck.href,
      'referrer': document.referrer,
      'target-tag-name': target.tagName,
      'target-tag-class': target.className,
      'target-tag-id': target.id,
      'target-text': truncate(innerText, 100),
      'target-window-size': {
        width: document.documentElement.clientWidth || document.body.clientWidth,
        height: document.documentElement.clientWidth || document.body.clientWidth,
      },
      ...rest,
    })
 })
}
export function logTrace ({ category, description, eventType, sub, target, useragent, ...rest }) {
  if (!sub || !eventType || !target || !description || !category || !useragent) { return }
  constructLog({
    category,
    description,
    eventType,
    sub,
    target,
    useragent,
    ...rest,
  })
  .then(log => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      debug('send log status to sw.')
      navigator.serviceWorker.controller.postMessage({
        url: '/api/trace',
        params: log,
        action: 'trace',
      });
      return { status: 200, body: null, }
    } else {
      debug('Log')
      return logTraceXHR(log)
    }
  })
  .then(res => {
    debug('res from logTracing:', res)
  })
}

export function redirectToLogin (from) {
  /**
    * use location.replace instead of router.push to server-side render page
    */
  Cookie.set('location-replace-from', from, { expires: '60s', })
  location && location.replace('/login')
}


