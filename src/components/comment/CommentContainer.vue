<template>
  <div ref="comment-container">
    <Comment
      v-if="shouldRenderComment"
      :me="me"
      :refreshSubComment="refreshSubComment"
      :deleteComment="deleteComment"
      :hideComment="hideComment"
      :reportComment="reportComment"
      :saveComment="saveComment"
      :updateComment="updateComment"
      :comments="commentsSalted"
    />
    <p v-if="shouldRenderCommentError" v-text="fetchCommentErrorText" class="alert"></p>
  </div>
</template>
<script>
  import { Comment, } from 'readr-comment'
  import { get, map, isEmpty, } from 'lodash'
  import { getImageUrl, } from 'src/util/comm'
  import { ROLE_MAP, } from 'api/config'
  import { RESOURCE_TYPE, } from 'src/constants'

  const DEFAULT_SORT = '-created_at'
  const addComment = (store, { params, }) => store.dispatch('ADD_COMMENT', { params, })
  const delComment = (store, { params, }) => store.dispatch('DELETE_COMMENT', { params, })
  const hideComment = (store, { params, }) => store.dispatch('HIDE_COMMENT', { params, })
  const fetchCommentStrict = (store, { params, }) => store.dispatch('FETCH_COMMENT', { params: Object.assign({}, { sort: DEFAULT_SORT, }, params), })
  const fetchCommentPublic = (store, { params, }) => store.dispatch('FETCH_COMMENT_PUBLIC', { params: Object.assign({}, { sort: DEFAULT_SORT, }, params), })
  const reportComment = (store, { params, }) => store.dispatch('ADD_COMMENT_REPORT', { params, })
  const updateComment = (store, { params, }) => store.dispatch('UPDATE_COMMENT', { params, })
  const fetchReportsListBySlugs = (store, slugs = []) => store.dispatch('GET_PUBLIC_REPORTS', { params: { report_slugs: slugs, }, })
  const debug = require('debug')('CLIENT:CommentContainer')

  export default {
    name: 'CommentContainer',
    components: {
      Comment,
    },
    computed: {
      commentsSalted () {
        return map(this.comments_raw, c => {
          return Object.assign({}, c, {
            authorImage: getImageUrl(c.authorImage || '/public/icons/exclamation.png'),
            authorPage: `/profile/${c.author}`,
          })
        })
      },
      me () {
        return {
          id: get(this.$store, 'state.profile.id'),
          nickname: get(this.$store, 'state.profile.nickname'),
          profileImage: getImageUrl(get(this.$store, 'state.profile.profileImage') || '/public/icons/exclamation.png'),
          role: ROLE_MAP.ADMIN === get(this.$store, 'state.profile.role') ? 'admin' : 'member',
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
          id: this.assetIdComputed,
        }
      },
      shouldRenderCommentError () {
        return !isEmpty(this.fetchCommentErrorText)
      },
    },
    data () {
      return {
        comments_raw: [],
        shouldRenderComment: false,
        fetchCommentErrorText: '',
        resourceName: undefined,
        resourceIdByResourceURL: undefined,
      }
    },    
    methods: {
      queryForRedisUse (comment) {
        return get(comment, 'parentId') ? { 
          sort: 'created_at',
          parent: get(comment, 'parentId'),
        } : { 
          sort: DEFAULT_SORT,
          resource: this.asset,
        }
      },      
      rerenderComment (comment) {
        const params = get(comment, 'parentId')
          ? { parent: get(comment, 'parentId'), sort: 'created_at', }
          : { resource: [ this.asset, ], }
        return new Promise(resolve => {
          setTimeout(() => {
            fetchCommentStrict(this.$store, { params, }).then(comments => {
              if (get(comment, 'parentId')) {
                this.comments_raw = map(this.comments_raw, c => {
                  if (c.id === get(comment, 'parentId')) {
                    comments && map(comments, sub_c => {
                      sub_c.authorImage = getImageUrl(sub_c.authorImage || '/public/icons/exclamation.png')
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
            ids: [ id, ],
            /** property "query" is for redis cache use */
            query: this.queryForRedisUse(comment),
          },
        }).then(() => {
          return this.rerenderComment(comment)
        })
      },
      hideComment (comment, id) {
        debug('Go to hide comment', id)
        hideComment(this.$store, {
          params: { 
            ids: [ id, ],
            /** property "query" is for redis cache use */
            query: this.queryForRedisUse(comment),
          },
        }).then(() => {
          return this.rerenderComment(comment)
        })
      },   
      reportComment (comment, id) {
        debug('Go to hide comment', id)
        reportComment(this.$store, {
          params: { 
            comment_id: id,
          },
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
            query: this.queryForRedisUse(comment),        
          },
        }).then(() => {
          return this.rerenderComment(comment)
        })
      },
      updateComment (comment, id) {
        debug('Updated!', comment, id, get(comment, 'parentId'))
        updateComment(this.$store, {
          params: {
            body: get(comment, 'body'),
            id,
            /** property "query" is for redis cache use */
            query: this.queryForRedisUse(comment),
          },
        }).then(() => {
          return this.rerenderComment(comment)
        })
      },
      refreshSubComment (id) {
        debug('Go get sub comment!', id)
        const fetchComment = this.isPublic && !this.$store.state.isLoggedin ? fetchCommentPublic : fetchCommentStrict
        fetchComment(this.$store, {
          params: {
            parent: id,
            sort: 'created_at',
          },
        }).then((comments) => {
          this.comments_raw = map(this.comments_raw, c => {
            if (c.id === id) {
              comments && map(comments, sub_c => {
                sub_c.authorImage = getImageUrl(sub_c.authorImage || '/public/icons/exclamation.png')
              })
              c.replies = comments
            }
            return c
          })
          this.$emit('heightChanged')
        })
      },
      setMutationObserver() {
        const observer = new MutationObserver(() => { this.$emit('heightChanged') })
        observer.observe(this.$refs['comment-container'], { attributes: true, childList: true, subtree: true, });
      },
      getResourceURLParam (resourceURL) {
        const resource_type_exp = /(?:http|https)?:?(?:\/\/)?(?:[A-Za-z0-9.\-_]*)?\/([A-Za-z0-9.\-_]*)\/?([A-Za-z0-9.\-_]*)?\/?([A-Za-z0-9.\-_]*)?/
        const test_rs = resourceURL.match(resource_type_exp)
        return test_rs
      },
      getResourceName () {
        const route = this.resourceURLParam[1]
        const sub_id = this.resourceURLParam[3]
        switch (route) {
          case RESOURCE_TYPE.POST:
            return route
          case RESOURCE_TYPE.REPORT:
            return 'report'
          case RESOURCE_TYPE.RPOJECT:
            if (sub_id) {
              return RESOURCE_TYPE.MEMO
            } else {
              return 'project'
            }
          default:
            return ''
        }
      },
    },
    created () {
      this.resourceName = this.getResourceName()
    },
    mounted () {
      const fetchComment = this.isPublic && !this.$store.state.isLoggedin ? fetchCommentPublic : fetchCommentStrict
      fetchComment(this.$store, {
        params: {
          resource: [ this.asset, ],
          resource_id: this.assetRefId,
        },
      }).then((comments) => {
        debug('comments', comments)
        this.comments_raw = comments
        this.shouldRenderComment = true
      }).catch(({ res, }) => {
        this.fetchCommentErrorText = res.text
      })

      this.setMutationObserver()
    },
    updated () {
      this.$emit('heightChanged')
    },
    props: {
      asset: {
        type: String,
        default: '',
      },
      assetId: {
        type: Number,
      },
      assetRefId: {
        type: Number,
      },
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      comments_raw () {
        debug('Mutation detected: comments_raw')
      },
      asset () {
        debug('Mutation detected: asset', this.asset)
        fetchCommentStrict(this.$store, {
          params: {
            resource: [ this.asset, ],
            resource_id: this.assetId,
          },
        }).then((comments) => {
          debug('comments', comments)
          this.comments_raw = comments
        })        
      },
      resourceName (value) {
        if (value === 'report') {
          const slug = this.resourceURLParam[2]
          fetchReportsListBySlugs(this.$store, [ slug, ],)
          .then((res) => {
            this.resourceIdByResourceURL = get(res, [ 'res', 'items', '0', 'id', ], '')
          })
        }
      },
    },    
  }
</script>
<style lang="stylus" scoped>
    .alert
      margin-top 20px
      color #d4d4d4
</style>
