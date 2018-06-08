const SCOPES = [
  { comp: 'addAccount', perm: [ 'CreateAccount', 'AddRole', ], role: [ 9, ], },
  { comp: 'addPost', perm: [ 'CreatePost', ], },
  { comp: 'deleteAccount', perm: [ 'DeleteRole', ], role: [ 9, ], },
  { comp: 'deletePost', perm: [ 'DeletePost', ], },
  { comp: 'editOtherPost', perm: [ 'EditOtherPost', ], },
  { comp: 'editPost', perm: [ 'EditPost', ], },
  { comp: 'editPostOg', role: [ 9, 3, ], },
  { comp: 'editVideo', perm: [ 'EditVideo', ], },
  { comp: 'manageComment', perm: [ 'DeleteOtherComment', ], },
  { comp: 'memberManage', role: [ 9, ], },
  { comp: 'publishPost', perm: [ 'PublishPost', ], },
  { comp: 'updateAccount', perm: [ 'EditRole', 'AddRole', 'DeleteRole', ], role: [ 9, ], },
]
const ENDPOINT_SECURE = {
  'DELETE/post': { perm: [ 'DeleteOtherPost', ], },
  'DELETE/posts': { perm: [ 'DeleteOtherPost', ], },
  'DELETE/post-self': { perm: [ 'DeletePost', ], },
  'DELETE/comment': { role: [ 1, 2, 3, 9, ], },
  'GET/following': { perm: [ 'FollowEditor', 'FollowPost', 'FollowProject', ], },
  'GET/members': { perm: [ 'CreateAccount', 'AddRole', ], },
  'GET/member': { role: [ 1, 2, 3, 9, ], },
  'GET/comment': { role: [ 1, 2, 3, 9, ], },
  'GET/post': { perm: [ 'CreatePost', ], },
  'GET/posts': { perm: [ 'CreatePost', ], },
  'POST/meta': { perm: [ 'CreatePost', ], },
  'POST/post': { perm: [ 'CreatePost', ], },
  'POST/image-post': { perm: [ 'CreatePost', ], },
  'POST/comment': { role: [ 1, 2, 3, 9, ], },
  'PUT/member/role': { perm: [ 'AddRole', 'EditRole', ], },
  'PUT/post': { perm: [ 'EditPost', ], },
  'PUT/posts': { perm: [ 'EditOtherPost', ], },
  'PUT/comment': { role: [ 1, 2, 3, 9, ], },
}

