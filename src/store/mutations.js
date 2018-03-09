import _ from 'lodash'
import Vue from 'vue'
const { camelize } = require('humps')
const debug = require('debug')('READR:STORE:mutations')

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
    const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceid: `${params.resourceId}` })
    if (resourceIndex === -1) {
      state.followingByResource[params.resource].push({
        resourceid: `${params.resourceId}`,
        follower: [ params.userId ]
      })
    } else {
      state.followingByResource[params.resource][resourceIndex].follower.push(params.userId)
    }
  },
  REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE: (state, params) => {
    const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceid: `${params.resourceId}` })
    const userIndex = state.followingByResource[params.resource][resourceIndex].follower.indexOf(params.userId)
    Vue.delete(state.followingByResource[params.resource][resourceIndex].follower, userIndex)
  },
  SET_COMMENT_COUNT: (state, { count, postId, type }) => {
    let commentCount = _.find(_.get(state, [ 'commentCount' ]), { postId })
    if (!commentCount) {
      commentCount = { postId, count: 0 }
      _.get(state, [ 'commentCount' ]).push(commentCount)
    }
    commentCount.count = count || 0
  },
  SET_COMMENTS_ME: (state, { comments }) => {
    const profile = state['profile']
    profile && (profile.comments = comments)
  },
  SET_CUSTOM_EDITORS: (state, { members }) => {
    state['customEditors'] = members
  },
  SET_FOLLOWING_BY_RESOURCE: (state, { resourceType, following }) => {
    state['followingByResource'][resourceType] = following
  },
  UPDATE_FOLLOWING_BY_RESOURCE: (state, { resourceType, following }) => {
    following.forEach(follow => {
      state['followingByResource'][resourceType].push(follow)
    })
  },
  SET_FOLLOWING_BY_USER: (state, { following }) => {
    state['followingByUser'] = following
  },
  SET_LOGGEIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_TAGS: (state, { tags }) => {
    state['tags'] = tags.items
  },
  SET_TAGS_COUNT: (state, { meta }) => {
    state['tagsCount'] = meta.total
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
  SET_PUBLIC_MEMBER: (state, { member }) => {
    state['publicMember'] = _.get(member, [ 'items', 0 ])
    debug('SET_PUBLIC_MEMBER', state['publicMember'])
  },
  SET_PUBLIC_MEMBERS: (state, { members, role }) => {
    Vue.set(state['publicMembers'], role, members)
  },
  SET_PUBLIC_VIDEOS: (state, { videos }) => {
    state['publicVideos'] = videos.items
  },
  SET_PROJECTS_LIST: (state, { projectsList }) => {
    state['projectsList'] = projectsList
  },
  SET_PUBLIC_POSTS_HOT: (state, { posts }) => {
    state['publicPostsHot'] = posts
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_SEARCH: (state, { searchResult }) => {
    debug('searchResult:')
    debug(searchResult)
    state['searchResult']['items'] = searchResult[ 'items' ]
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
    state['publicPosts']['items'] = _.concat(
      _.get(state, 'publicPosts.items', []),
      _.get(posts, 'items', [])
    )
  }
}
