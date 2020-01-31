import _ from 'lodash'
import Cookie from 'vue-cookie'
import dayjs from 'dayjs'
import uuidv4 from 'uuid/v4'
import pathToRegexp from 'path-to-regexp'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, SITE_FULL } from '../constants'

const debug = require('debug')('CLIENT:comm')
let isRecaptchaLoaded = false
let isFbSDKLoaded = false
let isGapiLoaded = false

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

export function dateDiffFromNow (timestamp) {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  const hour = Math.floor(diff / 3600)
  const min = Math.floor((diff - hour * 3600) / 60)
  const day = Math.floor(hour / 24)
  const weeks = Math.floor(day / 7)
  if (weeks > 3) {
    return dayjs(timestamp * 1000).format('YYYY/MM/DD HH:mm:ss')
  } else if (day >= 7) {
    return `${weeks} 週`
  } else if (hour >= 24) {
    return `${day} 天`
  } else if (hour >= 1) {
    return `${hour} 小時`
  } else if (min >= 5) {
    return `${min} 分鐘`
  } else {
    return `剛剛`
  }
}

export function getFullUrl (url) {
  const regexProtocol = /^http(s?):\/\//
  const regexDev = new RegExp(`localhost|${SITE_DOMAIN_DEV}`)
  const clientSide = typeof window !== 'undefined'
  if (url.match(regexProtocol)) {
    return url
  } else if (!clientSide) {
    return `${SITE_FULL}${url}`
  }
  const hostname = location.hostname || ''
  return hostname.match(regexDev) ? `http://${SITE_DOMAIN_DEV}${url}` : `${SITE_FULL}${url}`
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
  return getFullUrl(_.get(articleData, 'authorProfileImage') || (_.get(articleData, 'author.profileImage') || _.get(articleData, 'profileImage') || '/public/icons/exclamation.png'))
}

export function isScrollBarReachBottom (ratio = 0, errorMargin = 10) {
  const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  function getScrollXY () {
    var scrOfX = 0; var scrOfY = 0
    if (typeof (window.pageYOffset) === 'number') {
      // Netscape compliant
      scrOfY = window.pageYOffset
      scrOfX = window.pageXOffset
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      // DOM compliant
      scrOfY = document.body.scrollTop
      scrOfX = document.body.scrollLeft
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
      // IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop
      scrOfX = document.documentElement.scrollLeft
    }
    return [ scrOfX, scrOfY ]
  }

  function getDocHeight () {
    var D = document
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  }

  return getDocHeight() <= getScrollXY()[1] + window.innerHeight + (vh * ratio) + errorMargin
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
  Cookie.set('mmid', uuid, { expires: (10 * 365 * 24) + 'h' })
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

export function isDescendant (child, { parent = document.body }) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node === parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}

export function onImageLoaded (url) {
  var image = new Image()
  image.src = url

  return new Promise((resolve, reject) => {
    if (!url) reject(new Error())
    if (image.complete) {
      resolve(image)
    } else {
      image.onload = function () {
        resolve(image)
      }
    }
  })
}

export function getShareUrl (url) {
  if (process.env.VUE_ENV === 'client') {
    return location.hostname === 'localhost'
      ? `http://${SITE_DOMAIN_DEV}${url}`
      : `${location.protocol}//${location.host}${url}`
  }
  return `https://www.${SITE_DOMAIN}${url}`
}

export function isLink (content) {
  const regexp = /<a([\w\W]+?)><\/a>/
  return regexp.test(content)
}

export function isImg (content) {
  const regexp = /<img([\w\W]+?)\/>/
  return regexp.test(content)
}

export function clickImg (content, e) {
  if (isLink(content)) {
    e.stopPropagation()
    const href = getElementContentAttr(content, 'href')
    const hrefWindow = window.open()
    hrefWindow.opener = null
    hrefWindow.location = href
  }
}

export function getElementContentAttr (content, attr) {
  const regexp = new RegExp(`<.*?${attr}=['"](.*?)['"]`)
  const results = regexp.exec(content)
  return _.get(results, '1', '')
}

export function getElementContentSrc (content) {
  return getElementContentAttr(content, 'src')
}

export function isElementContentIframe (content) {
  const regexp = /<iframe([\w\W]+?)><\/iframe>/
  const isIframe = regexp.test(content)
  return isIframe
}

export function isElementContentYoutube (content) {
  const regexp = /<iframe([\w\W]+?)><\/iframe>/
  const isIframe = regexp.test(content)
  const isHostYoutube = getElementContentSrc(content).includes('www.youtube.com')
  return isIframe && isHostYoutube
}

export function loadRecaptcha (store) {
  return new Promise(resolve => {
    if (isRecaptchaLoaded) { return resolve() }
    const script = document.createElement('script')
    debug('GOIN TO LOAD RECAPTCHA')
    debug('GOIN TO LOAD RECAPTCHA')
    debug('GOIN TO LOAD RECAPTCHA')
    debug('GOIN TO LOAD RECAPTCHA')
    script.onload = () => {
      store.dispatch('SET_RECAPTCHA_LOADED').then(() => {
        debug('SET_RECAPTCHA_LOADED: done!')
        isRecaptchaLoaded = true
      })
    }
    script.setAttribute('src', 'https://www.google.com/recaptcha/api.js')
    document.head.appendChild(script)
    resolve()
  })
}

export function loadGapiSDK (store) {
  return new Promise(resolve => {
    if (isGapiLoaded) { return resolve() }
    const scriptGapiSDK = document.createElement('script')
    scriptGapiSDK.onload = () => {
      const scriptInitGapi = document.createElement('script')
      scriptInitGapi.innerHTML = `
        var gapiLoadedHandler = function () {
          window.gapi.client.init({
            discoveryDocs: [ 'https://people.googleapis.com/$discovery/rest?version=v1' ],
            clientId: "${_.get(store, 'state.setting.GOOGLE_CLIENT_ID', '')}",
            scope: 'profile'
          }).then((res) => {
            const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()
            if (isSignedIn) {
              var currUser = window.gapi.auth2.getAuthInstance().currentUser.get()
              window.googleStatus = {
                status: 'singedIn',
                idToken: currUser && (currUser.getAuthResponse().id_token)
              }
            }
          })
        } 
        window.gapi && window.gapi.load('client', this.gapiLoadedHandler);
      `
      document.head.appendChild(scriptInitGapi)
      isGapiLoaded = true
    }
    scriptGapiSDK.setAttribute('src', 'https://apis.google.com/js/api.js')
    document.head.appendChild(scriptGapiSDK)
    resolve()
  })
}

export function loadFbSDK (store) {
  return new Promise(resolve => {
    if (isFbSDKLoaded) { return resolve() }
    const scriptFbSDK = document.createElement('script')
    scriptFbSDK.innerHTML = `
      window.fbAsyncInit = function() {
        FB.init({
          appId            : '${_.get(store, 'state.setting.FB_CLIENT_ID')}',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.9'
        });
        FB.AppEvents.logPageView();
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            window.fbStatus = {
              status: 'connected',
              uid: response.authResponse.userID
            };
          }
        });
      };
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/zh_TW/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    `
    document.head.appendChild(scriptFbSDK)
    isFbSDKLoaded = true
    resolve()
  })
}

export function copyToClipboard (str) {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}

export function sendGaEvent (action, category, label) {
  gtag && gtag('event', action, {
    event_category: category,
    event_label: label
  })
}
