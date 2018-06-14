import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.tw'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

export const ANNOUNCEMENT_ACCOUNT_ID = '126'

export const ROLE_MAP = [
  { key: 9, value: '管理員', route: 'admin', },
  { key: 3, value: '編輯', route: 'editor', },
  { key: 2, value: '總編', route: 'guesteditor', },
  { key: 1, value: '會員', route: 'member', },
]

export const SECTIONS_DEFAULT = [
  'CHIEF_EDITOR_TALK',
  'CELEBRITIES_TALK',
  'HOT_TALK',
  'CHIEF_EDITOR_LIST',
  'PROJECTS',
  'PROJECTS_IN_PROGRESS',
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
