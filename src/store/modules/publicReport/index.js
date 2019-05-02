import _ from 'lodash'
import { getPublicProjectsList, } from 'src/api'

export default {
  namespaced: true,
  state: {
    seriesData: {},
  },
  mutations: {
    SET_SERIES_DATA (state, { item, }) {
      state['seriesData'] = item
    },
  },
  actions: {
    GET_SERIES_DATA ({ commit, }, { params, }) {
      return getPublicProjectsList({ params, }).then(({ status, body, }) => {
        if (status === 200) {
          commit('SET_SERIES_DATA', { item: _.get(body, [ 'items', 0, ]), })
          return _.get(body, [ 'items', 0, ])
        } else {
          return { status, }
        }
      })
    },
  },
}