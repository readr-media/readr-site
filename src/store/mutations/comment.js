import _ from 'lodash'

const SET_COMMENT_COUNT = (state, { count, postId }) => {
  let commentCount = _.find(_.get(state, [ 'commentCount' ]), { postId })
  if (!commentCount) {
    commentCount = { postId, count: 0 }
    _.get(state, [ 'commentCount' ]).push(commentCount)
  }
  commentCount.count = count || 0
}

const SET_COMMENTS_ME = (state, { comments }) => {
  const profile = state['profile']
  profile && (profile.comments = comments)
}

const SET_COMMENTS_FOR_HOME = (state, { comments }) => {
  state[ 'commentsForHome' ] = comments
}

export {
  SET_COMMENT_COUNT,
  SET_COMMENTS_FOR_HOME,
  SET_COMMENTS_ME
}
