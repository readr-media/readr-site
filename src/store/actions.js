/*eslint no-unused-vars: 0*/
import _ from 'lodash'
import { POST_PUBLISH_STATUS, POST_TYPE, PROJECT_STATUS, } from '../../api/config'
import { ROLE_MAP, } from '../../src/constants'
import {
  addComment,
  addCommentReport,
  addMember,
  addPost,
  addTags,
  addRewardPointsTransactions,
  checkLoginStatus,
  checkPassword,
  deleteComment,
  deleteMemberProfileThumbnails,
  deleteMember,
  deleteMembers,
  deletePost,
  deletePosts,
  deletePostSelf,
  deleteTags,
  fetchComment,
  fetchCommentCount,
  fetchMeComments,
  fetchInvitationQuota,
  follow,
  getDisposableToken,
  getFollowingByResource,
  getFollowingByUser,
  getMembers,
  getMembersCount,
  getMemo,
  getMemos,
  getMeta,
  getNotification,
  getPointHistories,
  getPost,
  getPosts,
  getPostsCount,
  getProfile,
  getPublicMember,
  getPublicMembers,
  getPublicMemos,
  getPublicPosts,
  getPublicProject,
  getPublicProjectsList,
  getPublicReportsList,
  getPublicVideos,
  getPublicVideosCount,
  getTags,
  getTagsCount,
  hideComment,
  invite,
  login,
  publishPosts,
  register,
  resetPwd,
  resetPwdEmail,
  setupBasicProfile,
  search,
  syncAvatar,
  updateComment,
  updateMember,
  updateNotificationStatus,
  updatePassword,
  updatePost,
  updateTags,
  uploadImage,
  verifyRecaptchaToken,
} from '../api'
import { getProjectUrl, } from '../util/comm';

