export default {
  namespaced: true,
  state () {
    return {
      shouldHide: false,
      showSidebar: false,
      currentSidebarSlot: 'seriesContents',
      layoutSeriesRouteNames: [ 'report', 'post', 'series' ]
    }
  },
  mutations: {
    SET_HIDE (state, value) {
      state.shouldHide = value
    },
    SET_SHOW_SIDEBAR (state, value) {
      state.showSidebar = value
    },
    SET_CURRENT_SIDEBAR_SLOT (state, value) {
      state.currentSidebarSlot = value
    }
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
    }
  }
}
