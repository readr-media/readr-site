export default {
  namespaced: true,
  state () {
    return {
      loginAskFlag: {
        active: false,
        message: '',
      },
    }
  },
  mutations: {
    SWITCH_ON_LOGIN_ASK (state, { active, message, type, }) {
      state['loginAskFlag'] = { active, message, type, }
    },
  },
  actions: {
    LOGIN_ASK_TOGGLE ({ commit, }, { active, message, type, }) {
      return commit('SWITCH_ON_LOGIN_ASK', { active, message, type, })
    },
  },
}