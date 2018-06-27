import { ROLE_MAP as ROLE_MAP_CONF, } from 'api/config'
import { get, } from 'lodash'
import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.tw'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

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

export const PROFILE_SETTING = [
  {
    object: 'SETTING_PRIVACY', name: 'PRIVACY', items: [
      { name: 'HIDE_PROFILE', key: 'hide_profile', },
    ],
  },
  {
    object: 'SETTING_NOTIFICATION', name: 'NOTIFICATION', items: [
      { name: 'POST_PUSH', key: 'post_push', },
      // { name: 'POST_UPDATE', key: 'post_update', },
      { name: 'PROFILE_PUSH', key: 'profile_push', },
      { name: 'COMMENT_PUSH', key: 'comment_push', },
      // { name: 'DAILY_PUSH', key: 'daily_push', },
    ],
  },
  {
    // object: 'SETTING_NOTIFICATION_EDITOR', name: 'NOTIFICATION_EDITOR', items: [
    //   { name: 'REVIEW_COMMENT_PUSH', key: 'review_comment_push', },
    // ],
  },
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
