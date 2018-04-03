import { SITE_DOMAIN_DEV, SITE_DOMAIN, } from 'src/constants'
import { TALK_SERVER, } from 'api/config.js'
import { currEnv, } from 'src/util/comm'
const debug = require('debug')('CLIENT:util:talk')

export function renderComment (target_parent, taget_ele, url) {
  const curr_env = currEnv()
  debug('curr_env', curr_env)
  debug('talk url', `${location.protocol}//${curr_env !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`)

  Coral && Coral.Talk.render(target_parent.querySelector(taget_ele), {
    talk: process.env.TALK_SERVER || TALK_SERVER,
    asset_url: `${location.protocol}//${currEnv() !== 'dev' ? SITE_DOMAIN : SITE_DOMAIN_DEV}${url}`,
  })
}