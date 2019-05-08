import { fetchEmotionByResource, updataEmotion } from 'src/api/emotion'

const debug = require('debug')('CLIENT:store:actions:emotion')

const handleErrorParams = (params) => {
  const opposite = params
  let action = params.customAttrs.action
  let emotion = params.dataBuffer.emotion
  if (action !== 'update') {
    action = action === 'insert' ? 'delete' : 'insert'
  } else {
    emotion = emotion === 'like' ? 'dislike' : 'like'
  }
  opposite.customAttrs.action = action
  opposite.dataBuffer.emotion = emotion
  return opposite
}

const FETCH_EMOTION_BY_RESOURCE = ({ commit }, params) => {
  return fetchEmotionByResource(params).then(({ status, body }) => {
    if (status === 200) {
      if (params.mode === 'update') {
        return commit('UPDATE_EMOTION_BY_RESOURCE', { resource: params.resource, emotion: params.emotion, data: body.items })
      }
      return commit('SET_EMOTION_BY_RESOURCE', { resource: params.resource, emotion: params.emotion, data: body.items })
    }
  })
}

const UPDATE_EMOTION = ({ commit }, params) => {
  commit('UPDATE_EMOTION', params)
  return new Promise((resolve, reject) => {
    updataEmotion({ params }).then(({ status }) => {
      if (status === 200) {
        return resolve()
      }
      // return reject()
    }).catch((err) => {
      debug('UPDATE_EMOTION Error:', err)
      commit('UPDATE_EMOTION', handleErrorParams(params))
      reject(err)
    })
  })
}

export {
  FETCH_EMOTION_BY_RESOURCE,
  UPDATE_EMOTION
}
