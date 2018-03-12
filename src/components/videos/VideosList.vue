<template>
  <section class="videosList">
    <template v-for="video in videos" >
      <div :key="get(video, [ 'id' ])" class="videosList__item">
        <div class="videosList__item-img"></div>
        <h2 v-text="get(video, [ 'title' ])"></h2>
        <div class="videosList__item-info">
          <div
            class="videosList__item-info-icon comment"
            @click="$_videosList_renderComment(get(video, [ 'id' ]))">
            <img src="/public/icons/comment-blue.png">
            <comment-count class="videosList__item-info-icon-count" :commentAmount="12345"></comment-count>
          </div>
          <div class="videosList__item-info-icon">
            <img src="/public/icons/view-blue.png">
            <span class="videosList__item-info-icon-count">709</span>
          </div>
        </div>
        <div :class="`videosList__item-comment hidden video-${get(video, [ 'id' ])}`">
          <div class="comment"></div>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
  import { SITE_DOMAIN_DEV } from '../../../src/constants'
  import { get } from 'lodash'
  import { renderComment } from '../../../src/util/talk'
  import CommentCount from '../../components/comment/CommentCount.vue'

  export default {
    name: 'VideosList',
    components: {
      CommentCount
    },
    props: {
      videos: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      $_videosList_renderComment (id) {
        document.querySelector(`.videosList__item-comment.video-${id}`).classList.toggle('hidden')
        const rendered = document.querySelector(`.videosList__item-comment.video-${id} iframe`)
        if (!rendered) {
          renderComment(this.$el, `.videosList__item-comment.video-${id} > .comment`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${id}`)
        }
      },
      get
    }
  }
</script>

<style lang="stylus" scoped>
  .videosList
    width 355px
    padding 15px
    background-color #fff
    &__item
      width 100%
      margin-bottom 10px
      h2
        margin 5px 0
        font-size 15px
        font-weight normal
      &:last-of-type
        margin-bottom 0
      &-img
        width 325px
        height 183px
        background-image url('https://projects.mirrormedia.mg/proj-assets/farmhouse/images/og.jpg')
        background-size cover
        background-position center
        background-repeat no-repeat
      &-info
        &-icon
          display inline-block
          width auto
          height 25px
          white-space nowrap
          &:not(:first-of-type)
            margin-left 10px
          &.comment
            cursor pointer
          &-count
            position relative
            top 2px
            left -3px
            color #11b8c9
            font-size 14px
            line-height 1
        img
          width 25px
          height 25px
      &-comment
        &.hidden
          display none
</style>


