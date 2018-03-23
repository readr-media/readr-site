<template>
  <section class="videosHighlight">
    <div class="videosHighlight__video">
      <iframe :src="link" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="videosHighlight__info">
      <div class="videosHighlight__info-title">
        <h3 v-text="moment(video.publishedAt).format('YYYY/MM/DD')"></h3>
        <h2 v-text="video.title"></h2>
        <app-share-button class="videosHighlight__share"></app-share-button>
      </div>
      <div class="videosHighlight__info-comment">
        <div class="comment"></div>
      </div>
    </div>
  </section>
</template>

<script>
  import { SITE_DOMAIN_DEV, } from '../../../src/constants'
  import { get, } from 'lodash'
  import { renderComment, } from '../../../src/util/talk'
  import AppShareButton from '../../components/AppShareButton.vue'
  import moment from 'moment'

  export default {
    name: 'VideosHighlight',
    components: {
      AppShareButton,
    },
    props: {
      video: {
        type: Object,
        required: true,
      },
    },
    computed: {
      link () {
        if (this.video.link) {
          return this.video.link.split(';')[0]
        }
        return 
      },
    },
    watch: {
      video () {
        if (window.Coral) {
          renderComment(this.$el, `.comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${get(this.video, [ 'id', ])}`)
        }
      },
    },
    mounted () {
      if (window.Coral) {
        renderComment(this.$el, `.comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${get(this.video, [ 'id', ])}`)
      }
    },
    methods: {
      moment,
    },
  }
</script>

<style lang="stylus" scoped>
  .videosHighlight
    display flex
    flex-direction column
    width 650px
    background-color #fff
    overflow-x hidden
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
        h3
          margin 0
          font-size 14px
          font-weight 300
      &-comment
        margin-top 20px
    &__share
      position absolute
      top 0
      right 0
    
</style>


