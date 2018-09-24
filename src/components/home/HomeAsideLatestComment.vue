<template>
  <div class="latest-comment" @click="goPost">
    <div class="latest-comment__info">
      <div class="latest-comment__icon-nickname-container">
        <img class="latest-comment__icon" src="/public/icons/quotation.png" alt="latest-comment__icon">
        <router-link class="latest-comment__author-nickname" :to="`/profile/${commentAuthorId}`" v-text="commentAuthorNickname"></router-link>
      </div>
      <p class="latest-comment__created-at" v-text="commentDate"></p>
    </div>
    <div class="latest-comment__content">
      <span class="latest-comment__body" v-html="commentBodyTruncate"></span>
      <span v-if="isCommentBodyExceed" class="latest-comment__more">...<span class="latest-comment__more" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span></span>
    </div>
  </div>
</template>

<script>
import { getArticleAuthorNickname, currEnv, dateDiffFromNow, } from 'src/util/comm'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, } from 'src/constants'
import { get, isEqual, } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import truncate from 'html-truncate'

export default {
  props: {
    comment: {
      type: Object,
    },
  },
  data () {
    return {
      SITE_DOMAIN: currEnv() === 'dev' ? `http://${SITE_DOMAIN_DEV}` : `https://${SITE_DOMAIN}`,
      commentBodyLengthLimit: 30,
    }
  },
  computed: {
    commentResource () {
      const re = pathToRegexp(`${this.SITE_DOMAIN}/:route/:id/:sub_id?`)
      return {
        route: get(re.exec(get(this.comment, 'resource', '')), [ 1, ]),
        param: get(re.exec(get(this.comment, 'resource', '')), [ 2, ]),
      }
    },
    commentAuthorId () {
      return get(this.comment, 'author', '')
    },
    commentAuthorNickname () {
      return getArticleAuthorNickname(this.comment)
    },
    commentDate () {
      return dateDiffFromNow(get(this.comment, 'createdAt', ''))
    },
    commentBody () {
      return get(this.comment, 'body', '')
    },
    commentBodyTruncate () {
      return truncate(this.commentBody, this.commentBodyLengthLimit)
    },
    isCommentBodyExceed () {
      return !isEqual(this.commentBody, this.commentBodyTruncate)
    },
  },
  methods: {
    goPost () {
      this.$router.push(`/${this.commentResource.route}/${this.commentResource.param}`)
    },
  },
}
</script>

<style lang="stylus">
.latest-comment
  display flex
  flex-direction column
  padding 15px 0
  max-width 410px
  min-height 67px
  border-bottom .5px solid #cbcbcb
  &__info
    display flex
    justify-content space-between
  &__icon-nickname-container
    display flex
    align-items center
  &__icon
    width 16.5px
    height 15px
    margin 0 19.5px 0 0
  &__author-nickname
    color black
    font-size 14px
    font-weight 500
    display inline-block
    width 75px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  &__created-at
    margin 0
    font-size 14px
    font-weight 500
    color #808080
  &__content
    margin 5px 0 0 36px
    text-align justify
    font-size 15px
    line-height 1.5
    color black
    word-break break-all
  &__body 
    & > a
      color black
  &__more
    color #808080
</style>

