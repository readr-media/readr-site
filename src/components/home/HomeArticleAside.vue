<template>
  <article class="home-article-aside">
    <div class="home-article-aside__author">
      <div class="author-info">
        <img class="author-info__thumbnail" :src="articleData.author.profileImage" alt="">
        <div class="author-info__meta-container">
          <p class="author-info__nickname" v-text="articleData.author.nickname"></p>
          <p class="author-info__date" v-text="updatedAtYYYYMMDD"></p>
        </div>
      </div>
    </div>
    <div class="home-article-aside__content">
      <h1 class="home-article-aside__title" v-text="titleTrim"></h1>
      <div class="editor-writing">
        <div class="editor-writing__container">
          <p class="editor-writing__paragraph--visible">
            <span v-html="firstParagraph"></span>
          </p>
        </div>
        <nav class="article-nav">
          <span class="comment-icon" @click="renderComment(`.home-article-aside__comment > .comment.comment-${get(articleData, [ 'id' ])}`)">
            <img class="comment-icon__thumbnail" src="/public/icons/comment-blue.png" alt="comment">
            <CommentCount class="comment-icon__count" :commentAmount="commentCount" :postId="get(this.articleData, [ 'id' ])" :type="'publicPostsHot'"></CommentCount>
          </span>
          <img class="follow-icon" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow" @click="toogleFollow">
        </nav>
        <div class="home-article-aside__comment">
          <div :class="`comment comment-${get(articleData, [ 'id' ])}`"></div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import CommentCount from 'src/components/comment/CommentCount.vue'
import { SITE_DOMAIN_DEV } from 'src/constants'
import { renderComment } from 'src/util/talk'
import { get } from 'lodash'

const publishAction = (store, data) => {
  return store.dispatch('PUBLISH_ACTION', {
    params: data
  })
}
const updateStoreFollowingByResource = (store, { action, resource, resourceId, userId }) => {
  store.dispatch('UPDATE_FOLLOWING_BY_RESOURCE', {
    params: {
      action: action,
      resource: resource,
      resourceId: resourceId,
      userId: userId
    }
  })
}

export default {
  components: {
    CommentCount
  },
  computed: {
    articleContent () {
      const parser = new DOMParser()
      const html = parser.parseFromString(this.articleData.content, 'text/html')
      return Array.from(html.querySelectorAll('p'))
      .filter((node) => {
        return node.innerHTML !== '<br>'
      })
      .map((node) => {
        return node.innerHTML
      })
    },
    commentCount () {
      return this.articleData.commentAmount || 0
    },
    titleTrim () {
      const limit = 18
      if (!this.articleData) return ''
      return this.articleData.title.length > limit ? this.articleData.title.slice(0, limit) + ' ......' : this.articleData.title
    },
    updatedAtYYYYMMDD () {
      const iso = this.articleData.updatedAt
      const date = iso.split('T')[0]
      return date.replace(/-/g, '/')
    },
    firstParagraph () {
      const limit = 35
      if (!this.articleContent[0]) return ''
      return this.articleContent[0].length > limit ? this.articleContent[0].slice(0, limit) + ' ......' : this.articleContent[0]
    },
    postFollowers () {
      if (this.$store.state.isLoggedIn) {
        const postFollowersData = _.find(this.$store.state.followingByResource, { resourceid: `${this.articleData.id}` })
        return postFollowersData ? postFollowersData.follower : []
      } else {
        return []
      }
    },
    isFollow () {
      if (!this.$store.state.isLoggedIn) {
        return false
      } else {
        if (this.postFollowers.indexOf(this.$store.state.profile.id) !== -1) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    get,
    renderComment (ref) {
      renderComment(`${ref}`, `${location.protocol}//${SITE_DOMAIN_DEV}/post/${this.articleData.id}`)
    },
    toogleFollow () {
      if (!this.$store.state.isLoggedIn) {
        alert('please login first')
      } else {
        if (!this.isFollow) {
          publishAction(this.$store, {
            action: 'follow',
            resource: 'post',
            subject: this.$store.state.profile.id,
            object: `${this.articleData.id}`
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'follow',
            resource: 'post',
            resourceId: this.articleData.id,
            userId: this.$store.state.profile.id
          })
        } else {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: 'post',
            subject: this.$store.state.profile.id,
            object: `${this.articleData.id}`
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'unfollow',
            resource: 'post',
            resourceId: this.articleData.id,
            userId: this.$store.state.profile.id
          })
        }
      }
    }
  },
  props: {
    articleData: {
      type: Object,
      default: {
        author: {
          nickname: ''
        },
        title: '',
        content: ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
$icon-size
  width 25px
  height 25px
.home-article-aside
  width 100%
  // height 204px
  background-color white
  padding 15px 0px 12.5px 0px
  border-bottom .5px solid #979797
  // &__author
  //   display flex
  &__title
    font-size 15px
    font-weight 500
    text-align justify
  &__comment
    margin-top 20px
  .author-info
    display flex
    align-items center
    &__thumbnail
      r = 50px
      width r
      height r
      border-radius r
    &__meta-container
      margin-left 10.5px
    &__nickname
      margin 0
      font-size 14px
      font-weight 500
    &__date
      margin 5px 0 0 0
      font-size 14px
      font-weight 500
      color #808080

  .editor-writing
    margin 5px 0 15.5px 0
    &__container 
      min-height 58px
      // overflow hidden
      // text-overflow: ellipsis;
      & > p
        font-size 15px
        font-weight 300
        text-align justify
        line-height 1.4
        margin 0
        // text-overflow: ellipsis;
      p > br
        display none
      p > img
        width 100%
      p + p
        margin-top 6px
    &__more
      font-weight 500
      color #4280a2
      cursor pointer
      &:hover
        border-bottom 1px solid currentColor
    &__paragraph
      &--visible
        display block
      &--invisible
        display none

  .article-nav
    margin-top 6.5px
    height 25px

  .comment-icon
    cursor pointer
    &__thumbnail
      @extends $icon-size
    &__count
      position relative
      right 5px
      font-size 14px
      color #11b8c9
  .follow-icon
    @extends $icon-size
    margin-left 9px
    cursor pointer
</style>

