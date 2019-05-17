export default {
  namespaced: true,
  state () {
    return {
      loginAskFlag: {
        active: false,
        message: '',
        to: '/'
      }
    }
  },
  mutations: {
    SWITCH_ON_LOGIN_ASK (state, { active, message, type, to }) {
      state['loginAskFlag'] = { active, message, type, to }
    }
  },
  actions: {
    LOGIN_ASK_TOGGLE ({ commit }, { active, message, type, to }) {
      return commit('SWITCH_ON_LOGIN_ASK', { active, message, type, to })
    }
  }
}
