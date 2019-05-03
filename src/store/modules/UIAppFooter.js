export default {
  namespaced: true,
  state: {
    shouldHide: false,
  },
  mutations: {
    SET_HIDE (state, value) { 
      state.shouldHide = value
    },
  },
  actions: {

  },
}