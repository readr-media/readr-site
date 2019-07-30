<template>
  <div
    ref="comment-container"
    class="comment-container"
  >
    <Comment
      v-if="shouldRenderComment"
      :me="me"
      :refresh-sub-comment="refreshSubComment"
      :delete-comment="deleteComment"
      :hide-comment="hideComment"
      :report-comment="reportComment"
      :save-comment="saveComment"
      :update-comment="updateComment"
      :comments="commentsSalted"
      :go-login="goLogin"
    />
    <p
      v-show="showLoadmoreComment"
      class="comment-container__loadmore"
      @click="fetchCommentAll"
      v-text="`${$t('COMMENTS.LOADMORE_PREFIX')} ${commentsCountRemaining} ${$t('COMMENTS.LOADMORE_SUFFIX')}`"
    />
    <p
      v-if="shouldRenderCommentError"
      class="comment-container__alert"
      v-text="fetchCommentErrorText"
    />
  </div>
</template>
<script>
import { Comment } from 'readr-comment'
import { get, map, isEmpty, isNaN } from 'lodash'
import { getFullUrl } from 'src/util/comm'
import { ROLE_MAP } from 'api/config'
import { RESOURCE_TYPE } from 'src/constants'

const DEFAULT_SORT = '-created_at'
const addComment = (store, { params }) => store.dispatch('ADD_COMMENT', { params })
const delComment = (store, { params }) => store.dispatch('DELETE_COMMENT', { params })
const hideComment = (store, { params }) => store.dispatch('HIDE_COMMENT', { params })
const fetchCommentStrict = (store, { params }) => store.dispatch('FETCH_COMMENT', { params: Object.assign({}, { sort: DEFAULT_SORT }, params) })
const fetchCommentPublic = (store, { params }) => store.dispatch('FETCH_COMMENT_PUBLIC', { params: Object.assign({}, { sort: DEFAULT_SORT }, params) })
const reportComment = (store, { params }) => store.dispatch('ADD_COMMENT_REPORT', { params })
const updateComment = (store, { params }) => store.dispatch('UPDATE_COMMENT', { params })
const fetchReportsListBySlugs = (store, slugs = []) => store.dispatch('DataPost/GET_POST_REPORT', { params: { slug: slugs } })
const switchOn = (store, message) => store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: true, message, type: 'GO_LOGIN' })
const debug = require('debug')('CLIENT:CommentContainer')

