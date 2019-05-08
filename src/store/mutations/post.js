import _ from 'lodash'

const debug = require('debug')('CLIENT:mutations:post')

const SET_POST_BY_TAG = (state, { posts }) => {
  state['postsByTag'] = posts
}

const SET_POSTS = (state, { posts }) => {
  state['posts'] = posts.items
}

const SET_POSTS_COUNT = (state, { meta }) => {
  state['postsCount'] = meta.total
}

const SET_POSTS_DRAFT = (state, { posts }) => {
  state['postsDraft'] = posts.items
}

const SET_POSTS_DRAFT_COUNT = (state, { meta }) => {
  state['postsDraftCount'] = meta.total
}

const SET_PUBLIC_POST_SINGLE = (state, { posts }) => {
  state['publicPostSingle'] = posts
}

const SET_PUBLIC_POSTS = (state, { posts, outputStateTarget }) => {
  debug('public posts', posts)
  state[ outputStateTarget ] = posts
}

const UPDATE_PUBLIC_POSTS = (state, { posts, outputStateTarget }) => {
  state[ outputStateTarget ]['items'] = _.concat(
    _.get(state, `${outputStateTarget}.items`, []),
    _.get(posts, 'items', [])
  )
}

export {
  SET_POST_BY_TAG,
  SET_POSTS,
  SET_POSTS_COUNT,
  SET_POSTS_DRAFT,
  SET_POSTS_DRAFT_COUNT,
  SET_PUBLIC_POST_SINGLE,
  SET_PUBLIC_POSTS,
  UPDATE_PUBLIC_POSTS
}
