import _ from 'lodash'
import Vue from 'vue'
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
  ADD_USER_TO_FOLLOWING_BY_RESOURCE: (state, params) => {
    const resourceIndex = _.findIndex(state.followingByResource, { resourceid: `${params.resourceId}` })
    if (resourceIndex === -1) {
      state.followingByResource.push({
        resourceid: `${params.resourceId}`,
        follower: [ params.userId ]
      })
    } else {
      state.followingByResource[resourceIndex].follower.push(params.userId)
    }
  },
  REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE: (state, params) => {
    const resourceIndex = _.findIndex(state.followingByResource, { resourceid: `${params.resourceId}` })
    const userIndex = state.followingByResource[resourceIndex].follower.indexOf(params.userId)
    Vue.delete(state.followingByResource[resourceIndex].follower, userIndex)
  },
  SET_COMMENT_COUNT: (state, { count, postId, type }) => {
    const post = _.get(_.filter(_.get(state, [ type, 'items' ]), { id: postId }), [ 0 ])
    post && (post.commentAmount = count)
  },
  SET_COMMENTS_ME: (state, { comments }) => {
    const profile = state['profile']
    profile && (profile.comments = comments)
  },
  SET_CUSTOM_EDITORS: (state, { members }) => {
    state['customEditors'] = members
  },
  SET_FOLLOWING_BY_RESOURCE: (state, { following }) => {
    state['followingByResource'] = following
  },
  UPDATE_FOLLOWING_BY_RESOURCE: (state, { following }) => {
    following.forEach(follow => {
      state['followingByResource'].push(follow)
    })
  },
  SET_FOLLOWING_BY_USER: (state, { following }) => {
    state['followingByUser'] = following
  },
  SET_LOGGEIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_TAGS: (state, { tags }) => {
    state['tags'] = tags
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
  SET_POSTS: (state, { posts }) => {
    state['posts'] = posts.items
  },
  SET_POSTS_COUNT: (state, { meta }) => {
    state['postsCount'] = meta.total
  },
  SET_POSTS_DRAFT: (state, { posts }) => {
    state['postsDraft'] = posts.items
  },
  SET_POSTS_DRAFT_COUNT: (state, { meta }) => {
    state['postsDraftCount'] = meta.total
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