module.exports = {
  API_PROTOCOL: 'http',
  API_HOST: '35.194.204.25',
  API_PORT: '8080',
  API_TIMEOUT: 5000,
  DISPOSABLE_TOKEN_WHITE_LIST: [ 'register', 'login', ],
  DOMAIN: 'localhost',
  ENDPOINT_SECURE,
  // EMAIL_BCC: [ 'keithchiang@mirrormedia.mg', ],
  GCP_FILE_BUCKET: 'readr-files',
  GCP_KEYFILE: './gcskeyfile.json',
  GCP_PROJECT_ID: 'mirrormedia-1470651750304',
  GCP_PUBSUB_TOPIC_NAME: 'readr-restful-queue.dev',
  GCS_IMG_MEMBER_PATH: '/assets/images/members',
  GCS_IMG_POST_PATH: '/assets/images/posts',
  GCP_STACKDRIVER_LOG_NAME: 'readr-site-chiangkeith',
  GOOGLE_API_KEY: 'AIzaSyCgwPtUjWMKGKdp62Hnank6TTl3lhXwa3o',
  GOOGLE_CLIENT_ID: '983956931553-bntjsa3c6mk6vkkscau31e6rdv1kjrvo.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'WM1TMDLcFkgS5vOPblHr4Xi5',
  GOOGLE_RECAPTCHA_SITE_KEY: '6Ldh4j0UAAAAALa9WsX5Gy2HY54AVo_5raovZXzJ',
  GOOGLE_RECAPTCHA_SECRET: '6Ldh4j0UAAAAAE4-vvyG8pMax1mPyLl_Z8rWlaa1',
  /**
   * JWT SETTING SHOULD BE THE SAME AS TALK SERVER
   */
  JWT_SECRET: 'ZgbRu7SP',
  JWT_SECRETS: null,
  JWT_COOKIE_NAME: 'csrf',
  JWT_SIGNING_COOKIE_NAME: 'csrf',
  JWT_COOKIE_NAMES: null,
  JWT_CLEAR_COOKIE_LOGOUT: true,
  JWT_DISABLE_AUDIENCE: false,
  JWT_AUDIENCE: 'readr',
  JWT_DISABLE_ISSUER: false,
  JWT_USER_ID_CLAIM: 'sub',
  JWT_ISSUER: 'http://127.0.0.1',
  JWT_EXPIRY: '1 day',
  JWT_ALG: 'HS256',
  TALK_DB: 'mongodb://localhost:27017',
  // TALK_DB: 'mongodb://mongo-0.mongo:27017/talk',
  // TALK_SERVER: 'http://35.201.135.30:5000/',
  TALK_SERVER: 'http://localhost:3000',
  // TALK_SERVER_ROOT: '/talk',
  // TALK_SERVER_PROXY: '/proxy/talk',
  // TALK_SERVER: 'http://localhost:8080/talk',
  // TALK_SERVER: 'http://localhost:8080/proxy/talk',
  TALK_SERVER_PROTOCOL: 'http:',
  TALK_SERVER_HOST: 'localhost',
  TALK_SERVER_PORT: 3000,

  IMAGE_UPLOAD_QUALITY_JPEG: 80,
  IMAGE_UPLOAD_QUALITY_PNG: 8,
  MEMO_PUBLISH_STATUS: {
    UNPUBLISHED: 0,
    DRAFT: 1,
    PUBLISHED: 2,
    SCHEDULING: 3,
  },  
  PAGE_CACHE_EXCLUDING: [ '/admin', '/guesteditor', '/login', '/initmember', '/editor', ],
  POINT_OBJECT_TYPE: {
    PROJECT: 1,
    PROJECT_MEMO: 2
  },
  POST_PUBLISH_STATUS: {
    DELETED: -1,
    UNPUBLISHED: 0,
    DRAFT: 1,
    PUBLISHED: 2,
    SCHEDULING: 3,
    PENDING: 4
  },
  POST_TYPE: {
    REVIEW: 0,
    NEWS: 1,
    VIDEO: 2,
  },
  PROJECT_STATUS: {
    CANDIDATE: 0,
    WIP: 1,
    DONE: 2,
  },
  PROJECT_PUBLISH_STATUS: {
    UNPUBLISHED: 0,
    DRAFT: 1,
    PUBLISHED: 2,
    SCHEDULING: 3,
  },
  REDIS_CONNECTION_TIMEOUT: 2000,
  REDIS_HOST: '35.201.232.204',
  REDIS_PORT: '6379',
  REDIS_AUTH: 'ZgbRu7SP',
  REDIS_MAX_CLIENT: 10000,
  REDIS_READ_HOST: '35.201.232.204',
  REDIS_READ_PORT: '6379',
  REDIS_WRITE_HOST: '35.201.232.204',
  REDIS_WRITE_PORT: '6379',
  REDIS_TIMEOUT: 30,
  REPORT_PUBLISH_STATUS: {
    UNPUBLISHED: 0,
    DRAFT: 1,
    PUBLISHED: 2,
    SCHEDULING: 3,
  },  
  ROLE_MAP: {
    MEMBER: 1,
    GUESTEDITOR: 2,
    EDITOR: 3,
    ADMIN: 9,
  },
  SCOPES,
  SEARCH_PROTOCOL: 'https',
  SEARCH_HOST: 'gu2w2ijrkh-dsn.algolia.net',
  SEARCH_ENDPOINT: '/1/indexes/readr-test',
  SEARCH_API_KEY: '349d0183de6dd690a2506b83f72b3087',
  SEARCH_API_APPID: 'GU2W2IJRKH',
  SEARCH_API_TIMEOUT: 2000,
  SECRET_KEY: 'ZgbRu7SP',
  SERVER_PROTOCOL: 'http',
  SERVER_HOST: 'dev.readr.tw',
  // SERVER_PORT: 8080,
  SERVER_PROTOCOL_MOBILE: 'http',
  SERVER_HOST_MOBILE: 'm-dev.readr.tw',
  // SERVER_PORT_MOBILE: 8080,
  TAG_ACTIVE: {
    DEACTIVE: 0,
    ACTIVE: 1,
  },
}