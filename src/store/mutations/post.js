// const debug = require('debug')('CLIENT:mutations:post')

const SET_POST_BY_TAG = (state, { posts, }) => {
  state['postsByTag'] = posts
}

export {
  SET_POST_BY_TAG,
}