<template>
  <router-link class="latest-comment" :to="`/post/${commentResourceId}`">
    <div class="latest-comment__info">
      <div class="latest-comment__icon-nickname-container">
        <img class="latest-comment__icon" src="/public/icons/quotation.png" alt="latest-comment__icon">
        <router-link class="latest-comment__author-nickname" :to="`/profile/${commentAuthorId}`" v-text="commentAuthorNickname"></router-link>
      </div>
      <p class="latest-comment__created-at" v-text="commentDate"></p>
    </div>
    <p class="latest-comment__body">{{ commentBody }}<span v-if="isCommentBodyExceed">...<span class="latest-comment__more" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span></span></p>
  </router-link>
</template>

<script>
import { getArticleAuthorNickname, currEnv, dateDiffFromNow, } from 'src/util/comm'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, } from 'src/constants'
import { get, } from 'lodash'
import pathToRegexp from 'path-to-regexp'

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
    commentResourceId () {
      const re = pathToRegexp(`${this.SITE_DOMAIN}/:route/:id`)
      return re.exec(get(this.comment, 'resource', ''))[2]
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
      return get(this.comment, 'body', '').slice(0, this.commentBodyLengthLimit)
    },
    isCommentBodyExceed () {
      return get(this.comment, 'body', '').length > this.commentBodyLengthLimit
    },
  },
}
</script>

<style lang="stylus" scoped>
.latest-comment
  display flex
  flex-direction column
  padding 15px
  max-width 410px
  min-height 67px
  &__info
    display flex
    justify-content space-between
  &__icon
    width 16.5px
    height 15px
    margin 0 19.5px 0 0
  &__author-nickname
    color black
    font-size 14px
    font-weight 500
  &__created-at
    margin 0
    font-size 14px
    font-weight 500
    color #808080
  &__body
    margin 5px 0 0 36px
    text-align justify
    font-size 15px
    line-height 1.5
    color black
    word-break break-all
  &__more
    color #808080
  & + &
    border-top .5px solid #979797
</style>

