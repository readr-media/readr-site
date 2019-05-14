// TODO: Rewrite this file to ES6 class will be better

import truncate from 'truncate-html'
import { get, isEmpty } from 'lodash'

import { POST_TYPE } from 'api/config'
import { SITE_FULL, ANNOUNCEMENT_ACCOUNT_ID } from 'src/constants'

import { getShareUrl, getFullUrl } from 'src/util/comm'
import { getReportLink } from './report'
import { truncatePostContent } from './truncate'
import { getPostContentStrings } from './content'
import { createShareUrl } from './share'

const postType = {
  [ POST_TYPE.REVIEW ]: 'normal',
  [ POST_TYPE.NEWS ]: 'news',
  [ POST_TYPE.REPORT ]: 'report',
  [ POST_TYPE.MEMO ]: 'memo'
}

export function getPostType (post) {
  const type = get(post, 'contentType') || get(post, 'type')
  return postType[type] || 'normal'
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
  const createPostUrl = {
    'news': getShareUrl(`/post/${get(postData, 'id', '')}`),
    'normal': getShareUrl(`/post/${get(postData, 'id', '')}`),
    'memo': get(postData, 'link') || getShareUrl(`/series/${get(postData, [ 'project', 'slug' ], '')}/${get(postData, 'id', '')}`),
    'report': get(postData, 'link') || getReportLink(postData)
  }
  return createPostUrl[postType] || SITE_FULL
}

export function getPostOgImgUrl (post) {
  const ogImgPathDefault = {
    normal: '/public/2.0/og-images/og-image-post.jpg',
    news: '/public/2.0/og-images/og-image.jpg',
    report: '/public/2.0/og-images/og-image.jpg',
    memo: '/public/2.0/og-images/og-image-memo.jpg'
  }
  const ogImage = get(post, 'ogImage') || ''
  const postType = getPostType(post)

  return ogImage !== '' ? getFullUrl(ogImage) : ogImgPathDefault[postType]
}

export function isAnnouncementAccountId (id) {
  const idString = (id || '').toString()
  return idString === ANNOUNCEMENT_ACCOUNT_ID
}

export function getFullUrlPost (postData) {
  const postType = getPostType(postData)

  switch (postType) {
    case 'report':
      return getFullUrl(`/report/${get(postData, 'slug', '')}`)
    default:
      return getFullUrl(`/post/${get(postData, 'id', '')}`)
  }
}

export function createPost (post = {}) {
  if (isEmpty(post)) { return {} }

  return {
    ...post,
    contentProcessed: getPostContentStrings(post),
    contentTruncateWithoutHtml: truncate(truncatePostContent(post), { length: 35, ellipsis: '...', stripTags: true }),
    typeProcessed: getPostType(post),
    processed: {
      // postType: getPostType(post),
      resource: getResource(post),
      // resourceType: getResourceType(post),
      // commentCount: get(post, 'commentAmount') || 0,
      // hasSource: post.linkTitle,
      // linkTitleTrim: truncate(post.linkTitle || '', 15),
      // linkDescriptionTrim: truncate(post.linkDescription || '', 35),
      // linkNameTrim: truncate(post.linkName || '', 20),
      // postContentDOM: getPostContentDOM(post),
      // postContentStrings: getPostContentStrings(post),
      // postContentStringsTruncate: truncatePostContent(post)
      ogImgUrl: getPostOgImgUrl(post),
      fullUrl: getFullUrlPost(post),
      shareUrlFB: createShareUrl('fb', getFullUrlPost(post)),
      shareUrlLine: createShareUrl('line', getFullUrlPost(post)),
      shareUrlCopylink: createShareUrl('copylink', getFullUrlPost(post))
    }
  }
}
