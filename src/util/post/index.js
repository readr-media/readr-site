import truncate from 'truncate-html'
import { get, isEmpty } from 'lodash'

import { POST_TYPE } from 'api/config'
import { SITE_FULL, ANNOUNCEMENT_ACCOUNT_ID } from 'src/constants'

import { getShareUrl } from 'src/util/comm'
import { getReportLink } from './report'
import { truncatePostContent } from './truncate'
import { getPostContentDOM, getPostContentStrings } from './content'

export function getPostType (post) {
  const type = get(post, 'contentType') || get(post, 'type')

  if (type === POST_TYPE.REVIEW) {
    return 'normal'
  } else if (type === POST_TYPE.NEWS) {
    return 'news'
  } else if (type === POST_TYPE.REPORT) {
    return 'report'
  } else if (type === POST_TYPE.MEMO) {
    return 'memo'
  } else {
    return 'normal'
  }
}

export function getResource (post) {
  const type = get(post, 'contentType') || get(post, 'type')
  const projectId = get(post, 'projectId')
  const slug = get(post, 'slug')

  if (type === POST_TYPE.REVIEW) {
    return 'post'
  } else if (type === POST_TYPE.NEWS) {
    return 'post'
  } else if (type === POST_TYPE.REPORT || (projectId && slug)) {
    return 'report'
  } else if (type === POST_TYPE.MEMO || (projectId && !slug)) {
    return 'memo'
  } else {
    return 'post'
  }
}

export function getResourceType (post) {
  switch (get(post, 'type')) {
    case POST_TYPE.NEWS:
      return 'news'
    case POST_TYPE.REVIEW:
      return 'review'
    default:
      return ''
  }
}

export function getPostFullUrl (postData) {
  const postType = getPostType(postData)
  switch (postType) {
    case 'news':
    case 'normal':
      return getShareUrl(`/post/${get(postData, 'id', '')}`)
    case 'memo':
      return get(postData, 'link') || getShareUrl(`/series/${get(postData, [ 'project', 'slug' ], '')}/${get(postData, 'id', '')}`)
    case 'report':
      return get(postData, 'link') || getReportLink(postData)
    default:
      return SITE_FULL
  }
}

export function isAnnouncementAccountId (id) {
  const idString = (id || '').toString()
  return idString === ANNOUNCEMENT_ACCOUNT_ID
}

export function createPost (post = {}) {
  if (isEmpty(post)) { return {} }

  return {
    ...post,
    processed: {
      postType: getPostType(post),
      resource: getResource(post),
      resourceType: getResourceType(post),
      commentCount: get(post, 'commentAmount') || 0,
      hasSource: post.linkTitle,
      linkTitleTrim: truncate(post.linkTitle || '', 15),
      linkDescriptionTrim: truncate(post.linkDescription || '', 35),
      linkNameTrim: truncate(post.linkName || '', 20),
      postContentDOM: getPostContentDOM(post),
      postContentStrings: getPostContentStrings(post),
      postContentStringsTruncate: truncatePostContent(post)
    }
  }
}
