import { TALK_SERVER } from 'api/config.js'

export function renderComment (taget_ele, url) {
  Coral && Coral.Talk.render(document.querySelector(taget_ele), {
    talk: TALK_SERVER,
    asset_url: url
  })
}