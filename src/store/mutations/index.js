import * as mutationsComment from 'src/store/mutations/comment'
import * as mutationsEmotion from 'src/store/mutations/emotion'
import * as mutationsFollowing from 'src/store/mutations/following'
import * as mutationsMember from 'src/store/mutations/member'
import * as mutationsMemo from 'src/store/mutations/memo'
import * as mutationsPoints from 'src/store/mutations/points'
import * as mutationsPoll from 'src/store/mutations/poll'
import * as mutationsPost from 'src/store/mutations/post'
import * as mutationsProject from 'src/store/mutations/project'
import * as mutationsTag from 'src/store/mutations/tag'

const debug = require('debug')('CLIENT:STORE:mutations')

export default Object.assign({
  SET_CLIENT_SIDE: (state) => {
    state['isClientSide'] = true
  },
  SWITCH_CONVERSATION: (state, { active, message, type }) => {
    state['conversationFlag'] = { active, message, type }
  },
  SET_CUSTOM_EDITORS: (state, { members }) => {
    state['customEditors'] = members
  },
  SET_LOGGEIN_STATUS: (state, { body }) => {
    state['isLoggedIn'] = body
  },
  SET_TOKEN: (state, { token, type }) => {
    switch (type) {
      case 'register':
        state['register-token'] = token
        break
    }
  },
  SET_NOTIFICATION: (state, { items }) => {
    state['notification'] = items
  },
  SET_PUBLIC_REPORTS: (state, { reports }) => {
    state['publicReports'] = reports
  },
  SET_PUBLIC_VIDEOS: (state, { videos }) => {
    state['publicVideos'] = videos.items
  },
  SET_PUBLIC_VIDEOS_COUNT: (state, { meta }) => {
    state['publicVideosCount'] = meta.total
  },
  SET_RECAPTCHA_LOADED: (state, { isLoaded }) => {
    state['isRecaptchaLoaded'] = isLoaded
  },
  SET_SEARCH: (state, { searchResult }) => {
    debug('searchResult:')
    debug(searchResult)
    state['searchResult'] = searchResult
  },
  SET_INVITATION_QUOTA: (state, { quota }) => {
    state['invitation_quota'] = quota
  },
  SWITCH_ON_LOGIN_ASK: (state, { active, message, type }) => {
    state['loginAskFlag'] = { active, message, type }
  },
  /**
   * invitation
   */
  INVITATION_SWITCH_ON: (state) => {
    state['invitation_switch_status'] = true
  },
  INVITATION_SWITCH_OFF: (state) => {
    state['invitation_switch_status'] = false
  }
}, mutationsComment, mutationsEmotion, mutationsFollowing, mutationsMember, mutationsMemo, mutationsPoints, mutationsPoll, mutationsPost, mutationsProject, mutationsTag)
