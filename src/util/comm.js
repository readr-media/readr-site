import _ from 'lodash'
import Cookie from 'vue-cookie'
import uuidv4 from 'uuid/v4'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, } from '../constants'

export function consoleLogOnDev ({ msg, }) {
  if (currEnv() === 'dev') {
    console.log(msg)
  }
}

export function currEnv () {
  if (process.env.VUE_ENV === 'client') {
    if (location.host.indexOf(SITE_DOMAIN) === 0 || location.host.indexOf(`www.${SITE_DOMAIN}`) === 0) {
      return 'prod'
    } else {
      return 'dev'
    }
  }
}

export function dateDiffFromNow (date) {
  const d1 = Math.floor(Date.parse(date) / 1000)
  const d2 = Math.floor(Date.now() / 1000)
  const diff = d2 - d1
  const hour = Math.floor(diff / 3600)
  const min = Math.floor((diff - hour * 3600) / 60)
  const sec = diff - hour * 3600 - min * 60
  const day = Math.floor(hour / 24)
  if (day !== 0) {
    return updatedAtYYYYMMDD(date)
  } else if (hour !== 0) {
    return `${hour} 小時`
  } else if (min !== 0) {
    return `${min} 分鐘`
  } else if (sec !== 0) {
    return `${sec} 秒`
  } else {
    return `剛剛`
  }
}

export function getImageUrl (url) {
  const browser = typeof window !== 'undefined'
  let hostname
  if (browser) {
    hostname = location.hostname
  } else {
    hostname = process.env.HOST || 'localhost'
  }
  if (hostname === 'localhost') {
    return `http://${SITE_DOMAIN_DEV}${url}`
  }
  return url
}

export function getHost () {
  const browser = typeof window !== 'undefined'
  if (browser) {
    return `//${location.host}`
  } else {
    const host = process.env.HOST || 'localhost'
    const port = parseInt(process.env.PORT) || 8080
    return `${host}:${port}`
  }
}

export function isScrollBarReachBottom () {
  function getScrollXY () {
    var scrOfX = 0, scrOfY = 0
    if ( typeof ( window.pageYOffset ) == 'number' ) {
      // Netscape compliant
      scrOfY = window.pageYOffset
      scrOfX = window.pageXOffset
    } else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
      // DOM compliant
      scrOfY = document.body.scrollTop
      scrOfX = document.body.scrollLeft
    } else if ( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
      // IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop
      scrOfX = document.documentElement.scrollLeft
    }
    return [ scrOfX, scrOfY, ]
  }

  function getDocHeight () {
    var D = document
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  }

  return getDocHeight() <= getScrollXY()[1] + window.innerHeight
}

export function setReadrCookie () {
  const uuid = uuidv4()
  Cookie.set('mmid', uuid, { expires: (10 * 365 * 24) + 'h', })
  return uuid
}

export function getValue (o = {}, p = [], d = '') {
  return _.get(o, p, d)
}

export function updatedAtYYYYMMDD (isoDate) {
  const date = isoDate.split('T')[0]
  return date.replace(/-/g, '/')
}
