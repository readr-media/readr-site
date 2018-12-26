<template>
  <div class="content content--normal">
    <h1 class="content__title" v-text="post.title"></h1>
    <div class="content__post-content post-content">
      <!-- use div to prevent block elements in <p> SSR issue -->
      <div
        v-for="(p, i) in postContent"
        :key="i"
        :class="[
          'post-content__paragraph',
          { 'post-content__paragraph--youtube': isElementContentYoutube(p) },
          { 'post-content__paragraph--iframe': isElementContentIframe(p) }
        ]"
        v-html="p"
      >
      </div>
      <span
        v-show="showReadMore"
        class="post-content__read-more read-more"
        @click="shouldShowReadMoreButton = false"
      >
        ......<span class="read-more__text" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
      </span>
    </div>
    <PostContentNormalSource
      class="content__source"
      :post="post"
    />
  </div>
</template>

<script>
import { get, } from 'lodash'
import {
  isElementContentIframe,
  isElementContentYoutube,
} from 'src/util/comm'
import PostContentNormalSource from './PostContentNormalSource.vue'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    PostContentNormalSource,
  },
  data () {
    return {
      shouldShowReadMoreButton: true,
    }
  },
  computed: {
    postContentStrings () {
      return get(this.post, [ 'processed', 'postContentStrings', ], [])
    },
    postContentStringsTruncate () {
      return get(this.post, [ 'processed', 'postContentStringsTruncate', ], [])
    },
    showReadMore () {
      const isNothingTruncate = this.postContentStrings.join('') === this.postContentStringsTruncate.join('')
      return !isNothingTruncate && this.shouldShowReadMoreButton
    },
    postContent () {
      return this.showReadMore ? this.postContentStringsTruncate : this.postContentStrings
    },
  },
  methods: {
    isElementContentIframe,
    isElementContentYoutube,
  },
}
</script>

<style lang="stylus" scoped>
.content
  &__title
    font-size 18px
    font-weight 600
    margin 0
    line-height 1.5
  &__post-content
    margin 18px 0

.post-content
  &__paragraph
    font-size 15px
    font-weight 400
    text-align justify
    line-height 1.5
    margin 6px 0
    &:last-of-type
      display inline
    >>> a
      color black
      border-bottom 1px solid black
    &--iframe
      >>> iframe
        width 100% !important
    &--youtube
      position relative
      padding-bottom 56.25% // 16:9
      padding-top 25px
      width 100%
      height 0
      display inline-block
      & >>> iframe
        position absolute
        top 0
        left 0
        width 100%
        height 100%
    >>> h1
      font-size 35px
      line-height 1.5
      margin 16.5px 0 21px 0
    >>> h2
      font-size 25px
      line-height 1.5
      font-weight bold
      margin 23.5px 0 15px 0
    >>> figcaption
      font-size 14px
      line-height 1.71
      letter-spacing 0.5px
      color #808080
      margin-top 4.5px
      text-align center
      margin-bottom 28px
    >>> blockquote
      margin 0
      padding 0 0 0 16px
      border-left 4px solid #ccc
      line-height 1
    >>> img
      width 100%
.read-more
  font-size 15px
  &__text
    cursor pointer
    font-weight 500
    color #a7a7a7
    cursor pointer
    &:hover
      border-bottom 1px solid #a7a7a7
</style>


