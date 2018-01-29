// import Vue from 'vue'
const { camelize } = require('humps')

export default {
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
  SET_POSTS: (state, { posts }) => {
    state['posts'] = posts
  },
  SET_PUBLIC_POSTS: (state, { posts }) => {
    state['publicPosts'] = posts
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_USER_POSTS: (state, { posts }) => {
    state['posts-user'] = posts
  },
  SET_USER_POSTS_DRAFT: (state, { posts }) => {
    state['posts-user-draft'] = posts
  },
  UPDATED_PROFILE: (state, { profile }) => {
    // Update the entry when user saving the profile value which has been edited
    Object.entries(profile).forEach((entry) => {
      const profileKey = camelize(entry[0])
      const profileValue = entry[1]
      state['profile'][profileKey] = profileValue
    })
  }
}
