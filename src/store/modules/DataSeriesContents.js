import {
  getPublicPosts
} from 'src/api'

export default {
  namespaced: true,
  state () {
    return {
      publicProjectContents: [],
      currentPage: 0
    }
  },
  mutations: {
    RESET_PUBLIC_PROJECT_CONTENTS (state) {
      state['publicProjectContents'] = []
    },
    PUSH_PUBLIC_PROJECT_CONTENTS (state, items = []) {
      state['publicProjectContents'].push(...items)
    },
    SET_CURRENT_PAGE (state, page) {
      state['currentPage'] = page
    }
  },
  actions: {
    FETCH ({ commit }, { params }) {
      return getPublicPosts({ params })
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
