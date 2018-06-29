import _ from 'lodash'
import Vue from 'vue'
const { camelize, } = require('humps')
const debug = require('debug')('CLIENT:STORE:mutations')

export default {
  ADD_ITEM_TO_FOLLOWING_BY_USER: (state, params) => {
    state.followingByUser[params.userId].push(params.item)
  },
  REMOVE_ITEM_FROM_FOLLOWING_BY_USER: (state, data) => {
    const resourceIndex = _.findIndex(state.followingByUser[data.userId], { id: data.resourceId, })
    Vue.delete(state.followingByUser[data.userId], resourceIndex)
  },
  ADD_USER_TO_FOLLOWING_BY_RESOURCE: (state, params) => {
    const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceID: params.resourceId, })
    if (resourceIndex === -1) {
      state.followingByResource[params.resource].push({
        resourceID: params.resourceId,
        followers: [ params.userId, ],
      })
    } else {
      state.followingByResource[params.resource][resourceIndex].followers.push(params.userId)
    }
  },
  REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE: (state, params) => {
    const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceID: params.resourceId, })
    const userIndex = state.followingByResource[params.resource][resourceIndex].followers.indexOf(params.userId)
    Vue.delete(state.followingByResource[params.resource][resourceIndex].followers, userIndex)
  },
  SET_CLIENT_SIDE: (state) => {
    state['isClientSide'] = true
  },
  SET_COMMENT_COUNT: (state, { count, postId, }) => {
    let commentCount = _.find(_.get(state, [ 'commentCount', ]), { postId, })
    if (!commentCount) {
      commentCount = { postId, count: 0, }
      _.get(state, [ 'commentCount', ]).push(commentCount)
    }
    commentCount.count = count || 0
  },
  SET_COMMENTS_ME: (state, { comments, }) => {
    const profile = state['profile']
    profile && (profile.comments = comments)
  },
  SET_CUSTOM_EDITORS: (state, { members, }) => {
    state['customEditors'] = members
  },
  SET_EMOTION_BY_RESOURCE: (state, { resource, emotion, data, }) => {
    state['emotionByResource'][resource][emotion] = data || []
  },
  SET_FOLLOWING_BY_RESOURCE: (state, { resourceType, following, }) => {
    state['followingByResource'][resourceType] = following
  },
  UPDATE_FOLLOWING_BY_RESOURCE: (state, { resourceType, following, }) => {
    following.forEach(follow => {
      state['followingByResource'][resourceType].push(follow)
    })
  },
  SET_FOLLOWING_BY_USER: (state, { following, userId, }) => {
    const data = following || []
    Vue.set(state['followingByUser'], userId, data)
  },
  SET_LOGGEIN_STATUS: (state, { body, }) => {
    state['isLoggedIn'] = body
  },
  SET_TAGS: (state, { tags, }) => {
    state['tags'] = tags.items
  },
  SET_TAGS_COUNT: (state, { meta, }) => {
    state['tagsCount'] = meta.total
  },
  SET_TOKEN: (state, { token, type, }) => {
    switch (type) {
      case 'register':
        state['register-token'] = token
        break
    }
  },
  SET_MEMBERS: (state, { members, }) => {
    state['members'] = members
  },
  SET_MEMBERS_COUNT: (state, { count, }) => {
    state['membersCount'] = count
  },
  SET_MEMOS: (state, { items, }) => {
    state['memos'] = items
  },
  SET_MEMO_SINGLE: (state, { item, }) => {
    debug('SET_MEMO_SINGLE', item)
    state['memoSingle'] = item
  },
  SET_NOTIFICATION: (state, { items, }) => {
    state['notification'] = items
  },
  SET_POINT_PERSONAL: (state, { personalPoints, }) => {
    state['personalPoints'] = personalPoints
  },
  SET_PERSONAL_SETTING: (state, { setting, }) => {
    state['personalSetting'] = setting
  },
  SET_POINT_HISTORIES: (state, { histories, }) => {
    state['pointHistories'] = histories.items || []
  },
  SET_POSTS: (state, { posts, }) => {
    state['posts'] = posts.items
  },
  SET_POSTS_COUNT: (state, { meta, }) => {
    state['postsCount'] = meta.total
  },
  SET_POSTS_DRAFT: (state, { posts, }) => {
    state['postsDraft'] = posts.items
  },
  SET_POSTS_DRAFT_COUNT: (state, { meta, }) => {
    state['postsDraftCount'] = meta.total
  },
  SET_PUBLIC_POSTS: (state, { posts, outputStateTarget, }) => {
    debug('public posts', posts)
    state[ outputStateTarget ] = posts
  },
  SET_PUBLIC_MEMBER: (state, { member, }) => {
    state['publicMember'] = _.get(member, [ 'items', 0, ])
    debug('SET_PUBLIC_MEMBER', state['publicMember'])
  },
  SET_PUBLIC_MEMBERS: (state, { members, role, }) => {
    Vue.set(state['publicMembers'], role, members)
  },
  SET_PUBLIC_MEMOS: (state, { memos, }) => {
    state['publicMemos'] = memos
  },
  SET_PUBLIC_PROJECTS: (state, { status, publicProjects, }) => {
    Vue.set(state['publicProjects'], status, publicProjects)
  },
  SET_PUBLIC_PROJECT_SINGLE: (state, { item, }) => {
    state['publicProjectSingle'] = item
  },
  SET_PUBLIC_REPORTS: (state, { reports, }) => {
    state['publicReports'] = reports
  },
  SET_PUBLIC_VIDEOS: (state, { videos, }) => {
    state['publicVideos'] = videos.items
  },
  SET_PUBLIC_VIDEOS_COUNT: (state, { meta, }) => {
    state['publicVideosCount'] = meta.total
  },
  SET_PROJECTS_LIST: (state, { projectsList, }) => {
    state['projectsList'] = projectsList
  },
  SET_PUBLIC_POST_SINGLE: (state, { posts, }) => {
    state['publicPostSingle'] = posts
  },
  SET_PROFILE: (state, { profile, }) => {
    state['profile'] = profile
  },
  SET_SEARCH: (state, { searchResult, }) => {
    debug('searchResult:')
    debug(searchResult)
    state['searchResult']['items'] = searchResult[ 'items' ]
  },
  
  SET_INVITATION_QUOTA: (state, { quota, }) => {
    state['invitation_quota'] = quota
  },
  UPDATED_PROFILE: (state, { profile, }) => {
    // Update the entry when user saving the profile value which has been edited
    Object.entries(profile).forEach((entry) => {
      const profileKey = camelize(entry[0])
      const profileValue = entry[1]
      state['profile'][profileKey] = profileValue
    })
  },
  UPDATE_EMOTION: (state, params) => {
    const action = params.customAttrs.action
    const emotion = params.dataBuffer.emotion
    const resource = params.dataBuffer.resource
    const oppositeEmotion = emotion === 'like' ? 'dislike' : 'like'
    const resourceIndex = _.findIndex(state.emotionByResource[resource][emotion], { resourceID: params.dataBuffer.object, })
    let userIndex
    let oppositeEmotionResourceIndex
    let oppositeEmotionUserIndex
    switch (action) {
      case 'insert':
        if (resourceIndex === -1) {
          return state.emotionByResource[resource][emotion].push({ count: 1, followers: [ params.dataBuffer.subject, ], resourceID: params.dataBuffer.object, })
        }
        state.emotionByResource[resource][emotion][resourceIndex].followers.push(params.dataBuffer.subject)
        state.emotionByResource[resource][emotion][resourceIndex].count += 1
        return
      case 'delete':
        userIndex = state.emotionByResource[resource][emotion][resourceIndex].followers.indexOf(params.dataBuffer.subject)
        state.emotionByResource[resource][emotion][resourceIndex].count -= 1
        Vue.delete(state.emotionByResource[resource][emotion][resourceIndex].followers, userIndex)
        return
      case 'update':
        oppositeEmotionResourceIndex = _.findIndex(state.emotionByResource[resource][oppositeEmotion], { resourceID: params.dataBuffer.object, })
        oppositeEmotionUserIndex = state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].followers.indexOf(params.dataBuffer.subject)
        if (resourceIndex === -1) {
          state.emotionByResource[resource][emotion].push({ count: 1, followers: [ params.dataBuffer.subject, ], resourceID: params.dataBuffer.object, })
        } else {
          state.emotionByResource[resource][emotion][resourceIndex].followers.push(params.dataBuffer.subject)
          state.emotionByResource[resource][emotion][resourceIndex].count += 1
        }
        state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].count -= 1
        Vue.delete(state.emotionByResource[resource][oppositeEmotion][oppositeEmotionResourceIndex].followers, oppositeEmotionUserIndex)
        return
    }
  },
  UPDATE_PUBLIC_POSTS: (state, { posts, outputStateTarget, }) => {
    state[ outputStateTarget ]['items'] = _.concat(
      _.get(state, `${outputStateTarget}.items`, []),
      _.get(posts, 'items', [])
    )
  },
  UPDATE_MEMOS: (state, { items, }) => {
    state['memos'] = _.concat(_.get(state, `memos`, []), items)
  },
  /**
   * invitation
   */
  INVITATION_SWITCH_ON: (state) => {
    state['invitation_switch_status'] = true
  },
  INVITATION_SWITCH_OFF: (state) => {
    state['invitation_switch_status'] = false
  },
}
