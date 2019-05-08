import {
  getPublicProjectContents
} from 'src/api'

export default {
  namespaced: true,
  state: {
    publicProjectContents: []
  },
  mutations: {
    RESET_PUBLIC_PROJECT_CONTENTS (state) {
      state['publicProjectContents'] = []
    },
    PUSH_PUBLIC_PROJECT_CONTENTS (state, items = []) {
      state['publicProjectContents'].push(...items)
    }
  },
  actions: {
    FETCH ({ commit }, { projectId = '', params }) {
      return getPublicProjectContents({ projectId, params })
        .then(res => {
          commit('PUSH_PUBLIC_PROJECT_CONTENTS', res.body.items)
          return res
        })
        .catch((res) => {
          console.error(res)
        })
    }
  }
}
