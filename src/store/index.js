import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      'isLoggedIn': false,
      'register-token': '',
      'posts': [],
      'posts-user': [],
      'profile': {},
      'members': []
    },
    actions,
    mutations,
    getters
  })
}
