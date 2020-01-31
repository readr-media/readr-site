/* eslint no-empty-pattern: 0 */
import _ from 'lodash'
import * as actionPoints from 'src/store/actions/points'
import * as actionsComment from 'src/store/actions/comment'
import * as actionsEmotion from 'src/store/actions/emotion'
import * as actionsFollowing from 'src/store/actions/following'
import * as actionsMember from 'src/store/actions/member'
import * as actionsMemo from 'src/store/actions/memo'
import * as actionsMeta from 'src/store/actions/meta'
import * as actionsNotification from 'src/store/actions/notification'
import * as actionsPoll from 'src/store/actions/poll'
import * as actionsPost from 'src/store/actions/post'
import * as actionsProject from 'src/store/actions/project'
import * as actionsTag from 'src/store/actions/tag'

import {
  checkLoginStatus,
  checkPassword,
  fetchInvitationQuota,
  getDisposableToken,
  getPublicVideos,
  getPublicVideosCount,
  invite,
  login,
  resetPwd,
  resetPwdEmail,
  search,
  updatePassword,
  uploadImage,
  verifyRecaptchaToken
} from 'src/api'

const debug = require('debug')('CLIENT:STORE:actions')
export default Object.assign({
  CONVERSATION_TOGGLE: ({ commit }, { active, message, type }) => {
    return commit('SWITCH_CONVERSATION', { active, message, type })
  },
  CHECK_LOGIN_STATUS: ({ commit }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEIN_STATUS', { status, body })
      return { status, body }
    })
  },
  CHECK_PASSWORD: ({}, { params }) => {
    return checkPassword(params).then(({ status }) => {
      return { status }
    })
  },
  DISPOSABLE_TOKEN: ({ commit }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  FETCH_INVITATIONO_QUOTA: ({ commit }) => {
    return fetchInvitationQuota().then((quota) => {
      commit('SET_INVITATION_QUOTA', { quota })
    })
  },
  GET_PUBLIC_VIDEOS: ({ commit, state }, { params }) => {
    const orig = _.values(_.get(state, [ 'publicVideos' ]))
    return new Promise((resolve, reject) => {
      getPublicVideos({ params })
        .then(({ status, body }) => {
          if (status === 200) {
            if (params.page > 1) {
              body.items = _.concat(orig, body.items)
            }
            commit('SET_PUBLIC_VIDEOS', { videos: body })
            resolve()
          }
        })
        .catch((res) => {
          reject(res)
        })
    })
  },
  GET_PUBLIC_VIDEOS_COUNT: ({ commit }) => {
    return new Promise((resolve, reject) => {
      getPublicVideosCount()
        .then(({ status, body }) => {
          if (status === 200) {
            commit('SET_PUBLIC_VIDEOS_COUNT', { meta: body.meta })
            resolve()
          }
        })
        .catch((res) => {
          reject(res)
        })
    })
  },
  LOGIN: ({ commit }, { params, token }) => {
    return login(params, token).then(({ status, profile }) => {
      commit('SET_LOGGEIN_STATUS', { body: true })
      commit('SET_PROFILE', { profile })
      return { status }
    })
  },
  LOGIN_ASK_TOGGLE: ({ commit }, { active, message, type }) => {
    return commit('SWITCH_ON_LOGIN_ASK', { active, message, type })
  },
  LOGOUT: ({ commit }) => {
    return new Promise((resolve) => {
      commit('SET_LOGGEIN_STATUS', { body: false })
      commit('SET_PROFILE', { profile: {} })
      resolve()
    })
  },
  INVITE: ({}, { params }) => {
    return invite(params)
  },
  RESET_PWD_EMAIL: ({}, { params, token }) => {
    return resetPwdEmail(params, token)
  },
  RESET_PWD: ({}, { params }) => {
    return resetPwd(params)
  },
  SEARCH: async ({ commit, state }, { keyword, params }) => {
    const orig = _.values(state.searchResult[ 'items' ])
    const searchResult = await search(keyword, params).catch(() => ({}))
    if (state.searchResult.items && (params.page > 1)) {
      searchResult.items = _.concat(orig, _.get(searchResult, 'body.hits.hits'))
      return commit('SET_SEARCH', { searchResult })
    } else {
      searchResult.items = _.get(searchResult, 'body.hits.hits')
      return commit('SET_SEARCH', { searchResult })
    }
  },
  UPDATE_CLIENT_SIDE: ({ commit }) => {
    commit('SET_CLIENT_SIDE')
  },
  UPDATE_PASSWORD: ({}, { params }) => {
    return updatePassword({ params })
  },
  UPLOAD_IMAGE: ({}, { file, type }) => {
    debug('Got a action call to upload image.')
    return uploadImage(file, type)
  },
  SET_RECAPTCHA_LOADED: ({ commit }) => {
    return commit('SET_RECAPTCHA_LOADED', { isLoaded: true })
  },
  VERIFY_RECAPTCHA_TOKEN: ({}, { token }) => {
    return verifyRecaptchaToken(token)
  },
  /**
   * invitation
   */
  INVITATION_SWITCH_ON: ({ commit }, {}) => {
    commit('INVITATION_SWITCH_ON', {})
  },
  INVITATION_SWITCH_OFF: ({ commit }, {}) => {
    commit('INVITATION_SWITCH_OFF', {})
  }
}, actionPoints, actionsComment, actionsEmotion, actionsFollowing, actionsMember, actionsMemo, actionsMeta, actionsNotification, actionsPoll, actionsPost, actionsProject, actionsTag)
