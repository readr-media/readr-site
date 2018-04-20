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
      'commentCount': [],
      'followingByResource': {
        'post': [],
        'project': [],
        'member': [],
      },
      'followingByUser': [],
      'isClientSide': false,
      'isLoggedIn': false,
      'invitation_switch_status': false,
      'invitation_quota': 0,
      'members': [],
      'membersCount': 0,
      'notification': [],
      'posts': [],
      'postsCount': 0,
      'postsDraft': [],
      'postsDraftCount': 0,
      'profile': {},
      'projectsList': [],
      'publicPosts': [],
      'publicPostsHot': [],
      'publicPostSingle': [],
      'publicPostReview': [],
      'publicPostNews': [],
      'publicMember': {},
      'publicMembers': {},
      'publicProjects': {},
      'publicVideos': {},
      'publicVideosCount': 0,
      'rewardPointsTransactions': [],
      'register-token': '',
      'searchResult': {
        'items': [],
      },
      'tags': [],
      'tagsCount': 0,
    },
    actions,
    mutations,
    getters,
  })
}
