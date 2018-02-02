<template>
  <span v-text="commentAmount"></span>
</template>
<script>
  import { SITE_DOMAIN_DEV } from 'src/constants'
  
  const debug = require('debug')('CLIENT:commentCount')
  const getCommentCount = (store, { assetUrl, postId }) => {
    return store.dispatch('FETCH_COMMENT_COUNT', {
      params: {
        assetUrl,
        postId
      }
    })
  }
  export default {
    name: '',
    computed: {},
    methods: {
      seUpfetchCommentCountInterval () {
        return new Promise((resolve) => {
          setInterval(() => {
            getCommentCount(this.$store, {
              assetUrl: `${location.protocol}//${SITE_DOMAIN_DEV}/post/${this.postId}`,
              postId: this.postId
            })
          }, 6000)
          resolve()
        })
      }
    },
    mounted () {
      getCommentCount(this.$store, {
        assetUrl: `${location.protocol}//${SITE_DOMAIN_DEV}/post/${this.postId}`,
        postId: this.postId
      })
      this.seUpfetchCommentCountInterval()
    },
    props: {
      commentAmount: {
        default: () => 0
      },
      postId: {
         default: () => ''
      }   
    },
    watch: {
      commentAmount: function () {
        debug('Comment count for post', this.postId, 'change to', this.commentAmount)
      }
    }
  }
</script>
<style lang="stylus" scoped></style>