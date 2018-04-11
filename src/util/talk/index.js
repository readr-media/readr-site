import { SITE_DOMAIN_DEV, SITE_DOMAIN, } from 'src/constants'
import { TALK_SERVER, } from 'api/config.js'
import { currEnv, } from 'src/util/comm'
const debug = require('debug')('CLIENT:util:talk')

export function renderComment (target_parent, taget_ele, url, talk_server) {
  debug('process.env.TALK_SERVER', process.env.TALK_SERVER)
  debug('talk_server', talk_server)
  const asset_url = getAssetUrl(url)
  Coral && Coral.Talk.render(target_parent.querySelector(taget_ele), {
    talk: talk_server || TALK_SERVER,
    asset_url,
  })
}
export function getAssetUrl (url) {
  const curr_env = currEnv()
  debug('curr_env', curr_env)
  debug('talk url', `${location.protocol}//${curr_env !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`)
  return `${location.protocol}//${curr_env !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`
}