export default {
  name: 'CommentContainer',
  components: {
    Comment
  },
  props: {
    asset: {
      type: String,
      default: ''
    },
    assetId: {
      type: Number,
      default: 0
    },
    assetRefId: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    isPublicCommentView: {
      type: Boolean,
      default: false
    },
    isNotLightbox: {
      type: Boolean,
      default: false
    },
    commentsLatest: {
      type: Array,
      default () {
        return []
      }
    },
    commentAmount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      comments_raw: [],
      shouldRenderComment: false,
      fetchCommentErrorText: '',
      resourceName: undefined,
      resourceIdByResourceURL: undefined
    }
  },
  computed: {
    commentsSalted () {
      return map(this.comments_raw, c => {
        return Object.assign({}, c, {
          authorImage: getFullUrl(c.authorImage || '/public/icons/exclamation.png'),
          authorPage: `/profile/${c.author}`
        })
      })
    },
    me () {
      return {
        id: get(this.$store, 'state.DataUser.profile.id'),
        nickname: get(this.$store, 'state.DataUser.profile.nickname'),
        profileImage: getFullUrl(get(this.$store, 'state.DataUser.profile.profileImage') || '/public/icons/exclamation.png'),
        role: ROLE_MAP.ADMIN === get(this.$store, 'state.DataUser.profile.role') ? 'admin' : 'member'
      }
    },
    resourceURLParam () {
      return this.getResourceURLParam(this.asset)
    },
    assetIdComputed () {
      return this.resourceName === 'report' ? this.resourceIdByResourceURL : this.assetId
    },
    resource () {
      return {
        name: this.resourceName,
        id: this.assetIdComputed
      }
    },
    shouldRenderCommentError () {
      return this.me.id && !isEmpty(this.fetchCommentErrorText)
    },
    commentsCountRemaining () {
      const commentsCountLatestLevel1 = this.commentsSalted.length
      const commentsCountLatestLevel2 = this.commentsSalted.reduce((acc, curr) => acc + get(curr, 'commentAmount', 0), 0)
      return this.commentAmount - commentsCountLatestLevel1 - commentsCountLatestLevel2
    },
    showLoadmoreComment () {
      return this.commentsCountRemaining > 0
    },
    parentId () {
      return Number(get(this.$route, [ 'query', 'parentid' ]))
    },
    hasParentId () {
      return this.parentId !== undefined && !isNaN(this.parentId)
    },
    showSubComment () {
      return this.hasParentId && !this.isNotLightbox
    }
  },
  watch: {
    comments_raw () {
      debug('Mutation detected: comments_raw')
    },
    asset () {
      debug('Mutation detected: asset', this.asset)
      fetchCommentStrict(this.$store, {
        params: {
          resource: [ this.asset ],
          resource_id: this.assetId
        }
      }).then((comments) => {
        debug('comments', comments)
        this.comments_raw = comments
      })
    },
    resourceName (value) {
      if (value === 'report') {
        const slug = this.resourceURLParam[2]
        fetchReportsListBySlugs(this.$store, [ slug ])
          .then((res) => {
            this.resourceIdByResourceURL = get(res, [ 'res', 'items', '0', 'id' ], '')
          })
      }
    }
  },
  created () {
    this.resourceName = this.getResourceName()
  },
  mounted () {
    if (this.isPublicCommentView || !this.isNotLightbox) {
      this.fetchCommentAll()
        .then(() => {
          if (this.showSubComment) { this.refreshSubComment(this.parentId) }
        })
    } else {
      this.comments_raw = this.commentsLatest
    }
    this.shouldRenderComment = true
  },
  updated () {
    this.$emit('heightChanged')
  },
  methods: {
    goLogin () {
      if (!this.isPublicCommentView) {
        switchOn(this.$store)
      } else {
        window.open('/login-panel', '_blank', 'width=480,height=600')
      }
    },
    queryForRedisUse (comment) {
      return get(comment, 'parentId') ? {
        sort: 'created_at',
        parent: get(comment, 'parentId')
      } : {
        sort: DEFAULT_SORT,
        resource: this.asset
      }
    },
    rerenderComment (comment) {
      const params = get(comment, 'parentId')
        ? { parent: get(comment, 'parentId'), sort: 'created_at' }
        : { resource: [ this.asset ] }
      return new Promise(resolve => {
        setTimeout(() => {
          fetchCommentStrict(this.$store, { params }).then(comments => {
            if (get(comment, 'parentId')) {
              this.comments_raw = map(this.comments_raw, c => {
                if (c.id === get(comment, 'parentId')) {
                  comments && map(comments, subC => {
                    subC.authorImage = getFullUrl(subC.authorImage || '/public/icons/exclamation.png')
                  })
                  c.replies = comments
                }
                return c
              })
            } else {
              this.comments_raw = comments
            }
            resolve()
          })
        }, 1500)
      })
    },
    deleteComment (comment, id) {
      debug('Go to del comment', id)
      delComment(this.$store, {
        params: {
          ids: [ id ],
          /** property "query" is for redis cache use */
          query: this.queryForRedisUse(comment)
        }
      }).then(() => {
        // return this.rerenderComment(comment)
      })
    },
    hideComment (comment, id) {
      debug('Go to hide comment', id)
      hideComment(this.$store, {
        params: {
          ids: [ id ],
          /** property "query" is for redis cache use */
          query: this.queryForRedisUse(comment)
        }
      }).then(() => {
        // return this.rerenderComment(comment)
      })
    },
    reportComment (comment, id) {
      debug('Go to hide comment', id)
      reportComment(this.$store, {
        params: {
          comment_id: id
        }
      })
    },
    saveComment (comment) {
      debug('Saved!', comment)
      debug('this.resourceType', this.resource)
      addComment(this.$store, {
        params: {
          body: get(comment, 'body'),
          resource: this.asset,
          parent_id: get(comment, 'parentId') || null,
          resource_name: this.resource.name,
          resource_id: this.resource.id,
          /** property "query" is for redis cache use */
          query: this.queryForRedisUse(comment)
        }
      }).then(() => {
        // return this.rerenderComment(comment)
      })
    },
    updateComment (comment, id) {
      debug('Updated!', comment, id, get(comment, 'parentId'))
      updateComment(this.$store, {
        params: {
          body: get(comment, 'body'),
          id,
          /** property "query" is for redis cache use */
          query: this.queryForRedisUse(comment)
        }
      }).then(() => {
        // return this.rerenderComment(comment)
      })
    },
    refreshSubComment (id) {
      debug('Go get sub comment!', id)
      const fetchComment = this.isPublic && !this.$store.state.isLoggedin ? fetchCommentPublic : fetchCommentStrict
      fetchComment(this.$store, {
        params: {
          parent: id,
          sort: 'created_at'
        }
      }).then((comments) => {
        this.comments_raw = map(this.comments_raw, c => {
          if (c.id === id) {
            comments && map(comments, subC => {
              subC.authorImage = getFullUrl(subC.authorImage || '/public/icons/exclamation.png')
            })
            c.replies = comments
          }
          return c
        })
        this.$emit('heightChanged')
      })
    },
    setMutationObserver () {
      const observer = new MutationObserver(() => { this.$emit('heightChanged') })
      observer.observe(this.$refs['comment-container'], { attributes: true, childList: true, subtree: true })
    },
    getResourceURLParam (resourceURL) {
      const resourceTypeExp = /(?:http|https)?:?(?:\/\/)?(?:[A-Za-z0-9.\-_]*)?\/([A-Za-z0-9.\-_]*)\/?([A-Za-z0-9.\-_]*)?\/?([A-Za-z0-9.\-_]*)?/
      const testRs = resourceURL.match(resourceTypeExp)
      return testRs
    },
    getResourceName () {
      const route = this.resourceURLParam[1]
      const subId = this.resourceURLParam[3]
      switch (route) {
        case RESOURCE_TYPE.POST:
          return route
        case RESOURCE_TYPE.REPORT:
          return 'report'
        case RESOURCE_TYPE.RPOJECT:
          if (subId) {
            return RESOURCE_TYPE.MEMO
          } else {
            return 'project'
          }
        default:
          return ''
      }
    },
    fetchCommentAll () {
      const fetchComment = this.isPublic && !this.$store.state.isLoggedin ? fetchCommentPublic : fetchCommentStrict
      return fetchComment(this.$store, {
        params: {
          resource: [ this.asset ],
          resource_id: this.assetRefId
        }
      }).then((comments) => {
        debug('comments', comments)
        this.comments_raw = comments
      }).catch(({ res }) => {
        debug('this.me', this.me)
        debug('this.me', this.me)
        debug('this.me', this.me)
        debug('this.me', this.me)
        debug('this.me', this.me)
        this.me.id && (this.fetchCommentErrorText = res.text)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.comment-container
  &__loadmore
    cursor pointer
    color #11b8c9
  &__alert
    margin-top 20px
    color #d4d4d4
</style>
