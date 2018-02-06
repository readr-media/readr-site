import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      'customEditors': [],
      'followingByResource': [],
      'followingByUser': [],
      'isLoggedIn': false,
      'members': [],
      'newsByUser': [],
      'newsDraftByUser': [],
      'posts': [],
      'postsCount': {},
      'profile': {},
      'publicPosts': [],
      'publicPostsHot': [],
      'register-token': '',
      'reviewsByUser': [],
      'reviewsDraftByUser': []
    },
    actions,
    mutations,
    getters
  })
}
