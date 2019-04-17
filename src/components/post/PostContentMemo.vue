<template>
  <div class="content content--memo content--pointer">
    <div class="content__memo-hint memo-hint">
      <img class="memo-hint__lock-icon" src="/public/icons/lock.png" alt="">
      <span class="memo-hint__text" v-text="$t('homepage.EDITOR_ROOMMATE_ONLY')"></span>
    </div>
    <h1 class="content__title" v-text="post.title"></h1>
    <div class="content__post-content post-content" @click="goMemo">
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
        class="post-content__read-more read-more"
        @click.prevent="memoDeductMach"
      >
        ......<span class="read-more__text" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { PROJECT_STATUS, } from 'api/config'
import pathToRegexp from 'path-to-regexp'
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

const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, })

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isClientSide,
    postContentStringsTruncate () {
      return get(this.post, [ 'processed', 'postContentStringsTruncate', ], [])
    },
    isMemoPaid () {
      return get(this.post, 'project.paid')
    },
    isProjectPublished () {
      return get(this.post, 'project.status') === PROJECT_STATUS.DONE
    },
    targetUrl () {
      // Remove hostname and port from url using regular expression
      const link = (get(this.post, 'link') || '').replace( /^[a-zA-Z]{3,5}:\/{2}[a-zA-Z0-9_.:-]+/, '' )
      if (link !== '') {
        const re = pathToRegexp(`/series/:projectSlug/:memoId`)
        const projectSlug = get(re.exec(link), '1')
        const memoId = get(re.exec(link), '2')
        return `/series/${projectSlug}/${memoId}`
      } else if (get(this.post, 'project')) {
        const projectSlug = get(this.post, 'project.slug')
        const memoId = get(this.post, 'id')
        return `/series/${projectSlug}/${memoId}`
      } else {
        return `/series/${get(this.$route, 'params.slug')}/${get(this.post, 'id')}`
      }
    },
  },
  methods: {
    isImg,
    isElementContentYoutube,
    clickImg,
    setContentImageOrientation (src, event) {
      onImageLoaded(src)
      .then(({ width, height, }) => {
        width < height ? event.target.classList.add('portrait') : event.target.classList.add('landscape')
      })
      .catch(() => {
        event.target.classList.add('landscape')
      })
    },
    getImgSrc (content) {
      return getFullUrl(getElementContentSrc(content))
    },
    goMemo (e) {
      if (get(e.target, 'tagName', '') === 'A') {
        e.stopPropagation()
      } else if (this.isMemoPaid !== false || this.isProjectPublished) {
        this.$router.push(this.targetUrl)
      }
    },
    memoDeductMach () {
      if (this.isMemoPaid === false) {
        /**
         * Go open deduction lightbox.
         */
        switchOnDeductionPanel(this.$store, this.post)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.content
  &--pointer
    cursor pointer
  &__title
    font-size 18px
    font-weight 600
    margin 0
    line-height 1.5
  &__post-content
    margin 18px 0

.memo-hint
  display flex
  align-items center
  margin-bottom 5px
  font-size 0.875rem
  font-weight 500
  line-height normal
  color #808080
  &__lock-icon
    height 11px
    margin-right 7px

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


