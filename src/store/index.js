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
      'followingByResource': {
        'post': [],
        'project': []
      },
      'followingByUser': [],
      'isLoggedIn': false,
      'members': [],
      'posts': [],
      'postsCount': 0,
      'postsDraft': [],
      'postsDraftCount': 0,
      'profile': {},
      'projectsList': [],
      'publicPosts': [],
      'publicPostsHot': [],
      'register-token': '',
      'tags': [],
      'tagsCount': 0,
    },
    actions,
    mutations,
    getters
  })
}
