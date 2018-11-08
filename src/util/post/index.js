import { get, } from 'lodash'
import { POST_TYPE, } from 'api/config'
import { SITE_FULL, ANNOUNCEMENT_ACCOUNT_ID, } from 'src/constants'
import { getShareUrl, } from 'src/util/comm'
import { getReportLink, } from './report'

export function getPostType (post) {
  const type = get(post, 'type')
  const projectId = get(post, 'projectId')
  const slug = get(post, 'slug')

  if (type === POST_TYPE.NEWS) {
    return 'news'
  } else if (type === POST_TYPE.REPORT || (projectId && slug)) {
    return 'report'
  } else if (type === POST_TYPE.MEMO || (projectId && !slug)) {
    return 'memo'
  } else {
    return 'normal'
  }
}

export function getPostFullUrl (postData) {
  const postType = getPostType(postData)
  switch (postType) {
    case 'news':
    case 'normal':
    return getShareUrl(`/post/${get(postData, 'id', '')}`)
    case 'memo':
    return get(postData, 'link') || getShareUrl(`/series/${get(postData, [ 'project', 'slug', ], '')}/${get(postData, 'id', '')}`)
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
