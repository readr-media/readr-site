<template>
  <article class="home-article-main">
    <div class="home-article-main__share">
      <AppShareButton :shareUrl="shareUrl" :direction="'down'"/>
    </div>
    <div class="home-article-main__author">
      <figure class="author-info">
        <img class="author-info__thumbnail" :src="articleData.author.profileImage" alt="">
        <figcaption class="author-info__nickname" v-text="articleData.author.nickname"></figcaption>
      </figure>
    </div>
    <div class="home-article-main__content">
      <p class="home-article-main__date">{{ dateDiffFromNow }}</p>
      <h1 class="home-article-main__title" v-text="articleData.title"></h1>
      <div class="editor-writing">
        <div class="editor-writing__container">
          <template v-for="(p, i) in articleContent">
            <p class="editor-writing__paragraph--visible" v-if="i === 0">
              <span v-html="firstParagraph"></span>
              <span v-if="(p.length > 150 || articleContent.length > 1) ? !isReadMore : false">
                ......<span class="editor-writing__more" @click="toogleReadmore">更多</span>
              </span>
            </p>
            <p :class="`editor-writing__paragraph--${isReadMore ? 'visible' : 'invisible'}`" v-else v-html="p"></p>
          </template>
        </div>
      </div>
      <a class="editor-writing-source" v-if="hasSource" :href="articleData.link" target="_blank">
        <div class="editor-writing-source__content">
          <h1 class="editor-writing-source__title" v-text="linkTitleTrim"></h1>
          <div class="editor-writing-source__description">
            <p v-text="linkDescriptionTrim"></p>
            <p class="editor-writing-source__cite" v-if="articleData.linkName">出處：{{ articleData.linkName }}</p>
          </div>
        </div>
        <figure class="editor-writing-source__figure">
          <img :src="articleData.linkImage" alt="source-fig">
        </figure>
      </a>
      <nav class="article-nav">
        <span class="comment-icon" @click="renderComment(`.home-article-main__comment > .comment.comment-${get(articleData, [ 'id' ])}`)">
          <img class="comment-icon__thumbnail" src="/public/icons/comment-grey.png" alt="comment">
          <CommentCount class="comment-icon__count" :commentAmount="commentCount" :postId="get(this.articleData, [ 'id' ])" :type="'publicPosts'"></CommentCount>
        </span>
        <img class="follow-icon" :src="isFollow ? '/public/icons/star.png' : '/public/icons/star-line.png'" alt="follow" @click="toogleFollow">
      </nav>
      <div class="home-article-main__comment">
        <div :class="`comment comment-${get(articleData, [ 'id' ])}`"></div>
      </div>
    </div>
  </article>
</template>

<script>
import AppShareButton from 'src/components/AppShareButton.vue'
import CommentCount from 'src/components/comment/CommentCount.vue'
import _ from 'lodash'
import { SITE_DOMAIN_DEV } from 'src/constants'
import { dateDiffFromNow } from 'src/util/comm'
import { renderComment } from 'src/util/talk'

const { get } = _

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
  },
  components: {
    AppShareButton,
    CommentCount
  },
  data () {
    return {
      isReadMore: false
    }
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
    dateDiffFromNow () {
      return dateDiffFromNow(this.articleData.updatedAt)
    },
    firstParagraph () {
      const limit = 150
      if (!this.articleContent[0]) return ''
      return !this.isReadMore ? this.articleContent[0].slice(0, limit) : this.articleContent[0]
    },
    hasSource () {
      return this.articleData.linkTitle && this.articleData.linkDescription
    },
    linkTitleTrim () {
      const limit = 20
      return this.articleData.linkTitle.length > limit ? this.articleData.linkTitle.slice(0, limit) + ' ...' : this.articleData.linkTitle
    },
    linkDescriptionTrim () {
      const limit = 45
      return this.articleData.linkDescription.length > limit ? this.articleData.linkDescription.slice(0, limit) + ' ...' : this.articleData.linkDescription
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
    },
    shareUrl () {
      return `${SITE_DOMAIN_DEV}/post/${this.articleData.id}`
    }
  },
  methods: {
    get,
    renderComment (ref) {
      renderComment(`${ref}`, `${location.protocol}//${this.shareUrl}`)
    },
    toogleReadmore () {
      this.isReadMore = true
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
  }
}
</script>

<style lang="stylus">
$icon-size
  width 25px
  height 25px
.home-article-main
  display flex
  position relative
  // height 325px
  &__author
    width 60px
    height inherit
    background-color #444746
  &__content
    width 590px
    height inherit
    border solid 2.5px #ddcf21
    padding 11.5px 22.5px 18px 22.5px
    background-color white
  &__comment
    margin-top 20px
  &__date
    font-size 14px
    font-weight 500
    color #808080
    margin 0 0 5px 0
  &__title
    font-size 18px
    font-weight 600
    margin 0
  & + .home-article-main
    margin-top 10px

  .author-info
    margin 0
    display flex
    flex-direction column
    justify-content center
    align-items center
    &__thumbnail
      width 60px
      height 60px
    &__nickname
      letter-spacing 2px
      font-size 18px
      font-weight 300
      color #ffffff
      margin-top 8px
      writing-mode tb-rl
      white-space nowrap
      display block
      bottom 0
      width 20px
      height 20px

  .editor-writing
    margin 5px 0 10px 0
    &__container 
      min-height 105px
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
    margin-top 10px
    height 25px

  .comment-icon
    cursor pointer
    &__thumbnail
      @extends $icon-size
    &__count
      position relative
      right 5px
      font-size 14px
      color #a9a9a9
  .follow-icon
    @extends $icon-size
    margin-left 4.5px
    cursor pointer

  .editor-writing-source
    height 102px
    border solid 0.5px #d3d3d3
    padding 8px 15px 5px 19.5px
    display flex
    &__content
      width 350.5px
      position relative
    &__title
      font-size 14px
      font-weight 500
      color #808080
      margin 0
    &__description
      & > p
        font-size 14px
        font-weight 300
        color #808080
        line-height 1.4
        margin 5px 0 0 0
        text-align justify
    &__figure
      margin 0 0 0 15px
      display flex
      align-items center
      img[alt=source-fig]
        width 150px
        height 78.5px
    &__cite
      font-size 14px
      font-weight 300
      color #808080
      align-self flex-end
      position absolute
      bottom 0
</style>