const debug = require('debug')('CLIENT:STORE:actions')
export default {
  ADD_COMMENT: ({ commit, dispatch, state, }, { params, }) => {
    return addComment({ params, })
  },
  ADD_COMMENT_REPORT: ({ commit, dispatch, state, }, { params, }) => {
    return addCommentReport({ params, })
  },
  ADD_MEMBER: ({ commit, dispatch, state, }, { params, }) => {
    return addMember(params)
  },
  ADD_POST: ({ commit, dispatch, state, }, { params, }) => {
    return addPost(params)
  },
  ADD_TAGS: ({ commit, dispatch, state, }, { params, }) => {
    return addTags(params)
  },
  ADD_REWARD_POINTS_TRANSACTIONS: ({ commit, dispatch, state, }, { params, }) => {
    return addRewardPointsTransactions(params)
  },
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state, }, { params, }) => {
    return checkLoginStatus({ params, }).then(({ status, body, }) => {
      commit('SET_LOGGEIN_STATUS', { status, body, })
      return { status, body, }
    })
  },
  CHECK_PASSWORD: ({ commit, dispatch, state, }, { params, }) => {
    return checkPassword(params).then(({ status, profile, }) => {
      return { status, }
    })
  },
  DISPOSABLE_TOKEN: ({ commit, dispatch, state, }, { type, }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type, })
    })
  },
  DELETE_COMMENT: ({ commit, dispatch, state, }, { params, }) => {
    return deleteComment({ params, })
  },
  DELETE_MEMBER_PROFILE_THUMBNAILS: ({ commit, dispatch, }, { id, }) => {
    return deleteMemberProfileThumbnails(id)
  },
  DELETE_MEMBER: ({ commit, dispatch, state, }, { params, }) => {
    return deleteMember({ params, })
  },
  DELETE_MEMBERS: ({ commit, dispatch, state, }, { params, }) => {
    return deleteMembers({ params, })
  },
  DELETE_POST: ({ commit, dispatch, state, }, { id, }) => {
    return deletePost(id)
  },
  DELETE_POSTS: ({ commit, dispatch, state, }, { params, }) => {
    return deletePosts({ params, })
  },
  DELETE_POST_SELF: ({ commit, dispatch, state, }, { id, }) => {
    return deletePostSelf(id)
  },
  DELETE_TAGS: ({ commit, dispatch, state, }, { params, }) => {
    return deleteTags({ params, })
  },
  FETCH_COMMENT: ({ commit, dispatch, state, }, { params, }) => {
    return fetchComment({ params, }).then(({ status, body, }) => {
      return _.get(body, 'items', [])
    })
  },
  FETCH_COMMENT_COUNT: ({ commit, dispatch, state, }, { params, type, }) => {
    return fetchCommentCount({ params, }).then(count => {
      commit('SET_COMMENT_COUNT', { count, postId: params.postId, type, })
    })
  },
  FETCH_COMMENTS_ME: ({ commit, dispatch, state, }) => {
    return fetchMeComments().then((comments) => {
      commit('SET_COMMENTS_ME', { comments, })
    })
  },
  FETCH_INVITATIONO_QUOTA: ({ commit, dispatch, state, }) => {
    return fetchInvitationQuota().then((quota) => {
      commit('SET_INVITATION_QUOTA', { quota, })
    })
  },
  FOLLOW: ({ commit, dispatch, state, }, { params, }) => {
    return new Promise((resolve, reject) => {
      follow({ params, }).then(({ status, }) => {
        if (status === 200) {
          resolve()
        }
      }).catch((err) => {
        reject()
      })
    })
  },  
  GET_FOLLOWING_BY_RESOURCE: ({ commit, dispatch, state, }, params) => {
    return getFollowingByResource(params).then(({ status, body, }) => {
      if (status === 200) {
        if (params.mode === 'update') {
          commit('UPDATE_FOLLOWING_BY_RESOURCE', { resourceType: params.resource, following: body, })
        } else {
          if (body.status !== 400) {
            commit('SET_FOLLOWING_BY_RESOURCE', { resourceType: params.resource, following: body, })
          }
        }
      }
    })
  },
  GET_FOLLOWING_BY_USER: ({ commit, dispatch, state, }, params) => {
    return getFollowingByUser(params).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_FOLLOWING_BY_USER', { following: body, userId: params.subject, })
      }
    })
  },
  GET_MEMBERS: ({ commit, dispatch, state, }, { params, }) => {
    return getMembers({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (params.custom_editor) {
          commit('SET_CUSTOM_EDITORS', { members: body, })
        } else {
          commit('SET_MEMBERS', { members: body, })
        }
      }
    })
  },
  GET_MEMBERS_COUNT: ({ commit, dispatch, state, }, { params, }) => {
    return getMembersCount({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        debug(`Member's count recieved.`, body)
        commit('SET_MEMBERS_COUNT', { count: _.get(body, 'meta.total', 0), })
      }
    })
  },
  GET_PUBLIC_MEMBER: ({ commit, dispatch, state, }, { params, }) => {
    return getPublicMember({ params, }).then(({ status, body, }) => {
      debug('GET_PUBLIC_MEMBER', body)
      if (status === 200) {
        commit('SET_PUBLIC_MEMBER', { member: body, })
      }
    })
  },
  GET_PUBLIC_MEMBERS: ({ commit, dispatch, state, }, { params, }) => {
    return getPublicMembers({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (params.custom_editor) {
          commit('SET_CUSTOM_EDITORS', { members: body, })
        } else if (params.role) {
          commit('SET_PUBLIC_MEMBERS', { members: body, role: _.find(ROLE_MAP, { key: params.role, }).value, })
        }
      }
    })
  },
  GET_NOTIFICATION: ({ commit, dispatch, state, }, { id, }) => {
    return getNotification(id).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_NOTIFICATION', { items: _.get(body, 'items', []), })
      }
    })
  },
  GET_MEMO: ({ commit, dispatch, state, }, { params, }) => {
    return getMemo({ params, }).then(({ status, body, }) => {
      debug('GET_MEMO', body)
      if (status === 200) {
        commit('SET_MEMO_SINGLE', { item: Object.assign({}, _.get(body, 'items', {}), { flag: 'memo', }), })
      }
    })
  },
  GET_MEMOS: ({ commit, dispatch, state, }, { params, mode, }) => {
    return getMemos({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (mode == 'set') {
          commit('SET_MEMOS', { items: _.map(_.get(body, 'items', []), i => {
            i.flag = 'memo'
            return i
          }), })
        } else if (mode === 'update') {
          if (_.get(body, 'items', []).length === 0) {
            return { status: 'end', }
          }
          commit('UPDATE_MEMOS', { items: _.map(_.get(body, 'items', []), i => {
            i.flag = 'memo'
            return i
          }), })          
        }
        return { status, }
      }
    })
  },
  GET_META: ({ commit, dispatch, state, }, { url, }) => {
    return getMeta(url)
  },
  GET_POINT_HISTORIES: ({ commit, dispatch, state, }, { params, }) => {
    return getPointHistories({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_POINT_HISTORIES', { histories: body, })
      }
    })
  },
  GET_POST: ({ commit, dispatch, state, }, { params, }) => {
    return new Promise((resolve, reject) => {
      getPost({ params, }).then(({ status, body, }) => {
        if (status === 200) {
          commit('SET_PUBLIC_POST_SINGLE', { posts: body, })
          resolve({ status: 200, })
        }
      }).catch((err) => {
        // reject(err)
        resolve({ status: 'error', res: err,})
      })
    })
  },
  GET_POSTS: ({ commit, dispatch, state, }, { params, }) => {
    return getPosts({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_POSTS', { posts: body, })
      }
    })
  },
  GET_POSTS_COUNT: ({ commit, dispatch, state, }, { params, }) => {
    return getPostsCount({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (params.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
          commit('SET_POSTS_DRAFT_COUNT', { meta: body.meta, })
        } else {
          commit('SET_POSTS_COUNT', { meta: body.meta, })
        }
      }
    })
  },
  GET_POSTS_BY_USER: ({ commit, dispatch, state, }, { params, }) => {
    return getPosts({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (params.where && params.where.type === POST_TYPE.NEWS) {
          if (params.where.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
            commit('SET_POSTS_DRAFT', { posts: body, })
          } else {
            commit('SET_POSTS', { posts: body, })
          }
        } else if (params.where && params.where.type === POST_TYPE.REVIEW) {
          if (params.where.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
            commit('SET_POSTS_DRAFT', { posts: body, })
          } else {
            commit('SET_POSTS', { posts: body, })
          }
        }
      }
    })
  },
  GET_PUBLIC_MEMOS: ({ commit, dispatch, state, }, { params, }) => {
    return new Promise((resolve, reject) => { 
      getPublicMemos({ params, }).then(({ status, body, }) => {
        debug('Get memos!', status, body)
        if (status === 200) {
          commit('SET_PUBLIC_MEMOS', { memos: body.items, })
          resolve({ status: 200, res: body, })
        } else {
          reject({ status: status, })
        }
      })
      .catch((res) => {
        reject({ status: status, res: res,})
      })
    })
  },
  // Todos: sync the logic design the same as GET_PUBLIC_PROJECTS
  GET_PUBLIC_POSTS: ({ commit, dispatch, state, }, { params, outputStateTarget = 'publicPosts', }) => {
    return new Promise((resolve, reject) => {
      getPublicPosts({ params, })
      .then(({ status, body, }) => {
        if (status === 200 && body.items) {
          if (params.mode === 'set') {
            if (params.category === 'latest') {
              commit('SET_PUBLIC_POSTS', { posts: body, outputStateTarget, })
            } else if (params.category === 'hot') {
              commit('SET_PUBLIC_POSTS', { posts: body, outputStateTarget: 'publicPostsHot', })
            }
          } else if (params.mode === 'update') {
            commit('UPDATE_PUBLIC_POSTS', { posts: body, outputStateTarget, })
          }
          resolve({ status: 200, res: body, })
        } else {
          // reject('end')
          if (body.items === null) {
            if (params.mode === 'set') {
              commit('SET_PUBLIC_POSTS', { posts: [], outputStateTarget, })
            }
          }
          resolve({ status: 'end', res: {},})
        }
      })
      .catch((res) => {
        // reject(res)
        resolve({ status: 'error', res: res,})
      })
    }) 
  },
  GET_PUBLIC_PROJECT: ({ commit, dispatch, state, }, { params, }) => {
    return getPublicProjectsList({ params, }).then(({ status, body, }) => {
      debug('Get single pro!', status, body)
      if (status === 200) {
        commit('SET_PUBLIC_PROJECT_SINGLE', { item: _.get(body, [ 'items', 0, ]), })
        return _.get(body, [ 'items', 0, ])
      } else {
        return { status, }
      }
    })
  },
  GET_PUBLIC_PROJECTS: ({ commit, dispatch, state, }, { params, }) => {
    const setPublicProject = (body) => {
      const projectStatus = _.get(params, [ 'where', 'status', ])
      let orig
      switch (projectStatus) {
        case PROJECT_STATUS.WIP:
          if (params.page > 1) {
            orig = _.values(_.get(state, [ 'publicProjects', 'inProgress', ], []))
            body.items =  _.concat(orig, body.items)
          }
          return commit('SET_PUBLIC_PROJECTS', { status: 'inProgress', publicProjects: body.items, })
        case PROJECT_STATUS.DONE:
          if (params.page > 1) {
            orig = _.values(_.get(state, [ 'publicProjects', 'done', ], []))
            body.items =  _.concat(orig, body.items)
          }
          return commit('SET_PUBLIC_PROJECTS', { status: 'done', publicProjects: body.items, })
        default:
          if (params.page > 1) {
            orig = _.values(_.get(state, [ 'publicProjects', 'normal', ], []))
            body.items =  _.concat(orig, body.items)
          }
          return commit('SET_PUBLIC_PROJECTS', { status: 'normal', publicProjects: body.items, })
      }
    }
    return new Promise((resolve, reject) => {
      getPublicProjectsList({ params, })
      .then(({ status, body, }) => {
        if (status === 200) {
          setPublicProject(body)
          resolve({ status: 200, res: body, })
        }
      })
      .catch((res) => {
        reject({ status: status, res: res,})
      })
    })
  },
  GET_PUBLIC_REPORTS: ({ commit, dispatch, state, }, { params, }) => {
    return new Promise((resolve, reject) => { 
      getPublicReportsList({ params, }).then(({ status, body, }) => {
        debug('Get reports!', status, body)
        if (status === 200) {
          commit('SET_PUBLIC_REPORTS', { reports: body.items, })
          resolve({ status: 200, res: body, })
        } else {
          reject({ status: status, })
        }
      })
      .catch((res) => {
        reject({ status: status, res: res,})
      })
    })
  },
  GET_PUBLIC_VIDEOS: ({ commit, dispatch, state, }, { params, }) => {
    const orig = _.values(_.get(state, [ 'publicVideos', ]))
    return new Promise((resolve, reject) => {
      getPublicVideos({ params, })
      .then(({ status, body, }) => {
        if (status === 200) {
          if (params.page > 1) {
            body.items =  _.concat(orig, body.items)
          }
          commit('SET_PUBLIC_VIDEOS', { videos: body, })
          resolve()
        }
      })
      .catch((res) => {
        reject(res)
      })
    })
  },
  GET_PUBLIC_VIDEOS_COUNT: ({ commit, dispatch, state, }) => {
    return new Promise((resolve, reject) => {
      getPublicVideosCount()
      .then(({ status, body, }) => {
        if (status === 200) {
          commit('SET_PUBLIC_VIDEOS_COUNT', { meta: body.meta, })
          resolve()
        }
      })
      .catch((res) => {
        reject(res)
      })
    })
  },
  GET_PROFILE: ({ commit, dispatch, state, }, { params, }) => {
    return getProfile({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body, })
      }
      return { status, body, }
    })
  },
  GET_TAGS: ({ commit, dispatch, state, }, { params, }) => {
    return getTags({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_TAGS', { tags: body, })
      }
    })
  },
  GET_TAGS_COUNT: ({ commit, dispatch, state, }) => {
    return getTagsCount().then(({ status, body, }) => {
      if (status === 200) {
        commit('SET_TAGS_COUNT', { meta: body.meta, })
      }
    })
  },
  HIDE_COMMENT: ({ commit, dispatch, state, }, { params, }) => {
    return hideComment({ params, })
  },
  LOGIN: ({ commit, dispatch, state, }, { params, token, }) => {
    return login(params, token).then(({ status, profile, }) => {
      commit('SET_LOGGEIN_STATUS', { body: true, })
      commit('SET_PROFILE', { profile, })
      return { status, }
    })
  },
  LOGOUT: ({ commit, dispatch, state, }) => {
    return new Promise((resolve) => {
      commit('SET_LOGGEIN_STATUS', { body: false, })
      commit('SET_PROFILE', { profile: {},})
      resolve()
    })
  },
  INVITE: ({ commit, dispatch, state, }, { params, }) => {
    return invite(params)
  },
  PUBLISH_POSTS: ({ commit, dispatch, state, }, { params, }) => {
    return publishPosts({ params, })
  },
  REGISTER: ({ commit, dispatch, state, }, { params, token, }) => {
    return register(params, token)
  },
  RESET_PWD_EMAIL: ({ commit, dispatch, state, }, { params, token, }) => {
    return resetPwdEmail(params, token)
  },
  RESET_PWD: ({ commit, dispatch, state, }, { params, }) => {
    return resetPwd(params)
  },
  SETUP_BASIC_PROFILE: ({ commit, dispatch, state, }, { params, }) => {
    return setupBasicProfile({ params, })
  },
  SEARCH: ({ commit, dispatch, state, }, { keyword, params, }) => {
    const orig = _.values(state.searchResult[ 'items' ])
    return state.searchResult.items && (params.page > 1)
      ? search(keyword, params).then(searchResult => {
        searchResult[ 'items' ] = _.concat(orig, _.get(searchResult, 'body.hits'))
        commit('SET_SEARCH', { searchResult, })
      }) : search(keyword, params).then(searchResult => {
        searchResult[ 'items' ] = _.get(searchResult, 'body.hits')
        commit('SET_SEARCH', { searchResult, })
      })
  },
  SYNC_AVATAR: ({ commit, dispatch, state, }, { params, }) => {
    return syncAvatar(params)
  },
  UPDATE_CLIENT_SIDE: ({ commit, dispatch, state, }) => {
    commit('SET_CLIENT_SIDE')
  },
  UPDATE_COMMENT: ({ commit, dispatch, state, }, { params, }) => {
    return updateComment({ params, })
  },
  UPDATE_FOLLOWING_BY_USER: ({ commit, dispatch, state, }, { params, }) => {
    if (params.action === 'follow') {
      commit('ADD_ITEM_TO_FOLLOWING_BY_USER', params)
    } else {
      commit('REMOVE_ITEM_FROM_FOLLOWING_BY_USER', params)
    }
  },
  UPDATE_FOLLOWING_BY_RESOURCE: ({ commit, dispatch, state, }, { params, }) => {
    if (params.action === 'follow') {
      commit('ADD_USER_TO_FOLLOWING_BY_RESOURCE', params)
    } else if (params.action === 'unfollow') {
      commit('REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE', params)
    }
  },
  UPDATE_MEMBER: ({ commit, dispatch, state, }, { params, type, }) => {
    return updateMember({ params, type, })
  },
  UPDATE_NOTIFICATION_STATUS: ({ commit, dispatch, state, }, { params, }) => {
    return updateNotificationStatus({ params, })
  },
  UPDATE_PROFILE: ({ commit, dispatch, state, }, { params, }) => {
    commit('UPDATED_PROFILE', { profile: params, })
    return updateMember({ params, })
  },
  UPDATE_PASSWORD: ({ commit, dispatch, state, }, { params, }) => {
    return updatePassword({ params, })
  },
  UPDATE_POST: ({ commit, dispatch, state, }, { params, }) => {
    return updatePost({ params, })
  },
  UPDATE_TAGS: ({ commit, dispatch, state, }, { params, }) => {
    return updateTags({ params, })
  },
  UPLOAD_IMAGE: ({ commit, dispatch, }, { file, type, }) => {
    debug('Got a action call to upload image.')
    return uploadImage(file, type)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state, }, { token, }) => {
    return verifyRecaptchaToken(token)
  },
  /**
   * invitation
   */
  INVITATION_SWITCH_ON: ({ commit, dispatch, state, }, { params, }) => {
    commit('INVITATION_SWITCH_ON', {})
  },
  INVITATION_SWITCH_OFF: ({ commit, dispatch, state, }, { params, }) => {
    commit('INVITATION_SWITCH_OFF', {})
  },
}
