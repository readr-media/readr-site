import _ from 'lodash'
import Cookie from 'vue-cookie'
import uuidv4 from 'uuid/v4'
import pathToRegexp from 'path-to-regexp'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, MM_SITE_DOMAIN, OLD_PROJECTS_SLUGS, } from '../constants'

const debug = require('debug')('CLIENT:comm')

export function currEnv () {
  if (process.env.VUE_ENV === 'client') {
    debug('SITE_DOMAIN', SITE_DOMAIN)
    debug('location.hostname', location.hostname, (location.hostname.indexOf(SITE_DOMAIN) === 0 || location.hostname.indexOf(`www.${SITE_DOMAIN}`) === 0))
    if (location.hostname.indexOf(SITE_DOMAIN) === 0 || location.hostname.indexOf(`www.${SITE_DOMAIN}`) === 0) {
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

export function getArticleAuthorId (articleData) {
  debug('Going to parse author data.')
  const author = _.get(articleData, 'author.id')
  debug(_.get(articleData, 'author'))
  debug(_.get(articleData, 'author.id'))
  debug(isNaN(`${author}`))
  return !isNaN(`${author}`) ? author : _.get(articleData, 'author')
}

export function getArticleAuthorNickname (articleData) {
  return _.get(articleData, 'authorNickname') || _.get(articleData, 'author.nickname') || _.get(articleData, 'nickname')
}

export function getArticleAuthorThumbnailImg (articleData) {
  return getImageUrl(_.get(articleData, 'authorProfileImage') || (_.get(articleData, 'author.profileImage') || _.get(articleData, 'profileImage') || '/public/icons/exclamation.png'))
}

export function isScrollBarReachBottom (ratio = 0) {
  const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
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

  return getDocHeight() <= getScrollXY()[1] + window.innerHeight + (vh * ratio)
}

export function isElementReachInView (root, selector, offset = 0) {
  const ele = root.querySelector(selector)
  if (!ele) {
    debug('ele', false)
    return false
  } else {
    const bottom = ele.getBoundingClientRect().bottom
    return bottom <= window.innerHeight * offset
  }
}

export function isElementScrollable (el) {
  return (el && (el.scrollHeight > el.offsetHeight) && !(el.offsetWidth > el.scrollWidth))
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
  if (!isoDate) return isoDate
  const date = isoDate.split('T')[0]
  return date.replace(/-/g, '/')
}

export function isCurrentRoutePath (route, path) {
  return pathToRegexp(path).test(route.path)
}

export function isClientSide () {
  return _.get(this.$store, 'state.isClientSide', false)
}

export function getReportUrl (slug) {
  return OLD_PROJECTS_SLUGS.includes(slug) ? `http://${MM_SITE_DOMAIN}/projects/${slug}` : `http://${SITE_DOMAIN}/project/${slug}`
}

export function isDescendant (child, { parent = document.body, }) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node === parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}

export function onImageLoaded(url) {
  var image = new Image()
  image.src = url

  return new Promise((resolve, reject) => {
    if (!url) reject()
    if (image.complete) {
      resolve(image)
    } else {
      image.onload = function () {
        resolve(image)
      }
    }
  })
}
