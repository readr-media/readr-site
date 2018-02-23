import projectList from './projectList'
export const PROJECTS = projectList

export const SITE_DOMAIN = 'readr.com'
export const SITE_DOMAIN_DEV = 'dev.readr.tw'

export const ROLE_MAP = [
  { key: 9, value: '管理員', route: 'admin' },
  { key: 3, value: '編輯', route: 'editor' },
  { key: 2, value: '總編', route: 'guesteditor' },
  { key: 1, value: '會員', route: 'member' }
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
  'projects': '議題'
}

// Image upload max size 30 MB
export const IMAGE_UPLOAD_MAX_SIZE = 31457280

export const CUSTOM_EDITOR_LIMIT = 3

// Login and Rigester Page Use
export const WORDING_EMAIL = '信箱'
export const WORDING_FORGET_PASSWORD = '忘記密碼？'
export const WORDING_KEEP_ALIVE = '保持登入'
export const WORDING_LOGIN = '登入'
export const WORDING_LOGIN_COMMUNITY = '社群登入'
export const WORDING_LOGIN_INFAIL_VALIDATION_ISSUE = '請提供正確帳號密碼。'
export const WORDING_LOGIN_INVALID_EMAIL_FORMAT = '請輸入有效的電子信箱（Email）'
export const WORDING_LOGIN_UNAUTHORIZED = '此帳號尚未啟用或被拒絕登入。'
export const WORDING_LOGIN_PLEASE_ENTER_YOUR_REGISTERED_EMAIL = '請輸入註冊之電子信箱後點擊「重設密碼」'
export const WORDING_LOGIN_RESET_PWD = '重設密碼'
export const WORDING_LOGIN_RESET_PWD_SUCCESSFULLY = '請至您註冊的 Email 信箱點擊連結以重設密碼。'
export const WORDING_LOGIN_RESET_PWD_INFAIL = '重設密碼失敗，請聯絡我們。'
export const WORDING_LOGIN_RESET_PWD_COMPLETE = '重設密碼成功，請重新登入。'
export const WORDING_MEMBER_AGREEMENT = '會員服務協議'
export const WORDING_NICKNAME = '暱稱'
export const WORDING_PASSWORD = '密碼'
export const WORDING_PASSWORD_CHECK = '確認密碼'
export const WORDING_REGISTER = '註冊'
export const WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL = '請輸入有效的電子信箱（Email）'
export const WORDING_REGISTER_NICKNAME_EMPTY = '請輸入暱稱'
export const WORDING_REGISTER_NOTICE = '註冊會員等同您同意我們的'
export const WORDING_REGISTER_SUCESSFUL = '請至您註冊的 Email 信箱點擊啟用連結'
export const WORDING_REGISTER_INFAIL = '註冊過程發生問題，請聯絡我們'
export const WORDING_REGISTER_INFAIL_DUPLICATED = '該電子信箱（Email）已被使用，請改用其他電子信箱。'
export const WORDING_REGISTER_PWD_EMPTY = '請輸入密碼'
export const WORDING_REGISTER_PWD_CHECK_EMPTY = '請再次輸入密碼'
export const WORDING_REGISTER_PWD_CHECK_INFAIL = '「密碼」與「確認密碼」不同，請輸入相同之密碼'
export const WORDING_FACEBOOK_LOGIN = '使用 Facebook 帳號登入'
export const WORDING_FACEBOOK_REGISTER = '使用 Facebook 帳號註冊'
export const WORDING_GOOGLE_LOGIN = '使用 Google 帳號登入'
export const WORDING_GOOGLE_REGISTER = '使用 Google 帳號註冊'
export const WORDING_BTN_SAVE = '儲存'
export const WORDING_CREATE_PWD = '新增密碼'
// Header Use
export const WORDING_HEADER_LOGIN = '登入'
export const WORDING_HEADER_LOGOUT = '登出'
export const WORIDNG_HEADER_MEMBER_CENTRE = '會員中心'
export const WORIDNG_HEADER_MEMBER_SEARCH = '搜尋'
// Admin use
export const WORDING_ADMIN_ACCOUNT = '帳號'
export const WORDING_ADMIN_EMAIL = '信箱'
export const WORDING_ADMIN_ROLE = '身份'
export const WORDING_ADMIN_NICKNAME = '暱稱'
export const WORDING_ADMIN_UPDATE = '修改'
export const WORDING_ADMIN_DELETE = '刪除'
export const WORDING_ADMIN_GUESTEDITOR = '當週總編'
export const WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER = '新增會員'
export const WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER = '修改會員'
export const WORDING_ADMIN_MEMBER_EDITOR_EMAIL = 'Email'
export const WORDING_ADMIN_MEMBER_EDITOR_NICKNAME = '暱稱'
export const WORDING_ADMIN_MEMBER_EDITOR_SAVE = 'SAVE'
export const WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION = '你確定要刪除會員嗎？'
export const WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL = '會員已刪除'
export const WORDING_ADMIN_MEMBER_EDITOR_SET_CONFIRMATION_CUSTOMEDITOR = '您確定要設當週總編嗎？'
export const WORDING_ADMIN_MEMBER_EDITOR_SET_SUCCESSFUL_CUSTOMEDITOR = '會員已成為當週總編'
export const WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION_CUSTOMEDITOR = '您確定要取消當週總編嗎？'
export const WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL_CUSTOMEDITOR = '會員已不再為當週總編'
export const WORDING_ADMIN_SUCCESS = '成功'
export const WORDING_ADMIN_INFAIL = '發生錯誤'
export const WORDING_ADMIN_YES = '確定'
export const WORDING_ADMIN_CANCEL = '取消'
export const WORDING_ADMIN_EXCEED_ERROR_CUSTOMEDITOR = '超過可設定人數，請重新選擇。'
export const WORDING_ADMIN_SET_ERROR_CUSTOMEDITOR = '無法設定，請重新選擇。'

