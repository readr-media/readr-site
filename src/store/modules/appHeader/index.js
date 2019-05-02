import _ from 'lodash'
import {
  getPublicProjectContents,
} from 'src/api'

export default {
  namespaced: true,
  state: {
    shouldHide: false,
    layoutSeriesRouteNames: [ 'report', ],
    publicProjectContents: [],
  },
  mutations: {
    SET_HIDE (state, value) { 
      state.shouldHide = value
    },

    SET_PUBLIC_PROJECT_CONTENTS (state, items) {
      state['publicProjectContents'] = items
    },
    UPDATE_PUBLIC_PROJECT_CONTENTS (state, items = []) {
      state['publicProjectContents'].push(...items)
    },
  },
  actions: {
    GET_PUBLIC_PROJECT_CONTENTS ({ commit, }, { mode = 'set', project_id = '' , params, }) {
      return getPublicProjectContents({ project_id, params, })
        .then(({ status, body, }) => {
          if (status === 200) {
            const items = _.get(body, 'items')
            if (mode === 'set') {
              commit('SET_PUBLIC_PROJECT_CONTENTS', items)
            } else if (mode === 'update') {
              commit('UPDATE_PUBLIC_PROJECT_CONTENTS', items)
            }
    
            if (items.length === 0) { return { status: 'end', } }
            return { status, body, }
          } else {
            return { status, }
          }
        })
        .catch((res) => {
          console.error(res)
        })
    },
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