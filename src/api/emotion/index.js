import { constructUrlWithQuery, fetch, post } from 'src/api/comm'
import { getHost } from 'src/util/comm'
const host = getHost()

function fetchEmotionByResource (params) {
  const url = constructUrlWithQuery(`${host}/api/public/emotion`, params)
  return fetch(url)
}

function updataEmotion ({ params }) {
  const url = `${host}/api/emotion/pubsub`
  return post(url, params)
}

export {
  fetchEmotionByResource,
  updataEmotion
}
