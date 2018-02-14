import { TALK_SERVER } from 'api/config.js'

export function renderComment (target_parent, taget_ele, url) {
  Coral && Coral.Talk.render(target_parent.querySelector(taget_ele), {
    talk: TALK_SERVER,
    asset_url: url
  })
}