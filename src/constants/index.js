import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.com'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

export const ROLE_MAP = [
  { key: 9, value: '管理員', route: 'admin', },
  { key: 3, value: '編輯', route: 'editor', },
  { key: 2, value: '總編', route: 'guesteditor', },
  { key: 1, value: '會員', route: 'member', },
]

export const SECTIONS_DEFAULT = {
  // 'chief-editor-talk': '總編評論',
  // 'celebrities-talk': '名人聊新聞',
  // 'hot-talk': '熱門評論',
  // 'chief-editor-list': '總編列表',
  // 'projects': '新聞專題'
  'chief-editor-talk': '視角',
  'celebrities-talk': '對話',
  'hot-talk': '焦點',
  'chief-editor-list': '客座',
  'projects': '議題',
}

// Image upload max size 30 MB
export const IMAGE_UPLOAD_MAX_SIZE = 31457280

export const CUSTOM_EDITOR_LIMIT = 3

// Header Use
export const WORDING_HEADER_LOGIN = '登入'
export const WORDING_HEADER_LOGOUT = '登出'
export const WORIDNG_HEADER_MEMBER_CENTRE = '會員中心'
export const WORIDNG_HEADER_MEMBER_SEARCH = '搜尋'

// Post list
export const WORDING_POSTLIST_ACTIVE = '狀態'
export const WORDING_POSTLIST_ACTIVE_DRAFT = '草稿'
export const WORDING_POSTLIST_ACTIVE_PENDING = '待審核'
export const WORDING_POSTLIST_ACTIVE_PENDING_PROJECT = '進行中'
export const WORDING_POSTLIST_ACTIVE_PUBLISH = '已發布'
export const WORDING_POSTLIST_ACTIVE_PUBLISH_PROJECT = '已完成'
export const WORDING_POSTLIST_ACTIVE_UNPUBLISH = '已下架'
export const WORDING_POSTLIST_DELETE = '刪除'
export const WORDING_POSTLIST_DRAFT_RECORD = '未提交評論記錄'
export const WORDING_POSTLIST_EDIT = '編輯'
export const WORDING_POSTLIST_LINK = '連結'
export const WORDING_POSTLIST_NICKNAME = '暱稱'
export const WORDING_POSTLIST_PUBLISH = '發布'
export const WORDING_POSTLIST_PUBLISH_AT = '發布時間'
export const WORDING_POSTLIST_TITLE = '標題'
export const WORDING_POSTLIST_UPDATE = '修改'
export const WORDING_POSTLIST_UPDATE_AT = '更新時間'
export const WORDING_POSTLIST_VIDEO = '影片'

// Points
export const WORDING_POINTS_AVAILABLE = '目前點數'
export const WORDING_POINTS_SPENT = '使用點數'
export const WORDING_POINTS_SPENT_WHEN = '使用時間'

// Post editor
export const WORDING_POSTEDITOR_DELETE = '刪除'
export const WORDING_POSTEDITOR_EDITOR = '編輯器'
export const WORDING_POSTEDITOR_INPUT_TITLE = '輸入標題'
export const WORDING_POSTEDITOR_LINK = '連結'
export const WORDING_POSTEDITOR_NEWS = '新聞'
export const WORDING_POSTEDITOR_NOT_FOUND = 'No results found'
export const WORDING_POSTEDITOR_OG_DESCRIPTION = '分享說明'
export const WORDING_POSTEDITOR_OG_IMAGE = '分享縮圖'
export const WORDING_POSTEDITOR_OG_TITLE = '分享標題'
export const WORDING_POSTEDITOR_PUBLISH = '發布'
export const WORDING_POSTEDITOR_PUBLISH_DATE = '發布日期'
export const WORDING_POSTEDITOR_RETURN_TO_DRAFT = '退回草稿'
export const WORDING_POSTEDITOR_SAVE = '儲存'
export const WORDING_POSTEDITOR_SAVE_DRAFT = '儲存草稿'
export const WORDING_POSTEDITOR_SAVE_PENDING = '提交'
export const WORDING_POSTEDITOR_TAG = '關鍵字詞'
export const WORDING_POSTEDITOR_TITLE = '標題'
export const WORDING_POSTEDITOR_UPLOAD = '上傳'
export const WORDING_POSTEDITOR_VIDEO = '影片'

