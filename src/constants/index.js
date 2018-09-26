import { ROLE_MAP as ROLE_MAP_CONF, } from 'api/config'
import { get, } from 'lodash'
import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.tw'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

export const URL_FB_FANPAGE = 'https://www.facebook.com/readr.tw'
export const URL_TWITTER = 'https://twitter.com/READr_news'
export const URL_IG = 'https://www.instagram.com/readrteam_daily/'

export const ANNOUNCEMENT_ACCOUNT_ID = '126'

export const ROLE_MAP = [
  { key: get(ROLE_MAP_CONF, 'ADMIN'), value: '管理員', route: 'admin', },
  { key: get(ROLE_MAP_CONF, 'EDITOR'), value: '編輯', route: 'editor', },
  { key: get(ROLE_MAP_CONF, 'GUESTEDITOR'), value: '總編', route: 'guesteditor', },
  { key: get(ROLE_MAP_CONF, 'MEMBER'), value: '會員', route: 'member', },
]

export const SECTIONS_DEFAULT = [
  'CHIEF_EDITOR_TALK',
  'CELEBRITIES_TALK',
  'HOT_TALK',
  'CHIEF_EDITOR_LIST',
  'PROJECTS',
  'PROJECTS_IN_PROGRESS',
]

export const SETTING_NOTIFICATION = [
  // { name: 'COMMENT_PUSH', key: 'comment_push', },
  // { name: 'KEYWORD_PUSH', key: 'xxxxx', },  
  { name: 'DAILY_PUSH', key: 'daily_push', },  
  // { name: 'POST_PUSH', key: 'post_push', },
]
export const SETTING_ACCOUNT = [
  { name: 'HIDE_PROFILE', key: 'hide_profile', },
]

export const MM_SITE_DOMAIN = 'mirrormedia.mg'

export const OLD_PROJECTS_SLUGS = [
  'burkinafasogallery',
  'burkinafaso',
  'allenlien',
  'taiwan_diplomatic_relations',
  'legendhou-painting',
  'legendhou-gallery',
  'legendhou',
  'airquality',
  'valentines_day',
  'transport-industry',
  'transport-industry-mrt',
  'lottery',
  'mining',
  'hot-sugar',
  '20170801aboriginal',
  'universiade2017-chenshihchieh',
  'universiade2017-chenchieh',
  'universiade2017-chenyenyu',
  'universiade2017-kungyun',
  'universiade2017',
  'whitecollar',
  'real-name',
  'poetry',
  'rent-king',
  'rent-house',
  'political-contribution',
  'fertility',
]

// Image upload max size 30 MB
export const IMAGE_UPLOAD_MAX_SIZE = 31457280

export const CUSTOM_EDITOR_LIMIT = 3
export const RESOURCE_TYPE = {
  POST: 'post',
  RPOJECT: 'series',
  MEMO: 'memo',
  REPORT: 'project',
}

export const NOTIFICATION_TYPE = {
  COMMENT_COMMENT: 'comment_comment',
  COMMENT_REPLY: 'comment_reply',
  COMMENT_REPLY_AUTHOR: 'comment_reply_author',
  FOLLOW_MEMBER_REPLY: 'follow_member_reply',
  FOLLOW_MEMBER_POST: 'follow_member_post',
  FOLLOW_POST_REPLY: 'follow_post_reply',
  FOLLOW_PROJECT_REPLY: 'follow_project_reply',
  FOLLOW_MEMO_REPLY: 'follow_memo_reply',
  FOLLOW_PROJECT_STATUS: 'follow_project_status',
  // FOLLOE_PROJECT_PROGRESS: 'follow_project_progress',
  FOLLOW_PROJECT_MEMO: 'follow_project_memo',
  FOLLOW_PROJECT_REPORT: 'follow_project_report',
  POST_REPLY: 'post_reply',
}