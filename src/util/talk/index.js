import { SITE_DOMAIN_DEV, SITE_DOMAIN } from 'src/constants'
import { currEnv } from 'src/util/comm'
const debug = require('debug')('CLIENT:util:talk')

export function renderComment (targetParent, tagetEle, url, talkServer) {
  debug('talkServer', talkServer)

  /**
   * talkServer is required.
   */
  if (!talkServer) { return }

  const assetUrl = getAssetUrl(url)
  Coral && Coral.Talk.render(targetParent.querySelector(tagetEle), {
    talk: talkServer,
    assetUrl
  })
}
export function getAssetUrl (url) {
  const env = currEnv()
  debug('currEnv', env)
  debug('talk url', `${location.protocol}//${env !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`)
  return `${location.protocol}//${env !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`
}
