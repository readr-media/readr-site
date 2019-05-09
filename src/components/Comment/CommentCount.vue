<template>
  <span v-text="commentAmount" />
</template>
<script>
  // import { SITE_DOMAIN, SITE_DOMAIN_DEV, } from 'src/constants'
  // import { currEnv, } from 'src/util/comm'
  import { get, } from 'lodash'
  
  const debug = require('debug')('CLIENT:commentCount')
  const getCommentCount = (store, { assetUrl, postId, type, }) => {
    return store.dispatch('FETCH_COMMENT_COUNT', {
      params: {
        assetUrl,
        postId,
      },
      type,
    })
  }
  export default {
    name: 'CommentCount',
    props: {
      commentAmount: {
        default: () => 0,
      },
      postId: {
         default: () => '',
      },
      type: {
        default: () => 'publicPosts',
      },
    },
    computed: {},
    watch: {
      commentAmount: function () {
        debug('Comment count for post', this.postId, 'change to', this.commentAmount)
      },
    },
    mounted () {
      if (this.postId) {
        // getCommentCount(this.$store, {
        //   assetUrl: `${get(this.$store, 'state.setting.HOST')}/post/${this.postId}`,
        //   postId: this.postId,
        //   type: this.type,
        // })
        // this.seUpfetchCommentCountInterval()
      }
    },
    methods: {
      seUpfetchCommentCountInterval () {
        return new Promise((resolve) => {
          setInterval(() => {
            getCommentCount(this.$store, {
              assetUrl: `${get(this.$store, 'state.setting.HOST')}/post/${this.postId}`,
              postId: this.postId,
              type: this.type,
            })
          }, 60000 * 2)
          resolve()
        })
      },
    },
  }
</script>
<style lang="stylus" scoped></style>