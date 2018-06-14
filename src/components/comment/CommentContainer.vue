<template>
  <Comment
    :me="me"
    :refreshSubComment="refreshSubComment"
    :deleteComment="deleteComment"
    :hideComment="hideComment"
    :reportComment="reportComment"
    :saveComment="saveComment"
    :updateComment="updateComment"
    :comments="commentsSalted"></Comment>
</template>
<script>
  import { Comment, } from 'readr-comment'
  import { get, map, } from 'lodash'
  import { getImageUrl, } from 'src/util/comm'
  import { ROLE_MAP, } from 'api/config'
  import { RESOURCE_TYPE, } from 'src/constants'

  const DEFAULT_SORT = '-created_at'
  const addComment = (store, { params, }) => store.dispatch('ADD_COMMENT', { params, })
  const delComment = (store, { params, }) => store.dispatch('DELETE_COMMENT', { params, })
  const hideComment = (store, { params, }) => store.dispatch('HIDE_COMMENT', { params, })
  const fetchComment = (store, { params, }) => store.dispatch('FETCH_COMMENT', { params: Object.assign({}, { sort: DEFAULT_SORT, }, params), })
  const reportComment = (store, { params, }) => store.dispatch('ADD_COMMENT_REPORT', { params, })
  const updateComment = (store, { params, }) => store.dispatch('UPDATE_COMMENT', { params, })
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
      resource () {
        const resource_type_exp = /(?:http|https)?:?(?:\/\/)?(?:[A-Za-z0-9.\-_]*)?\/([A-Za-z0-9.\-_]*)\/?([A-Za-z0-9.\-_]*)?\/?([A-Za-z0-9.\-_]*)?/
        const test_rs = this.asset.match(resource_type_exp)
        const route = test_rs[ 1 ]
        // const id = test_rs[ 2 ]
        const sub_id = test_rs[ 3 ]
        switch (route) {
          case RESOURCE_TYPE.POST:
            return { name: route, id: this.assetId, }
          case RESOURCE_TYPE.REPORT:
            return  { name: 'report', id: this.assetId, }
          case RESOURCE_TYPE.RPOJECT:
            if (sub_id) {
              return { name: RESOURCE_TYPE.MEMO, id: this.assetId, }
            } else {
              return { name: 'project', id: this.assetId, }
            }
          default:
            return {}
        }
      },
    },
    data () {
      return {
        comments_raw: [],
      }
    },    
    methods: {
      rerenderComment (comment) {
        const params = get(comment, 'parentId')
          ? { parent: get(comment, 'parentId'), sort: 'created_at', }
          : { resource: this.asset, }
        return new Promise(resolve => {
          setTimeout(() => {
            fetchComment(this.$store, { params, }).then(comments => {
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
          },
        }).then(() => {
          return this.rerenderComment(comment)
        })
      },
      refreshSubComment (id) {
        debug('Go get sub comment!', id)
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
        })
      },      
    },
    mounted () {
      fetchComment(this.$store, {
        params: {
          resource: this.asset,
        },
      }).then((comments) => {
        debug('comments', comments)
        this.comments_raw = comments
      })      
    },
    props: {
      asset: {
        type: String,
        default: '',
      },
      assetId: {
        type: Number,
        required: true,
      },
    },
    watch: {
      comments_raw () {
        debug('Mutation detected: comments_raw')
      },
      asset () {
        debug('Mutation detected: asset', this.asset)
        fetchComment(this.$store, {
          params: {
            resource: this.asset,
          },
        }).then((comments) => {
          debug('comments', comments)
          this.comments_raw = comments
        })        
      },
    },    
  }
</script>
