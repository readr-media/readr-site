import _ from 'lodash'
import Vue from 'vue'

const SET_EMOTION_BY_RESOURCE = (state, { resource, emotion, data }) => {
  state['emotionByResource'][resource][emotion] = data || []
}

const UPDATE_EMOTION = (state, params) => {
  const action = params.customAttrs.action
  const emotion = params.dataBuffer.emotion
  const resource = params.dataBuffer.resource
  const oppositeEmotion = emotion === 'like' ? 'dislike' : 'like'
  const resourceIndex = _.findIndex(state.emotionByResource[resource][emotion], { resourceID: params.dataBuffer.object })
  let userIndex
  let oppositeEmotionResourceIndex
  let oppositeEmotionUserIndex
  switch (action) {
    case 'insert':
      if (resourceIndex === -1) {
        return state.emotionByResource[resource][emotion].push({ count: 1, followers: [ params.dataBuffer.subject ], resourceID: params.dataBuffer.object })
      }
      state.emotionByResource[resource][emotion][resourceIndex].followers.push(params.dataBuffer.subject)
      state.emotionByResource[resource][emotion][resourceIndex].count += 1
      return
    case 'delete':
      userIndex = state.emotionByResource[resource][emotion][resourceIndex].followers.indexOf(params.dataBuffer.subject)
      state.emotionByResource[resource][emotion][resourceIndex].count -= 1
      Vue.delete(state.emotionByResource[resource][emotion][resourceIndex].followers, userIndex)
      return
    case 'update':
      oppositeEmotionResourceIndex = _.findIndex(state.emotionByResource[resource][oppositeEmotion], { resourceID: params.dataBuffer.object })
      oppositeEmotionUserIndex = state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].followers.indexOf(params.dataBuffer.subject)
      if (resourceIndex === -1) {
        state.emotionByResource[resource][emotion].push({ count: 1, followers: [ params.dataBuffer.subject ], resourceID: params.dataBuffer.object })
      } else {
        state.emotionByResource[resource][emotion][resourceIndex].followers.push(params.dataBuffer.subject)
        state.emotionByResource[resource][emotion][resourceIndex].count += 1
      }
      state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].count -= 1
      Vue.delete(state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].followers, oppositeEmotionUserIndex)
  }
}

const UPDATE_EMOTION_BY_RESOURCE = (state, { resource, emotion, data }) => {
  const orig = _.values(state['emotionByResource'][resource][emotion])
  const loadmore = data || []
  state['emotionByResource'][resource][emotion] = _.concat(orig, loadmore)
}

export {
  SET_EMOTION_BY_RESOURCE,
  UPDATE_EMOTION,
  UPDATE_EMOTION_BY_RESOURCE
}
