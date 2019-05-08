import {
  getPost
} from 'src/api'

export default {
  namespaced: true,
  state: {
    post: {}
  },
  actions: {
    GET_POST ({ commit }, { id, params }) {
      return getPost({ id, params })
        .then(response => {
          commit('SET_POST', response.body.items[0])
        })
        // .catch(err => {
        //   debug('Get fetching error.', { status: 'error', res: err,})
        //   reject({ status: 'error', res: err,})
        // })
    }
  },
  mutations: {
    SET_POST (state, post) {
      state.post = post
    }
  }
}
