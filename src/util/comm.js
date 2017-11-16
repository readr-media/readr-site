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