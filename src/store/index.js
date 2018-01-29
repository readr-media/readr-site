import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      'followingByResource': [],
      'followingByUser': [],
      'isLoggedIn': false,
      'register-token': '',
      'posts': [],
      'publicPosts': [],
      'posts-user': [],
      'posts-user-draft': [],
      'profile': {},
      'members': []
    },
    actions,
    mutations,
    getters
  })
}
