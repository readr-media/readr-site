<template>
  <section class="videosHighlight">
    <div class="videosHighlight__video">
      <iframe src="https://app.straas.net/mirrormedia.mg/videos/ubfT6jiU" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="videosHighlight__info">
      <div class="videosHighlight__info-title">
        <h2>影片標題標題</h2>
        <app-share-button class="videosHighlight__share"></app-share-button>
      </div>
      <div class="videosHighlight__info-comment">
        <div class="comment"></div>
      </div>
    </div>
  </section>
</template>

<script>
  import { SITE_DOMAIN_DEV } from '../../../src/constants'
  import { renderComment } from '../../../src/util/talk'
  import AppShareButton from '../../components/AppShareButton.vue'

  export default {
    name: 'VideosHighlight',
    components: {
      AppShareButton
    },
    props: {
      video: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    mounted () {
      renderComment(this.$el, `.comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/199`)
    }
  }
</script>

<style lang="stylus" scoped>
  .videosHighlight
    display flex
    flex-direction column
    width 650px
    background-color #fff
    &__video
      position relative
      width 100%
      padding-top 56.25%
      iframe
        position absolute
        top 0
        left 0
        right 0
        width 100%
        height 100%
    &__info
      display flex
      flex-direction column
      padding 15px 20px
      &-title
        position relative
        height 25px
        padding-right 35px
        h2
          margin 0
          line-height 25px
          font-size 18px
          font-weight 800
      &-comment
        margin-top 20px
    &__share
      position absolute
      top 0
      right 0
    
</style>


