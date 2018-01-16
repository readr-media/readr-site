import {
  addMember,
  addPost,
  checkLoginStatus,
  deleteMember,
  deleteMembers,
  deletePost,
  getDisposableToken,
  getProfile,
  getPosts,
  getMembers,
  getMeta,
  login,
  register,
  setupBasicProfile,
  updateMember,
  updatePassword,
  updatePost,
  uploadImage,
  deleteImage,
  verifyRecaptchaToken
} from '../api'

export default {
  ADD_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return addMember(params)
  },
  ADD_POST: ({ commit, dispatch, state }, { params }) => {
    return addPost(params)
  },
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEIN_STATUS', { status, body })
    })
  },
  DISPOSABLE_TOKEN: ({ commit, dispatch, state }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  DELETE_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return deleteMember({ params })
  },
  DELETE_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return deleteMembers({ params })
  },
  DELETE_POST: ({ commit, dispatch, state }, { id }) => {
    return deletePost(id)
  },
  GET_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return getMembers({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_MEMBERS', { members: body })
      }
    })
  },
  GET_META: ({ commit, dispatch, state }, { url }) => {
    return getMeta(url)
  },
  GET_POSTS: ({ commit, dispatch, state }, { params }) => {
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_POSTS', { posts: body })
      }
    })
  },
  GET_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return getProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },
  LOGIN: ({ commit, dispatch, state }, { params, token }) => {
    return login(params, token).then(({ status, profile }) => {
      commit('SET_LOGGEIN_STATUS', { body: true })
      commit('SET_PROFILE', { profile })
      return { status }
    })
  },
  LOGOUT: ({ commit, dispatch, state }) => {
    return new Promise((resolve) => {
      commit('SET_LOGGEIN_STATUS', { body: false })
      commit('SET_PROFILE', { profile: {}})
      resolve()
    })
  },
  REGISTER: ({ commit, dispatch, state }, { params, token }) => {
    return register(params, token)
  },
  SETUP_BASIC_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return setupBasicProfile({ params })
  },
  UPDATE_MEMBER: ({ commit, dispatch, state }, { params }) => {
    commit('SET_PROFILE', { profile: params })
    return updateMember({ params })
  },
  UPDATE_PASSWORD: ({ commit, dispatch, state }, { params }) => {
    return updatePassword({ params })
  },
  UPDATE_POST: ({ commit, dispatch, state }, { params }) => {
    return updatePost({ params })
  },
  UPLOAD_IMAGE: ({ commit, dispatch }, { file }) => {
    return uploadImage(file)
  },
  DELETE_IMAGE: ({ commit, dispatch }, { file }) => {
    return deleteImage(file)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state }, { token }) => {
    return verifyRecaptchaToken(token)
  }
}
