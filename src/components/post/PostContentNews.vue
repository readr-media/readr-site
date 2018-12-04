<template>
  <div class="content content--news content--pointer" @click="navigatePost">
    <img
      v-if="post.ogImage && isClientSide"
      class="content__hero-image"
      :src="getFullUrl(post.ogImage)"
      @load="setLeadingImageOrientation(getFullUrl(post.ogImage), $event)"
    >
    <h1 class="content__title" v-text="post.title"></h1>
    <div class="content__post-content post-content">
      <template
        v-for="(p, i) in postContentStringsTruncate"
      >
        <!-- use div to prevent block elements in <p> SSR issue -->
        <div
          v-if="!isImg(p)"
          :key="i"
          :class="[
            'post-content__paragraph',
            { 'post-content__paragraph--youtube': isElementContentYoutube(p) }
          ]"
          v-html="p"
        >
        </div>
        <template v-else>
          <img
            v-if="isClientSide"
            :key="i"
            :src="getImgSrc(p)"
            @load="setContentImageOrientation(getImgSrc(p), $event)"
            @click="clickImg(p, $event)"
          >
        </template>
      </template>
      <span
        v-show="showReadMore"
        class="post-content__read-more read-more"
      >
        ......<span class="read-more__text" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { get, } from 'lodash'
import {
  isClientSide,
  isElementContentYoutube,
  isImg,
  getFullUrl,
  getElementContentSrc,
  onImageLoaded,
  clickImg,
} from 'src/util/comm'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isClientSide,
    postContentStrings () {
      return get(this.post, [ 'processed', 'postContentStrings', ], [])
    },
    postContentStringsTruncate () {
      return get(this.post, [ 'processed', 'postContentStringsTruncate', ], [])
    },
    showReadMore () {
      const isNothingTruncate = this.postContentStrings.join('') === this.postContentStringsTruncate.join('')
      return !isNothingTruncate
    },
  },
  methods: {
    isElementContentYoutube,
    isImg,
    getFullUrl,
    clickImg,
    setLeadingImageOrientation (src, event) {
      onImageLoaded(src)
      .then(({ width, height, }) => {
        width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
      })
      .catch(() => {
        event.target.style.objectFit = 'cover'
      })
    },
    setContentImageOrientation (src, event) {
      onImageLoaded(src)
      .then(({ width, height, }) => {
        width < height ? event.target.classList.add('portrait') : event.target.classList.add('landscape')
      })
      .catch(() => {
        event.target.classList.add('landscape')
      })
    },
    navigatePost (e) {
      if (get(e.target, 'tagName', '') === 'A') {
        e.stopPropagation()
      } else {
        this.$router.push(`/post/${get(this.post, 'id')}`)
      }
    },
    getImgSrc (content) {
      return getFullUrl(getElementContentSrc(content))
    },
  },
}
</script>

<style lang="stylus" scoped>
.content
  &--pointer
    cursor pointer
  &__hero-image
    width 100%
    height auto
    background-color #444746
    margin-bottom 22px
  &__title
    font-size 20px
    font-weight 700
    margin 0 0 11px
    line-height 1.5
    color #4a4a4a
  &__post-content
      margin 18px 0

.post-content
  &__paragraph
    font-size 15px
    font-weight 400
    text-align justify
    line-height 1.5
    margin 6px 0
    color #4a4a4a
    &:last-of-type
      display inline
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
    >>> a
      color black
      border-bottom 1px solid black
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

.landscape
  width 100%
.portrait
  width 50%
  display block
  margin 0 auto

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


