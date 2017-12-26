import _ from 'lodash'
import Cookie from 'vue-cookie'
import uuidv4 from 'uuid/v4'
import { SITE_DOMAIN } from '../constants'

export function consoleLogOnDev ({ msg }) {
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

export function setReadrCookie () {
  const uuid = uuidv4()
  Cookie.set('mmid', uuid, { expires: (10 * 365 * 24) + 'h' })
  return uuid
}

export function getValue (o = {}, p = [], d = '') {
  return _.get(o, p, d)
}
