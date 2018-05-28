<template>
  <section class="videosList">
    <template v-for="video in videos" >
      <div :key="get(video, [ 'videoId' ])" class="videosList__item">
        <div class="videosList__item-img" @click="$_videosList_play(get(video, [ 'id' ]))"></div>
        <h3 v-text="moment(video.publishedAt).format('YYYY/MM/DD')"></h3>
        <h2 v-text="get(video, [ 'title' ])"></h2>
        <div class="videosList__item-info">
          <div
            class="videosList__item-info-icon comment"
            @click="$_videosList_renderComment(get(video, [ 'id' ]))">
            <img src="/public/icons/comment-blue.png">
            <comment-count class="videosList__item-info-icon-count" :commentAmount="( get(video, [ 'commentAmount' ]) || 0 )"></comment-count>
          </div>
          <div class="videosList__item-info-icon">
            <img src="/public/icons/view-blue.png">
            <span class="videosList__item-info-icon-count">{{ get(video, [ 'videoViews' ]) || 0 }}</span>
          </div>
        </div>
        <CommentContainer :class="`videosList__item-comment hidden video-${get(video, [ 'id' ])}`" v-if="showComment" :asset="asset(get(video, [ 'id' ]))"></CommentContainer>
      </div>
    </template>
    <button v-if="hasMore" class="videosList__btn" @click="$_videosList_loadMore">More</button>
  </section>
</template>

<script>
  import { get, } from 'lodash'
  import CommentCount from 'src/components/comment/CommentCount.vue'
  import CommentContainer from 'src/components/comment/CommentContainer.vue'
  import moment from 'moment'

  export default {
    name: 'VideosList',
    components: {
      CommentCount,
      CommentContainer,
    },
    data () {
      return {
        showComment: false,
      }
    },
    props: {
      hasMore: {
        type: Boolean,
        required: true,
      },
      videos: {
        type: Array,
        default: function () {
          return []
        },
      },
    },
    methods: {
      $_videosList_asset (id) {
        return `${get(this.$store, 'state.setting.HOST')}/post/${id}`
      },      
      $_videosList_loadMore () {
        this.$emit('loadMore')
      },
      $_videosList_play (id) {
        this.$emit('play', id)
      },
      $_videosList_renderComment (id) {
        document.querySelector(`.videosList__item-comment.video-${id}`).classList.toggle('hidden')
        !this.showComment && (this.showComment = true)
      },
      get,
      moment,
    },
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
      h3
        margin 5px 0
        font-size 14px
        font-weight 300
      &:last-of-type
        margin-bottom 0
      &-img
        width 325px
        height 183px
        background-color #d3d3d3
        background-size cover
        background-position center
        background-repeat no-repeat
        cursor pointer
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
    &__btn
      width 100%
      height 30px
      margin-top 20px
      background-color #d3d3d3
      border none


</style>


