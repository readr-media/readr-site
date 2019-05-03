export default {
  namespaced: true,
  state: {
    shouldHide: false,
    layoutSeriesRouteNames: [ 'report', ],
  },
  mutations: {
    SET_HIDE (state, value) { 
      state.shouldHide = value
    },
  },
  actions: {

  },
  getters: {
    layout (state, getters, rootState) {
      if (state.layoutSeriesRouteNames.includes(rootState.route.name)) {
        return 'series'
      } else {
        return 'default'
      }
    },
  },
}