import { fetchEmotionByResource, updataEmotion, } from 'src/api/emotion'

const debug = require('debug')('CLIENT:store:actions:emotion')

const FETCH_EMOTION_BY_RESOURCE = ({ commit, }, params) => {
  return fetchEmotionByResource(params).then(({ status, body, }) => {
    if (status === 200) {
      if (params.mode === 'update') {
        return commit('UPDATE_EMOTION_BY_RESOURCE', { resource: params.resource, emotion: params.emotion, data: body.items, })
      }
      return commit('SET_EMOTION_BY_RESOURCE', { resource: params.resource, emotion: params.emotion, data: body.items, })
    }
  })
}

const UPDATE_EMOTION = ({ commit, }, params) => {
  return new Promise((resolve, reject) => {
    updataEmotion({ params, }).then(({ status, }) => {
      if (status === 200) {
        commit('UPDATE_EMOTION', params)
        return resolve()
      }
      return reject()
    }).catch((err) => {
      debug('UPDATE_EMOTION Error:', err)
      reject()
    })
  })
}

export {
  FETCH_EMOTION_BY_RESOURCE,
  UPDATE_EMOTION,
}
