import Vue from 'vue'
import _ from 'lodash'
const { camelize } = require('humps')

export default {
  ADD_ITEM_TO_FOLLOWING_BY_USER: (state, data) => {
    state.followingByUser.push(data)
  },
  REMOVE_ITEM_FROM_FOLLOWING_BY_USER: (state, data) => {
    const index = _.findIndex(state.followingByUser, (post) => {
      return post.id === data.id
    })
    Vue.delete(state.followingByUser, index)
  },
  SET_COMMENT_COUNT: (state, { count, postId, type }) => {
    const post = _.get(_.filter(_.get(state, [ type, 'items' ]), { id: postId }), [ 0 ])
    post && (post.commentAmount = count)
  },
  SET_CUSTOM_EDITORS: (state, { members }) => {
    state['customEditors'] = members
  },
  SET_FOLLOWING_BY_RESOURCE: (state, { following }) => {
    state['followingByResource'] = following
  },
  SET_FOLLOWING_BY_USER: (state, { following }) => {
    state['followingByUser'] = following
  },
  SET_LOGGEIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_TOKEN: (state, { token, type }) => {
    switch (type) {
      case 'register':
        state['register-token'] = token
        break
    }
  },
  SET_MEMBERS: (state, { members }) => {
    state['members'] = members
  },
  SET_NEWS_BY_USER: (state, { posts }) => {
    state['newsByUser'] = posts
  },
  SET_NEWS_DRAFT_BY_USER: (state, { posts }) => {
    state['newsDraftByUser'] = posts
  },
  SET_POSTS: (state, { posts }) => {
    state['posts'] = posts
  },
  SET_PUBLIC_POSTS: (state, { posts }) => {
    state['publicPosts'] = posts
  },
  SET_PUBLIC_POSTS_HOT: (state, { posts }) => {
    state['publicPostsHot'] = posts
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_REVIEWS_BY_USER: (state, { posts }) => {
    state['reviewsByUser'] = posts
  },
  SET_REVIEWS_DRAFT_BY_USER: (state, { posts }) => {
    state['reviewsDraftByUser'] = posts
  },
  UPDATED_PROFILE: (state, { profile }) => {
    // Update the entry when user saving the profile value which has been edited
    Object.entries(profile).forEach((entry) => {
      const profileKey = camelize(entry[0])
      const profileValue = entry[1]
      state['profile'][profileKey] = profileValue
    })
  },
  UPDATE_PUBLIC_POSTS: (state, { posts }) => {
    posts['items'].forEach((post) => {
      state['publicPosts']['items'].push(post)
    })
  }
}