// Post list
export const WORDING_POSTLIST_NICKNAME = '暱稱'
export const WORDING_POSTLIST_TITLE = '標題'
export const WORDING_POSTLIST_ACTIVE = '狀態'
export const WORDING_POSTLIST_PUBLISH = '發布'
export const WORDING_POSTLIST_DELETE = '刪除'
export const WORDING_POSTLIST_UPDATE_AT = '更新時間'
export const WORDING_POSTLIST_PUBLISH_AT = '發布時間'
export const WORDING_POSTLIST_UPDATE = '修改'
export const WORDING_POSTLIST_EDIT = '編輯'
export const WORDING_POSTLIST_ACTIVE_PUBLISH = '已發布'
export const WORDING_POSTLIST_ACTIVE_PENDING = '待審核'
export const WORDING_POSTLIST_ACTIVE_UNPUBLISH = '已下架'
export const WORDING_POSTLIST_ACTIVE_DRAFT = '草稿'
export const WORDING_POSTLIST_DRAFT_RECORD = '未提交評論記錄'

// Post editor
export const WORDING_POSTEDITOR_DELETE = '刪除'
export const WORDING_POSTEDITOR_EDITOR = '編輯器'
export const WORDING_POSTEDITOR_INPUT_TITLE = '輸入標題'
export const WORDING_POSTEDITOR_LINK = '新聞連結'
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
export const WORDING_POSTEDITOR_UPLOAD = '上傳'

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
export const WORDING_CONTROLBAR_EDIT_DRAFT = '編輯草稿'
export const WORDING_CONTROLBAR_MANAGE = '管理'
export const WORDING_CONTROLBAR_NEWS = '新聞'
export const WORDING_CONTROLBAR_POST = '文章'
export const WORDING_CONTROLBAR_RECORD = '記錄'
export const WORDING_CONTROLBAR_REVIEW = '評論'
export const WORDING_CONTROLBAR_TAG = '關鍵字'
export const WORDING_CONTROLBAR_VIDEO = '影片'

// Tab
export const WORDING_TAB_COMMENT_RECORD = '留言記錄'
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

// Alert Paenl
export const WORDING_ALERTPANEL_ADD_SUCCESSFUL = '已新增'
export const WORDING_ALERTPANEL_AUTHOR = '作者'
export const WORDING_ALERTPANEL_CANCEL = '取消'
export const WORDING_ALERTPANEL_CONFIRM = '確定'
export const WORDING_ALERTPANEL_DELETE_CONFIRMATION = '你確定要刪除嗎'
export const WORDING_ALERTPANEL_DELETE_SUCCESSFUL = '已刪除'
export const WORDING_ALERTPANEL_DRAFT = '草稿'
export const WORDING_ALERTPANEL_POST = '文章'
export const WORDING_ALERTPANEL_PUBLISH_CONFIRMATION = '你確定要發布嗎'
export const WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL = '已發布'
export const WORDING_ALERTPANEL_STATUS = '狀態'
export const WORDING_ALERTPANEL_TAG = '關鍵字'
export const WORDING_ALERTPANEL_TITLE = '標題'
export const WORDING_ALERTPANEL_UPDATE_SUCCESSFUL = '已更新'

// Agreement Use
export const WORDING_AGREEMENT_TERMS_AND_SERVICE = '會員服務條款'
export const WORDING_AGREEMENT_IPR = '著作權、智慧財產權政策'
export const WORDING_AGREEMENT_PRIVACY = '隱私權政策'

// Search Use
export const WORDING_SEARCH_FILTER_TITLE = '篩選搜尋結果'
export const WORDING_SEARCH_FILTER_VIEW = '視角'
export const WORDING_SEARCH_FILTER_CONVERSATION = '對話'
export const WORDING_SEARCH_FILTER_PROJECT = '議題'