// Profile editor use
export const WORDING_PROFILEEDIT_NICKNAME = '暱稱'
export const WORDING_PROFILEEDIT_EMAIL = 'Email'
export const WORDING_PROFILEEDIT_DESCRIPTION = '簡介'
export const WORDING_PROFILEEDIT_OLDPASSWORD = '目前密碼'
export const WORDING_PROFILEEDIT_NEWPASSWORD = '新密碼'
export const WORDING_PROFILEEDIT_CONFIRMPASSWORD = '密碼確認'
export const WORDING_PROFILEEDIT_PERSONAL_OPTIONS = '個人設定'
export const WORDING_PROFILEEDIT_SAVE = 'SAVE'
// Control bar
export const WORDING_CONTROLBAR_ACCOUNT = '帳號'
export const WORDING_CONTROLBAR_ACCOUNT_LIST = '帳號列表'
export const WORDING_CONTROLBAR_ADD_ACCOUNT = '新增帳號'
export const WORDING_CONTROLBAR_ADD_DIRECTLY = '直接新增'
export const WORDING_CONTROLBAR_ADD_NEWS = '新增新聞'
export const WORDING_CONTROLBAR_ADD_REVIEW = '新增評論'
export const WORDING_CONTROLBAR_ADD_VIDEO = '新增影片'
export const WORDING_CONTROLBAR_EDIT_DRAFT = '編輯草稿'
export const WORDING_CONTROLBAR_MANAGE = '管理'
export const WORDING_CONTROLBAR_NEWS = '新聞'
export const WORDING_CONTROLBAR_POST = '文章'
export const WORDING_CONTROLBAR_RECORD = '記錄'
export const WORDING_CONTROLBAR_REVIEW = '評論'
export const WORDING_CONTROLBAR_TAG = '關鍵字'
export const WORDING_CONTROLBAR_VIDEO = '影片'

// Tab
export const WORDING_TAB_REWARD_POINTS_RECORD = '點數記錄'
export const WORDING_TAB_FOLLOW_RECORD = '追蹤記錄'
export const WORDING_TAB_REVIEW_RECORD = '評論記錄'
export const WORDING_TAB_NEWS_RECORD = '新聞記錄'

// Tag List
export const WORDING_TAGLIST_ADD = '新增'
export const WORDING_TAGLIST_ADD_PLACEHOLDER = '輸入欲新增之關鍵字詞'
export const WORDING_TAGLIST_CANCEL = '取消'
export const WORDING_TAGLIST_CONFIRM = '確定'
export const WORDING_TAGLIST_DELETE = '刪除'
export const WORDING_TAGLIST_EDIT = '修改'
export const WORDING_TAGLIST_NEWS_COUNT = '相關新聞數'
export const WORDING_TAGLIST_PUBLISH_AT = '發布時間'
export const WORDING_TAGLIST_REVIEW_COUNT = '相關評論數'
export const WORDING_TAGLIST_TAG = '關鍵字詞'
export const WORDING_TAGLIST_UPDATE_AT = '更新時間'

// Following List
export const WORDING_FOLLOW_LIST_FOLLOW = '追蹤'
export const WORDING_FOLLOW_LIST_GUEST_EDITOR = '客座總編'
export const WORDING_FOLLOW_LIST_NEWS = '新聞'
export const WORDING_FOLLOW_LIST_PROJECT = '專題'
export const WORDING_FOLLOW_LIST_REVIEW = '評論'

// Alert Paenl
export const WORDING_ALERTPANEL_ADD_SUCCESSFUL = '已新增'
export const WORDING_ALERTPANEL_AUTHOR = '作者'
export const WORDING_ALERTPANEL_CANCEL = '取消'
export const WORDING_ALERTPANEL_CONFIRM = '確定'
export const WORDING_ALERTPANEL_DELETE_CONFIRMATION = '你確定要刪除嗎'
export const WORDING_ALERTPANEL_DELETE_SUCCESSFUL = '已刪除'
export const WORDING_ALERTPANEL_DRAFT = '草稿'
export const WORDING_ALERTPANEL_PENDING = '待審核'
export const WORDING_ALERTPANEL_POST = '文章'
export const WORDING_ALERTPANEL_PUBLISH_CONFIRMATION = '你確定要發布嗎'
export const WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL = '已發布'
export const WORDING_ALERTPANEL_STATUS = '狀態'
export const WORDING_ALERTPANEL_TAG = '關鍵字'
export const WORDING_ALERTPANEL_TITLE = '標題'
export const WORDING_ALERTPANEL_UPDATE_SUCCESSFUL = '已更新'
export const WORDING_ALERTPANEL_VIDEO = '影片'

// Agreement Use
export const WORDING_AGREEMENT_TERMS_AND_SERVICE = '會員服務條款'
export const WORDING_AGREEMENT_IPR = '著作權、智慧財產權政策'
export const WORDING_AGREEMENT_PRIVACY = '隱私權政策'

// Search Use
export const WORDING_SEARCH_FILTER_TITLE = '篩選搜尋結果'
export const WORDING_SEARCH_FILTER_VIEW = '視角'
export const WORDING_SEARCH_FILTER_CONVERSATION = '對話'
export const WORDING_SEARCH_FILTER_PROJECT = '議題'

// Home Use
export const WORDING_HOME_POST_MORE = '更多'
export const WORDING_HOME_POST_SOURCE = '出處：'

// Profile
export const WORDING_PROFILE_FILTER_ALL = '所有'