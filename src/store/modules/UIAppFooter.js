export default {
  namespaced: true,
  state () {
    return {
      shouldHide: false
    }
  },
  mutations: {
    SET_HIDE (state, value) {
      state.shouldHide = value
    }
  },
  actions: {

  }
}
