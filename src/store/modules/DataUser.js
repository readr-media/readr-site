import {
  getProfile,
  updateMember,
  login,
  checkLoginStatus,
} from 'src/api'

const { camelize, } = require('humps')

export default {
  namespaced: true,
  state () {
    return {
      profile: {},
      isLoggedIn: false,
    }
  },
  mutations: {
    SET_PROFILE (state, { profile, }) {
      state['profile'] = profile
    },
    UPDATED_PROFILE (state, { profile, }) {
      // Update the entry when user saving the profile value which has been edited
      Object.entries(profile).forEach((entry) => {
        const profileKey = camelize(entry[0])
        const profileValue = entry[1]
        state['profile'][profileKey] = profileValue
      })
    },
    SET_LOGGEIN_STATUS (state, { body, }) {
      state['isLoggedIn'] = body
    },
  },
  actions: {
    GET_PROFILE ({ commit, }, { params, }) {
      return getProfile({ params, }).then(({ status, body, }) => {
        if (status === 200) {
          commit('SET_PROFILE', { profile: body, })
        }
        return { status, body, }
      })
    },
    UPDATE_PROFILE ({ commit, }, { params, }) {
      commit('UPDATED_PROFILE', { profile: params, })
      return updateMember({ params, })
    },
    LOGIN ({ commit, }, { params, token, }) {
      return login(params, token).then(({ status, profile, }) => {
        commit('SET_LOGGEIN_STATUS', { body: true, })
        commit('SET_PROFILE', { profile, })
        return { status, }
      })
    },

    CHECK_LOGIN_STATUS: ({ commit, }, { params, }) => {
      return checkLoginStatus({ params, }).then(({ status, body, }) => {
        commit('SET_LOGGEIN_STATUS', { status, body, })
        return { status, body, }
      })
    },
  },
}