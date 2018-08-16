import * as postFunc from 'src/api/post'
const debug = require('debug')('CLIENT:actions:post')
export const GET_POSTS_BY_TAG = ({ commit, }, { params, }) => {
  debug('params',  params)
  return postFunc.getPostsByTag({ params, }).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_POST_BY_TAG', { posts: body, })
    }
  })
}
