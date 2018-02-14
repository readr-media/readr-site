<template>
  <div class="baselightbox-post">
    <article class="baselightbox-post__article">
      <img class="baselightbox-post__author-thumbnail" :src="!isPostEmpty ? profileImage(post) : ''">
      <section class="article-content">
        <h2 class="article-content__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></h2>
        <h2 class="article-content__author-nickname" v-text="!isPostEmpty ? post.author.nickname : ''"></h2>
        <h1 class="article-content__title" v-text="!isPostEmpty ? post.title : ''"></h1>
        <div class="article-content__paragraph-container" v-html="!isPostEmpty ? post.content : ''"></div>
      </section>
    </article>
    <section class="baselightbox-post__comment">
      <section class="comment-now">
        <img class="comment-now__user-thumbnail" src="/public/icons/account.png" alt="">
        <input class="comment-now__input" type="text">
      </section>
      <section class="comment-list"></section>
    </section>
  </div>
</template>

<script>
import { updatedAtYYYYMMDD } from '../util/comm'
import _ from 'lodash'

export default {
  props: {
    post: {
      type: Object
    },
    showLightBox: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showLightBox (val) {
      if (!val) {
        this.$emit('closeEditor')
      }
    }
  },
  computed: {
    isPostEmpty () {
      return _.isEmpty(this.post)
    }
  },
  methods: {
    updatedAtYYYYMMDD,
    profileImage (post) {
      return post.author.profileImage || '/public/icons/exclamation.png'
    }
  }
}
</script>

<style lang="stylus">
.baselightbox-post
  width 911px
  height 620.5px
  padding 26px 120px 26px 91px
  overflow-y scroll
  &__article
    display flex
  &__author-thumbnail
    width 75px
    min-width 75px
    height 75px
    border-radius 75px
  &__comment
    margin-top 17px
    border-top 1px solid #979797
    padding 18.5px 0 0 90px
    
.article-content
  margin-left 15px
  &__date
    font-size 14px
    font-weight 300
    color #000000
    margin 0
    line-height 20px
  &__author-nickname
    font-size 15px
    font-weight 500
    color #000000
    margin 0
    line-height 21px
  &__title
    font-size 18px
    font-weight 600
    color #000000
    margin 0
    line-height 25px
  &__paragraph-container
    & > p
      margin 13px 0
      font-size 15px
      font-weight 300
      text-align justify
      color #000000
      line-height 1.4
      & > br
        display none
      & > img
        width 100%

.comment-now
  display flex
  align-items center
  &__user-thumbnail
    r = 75px
    width r
    height r
    border-radius r
    border 1px solid #979797
  &__input
    width 100%
    height 30px
    margin-left 17px
    border solid 0.5px #979797
    padding 5px 12.5px
</style>


