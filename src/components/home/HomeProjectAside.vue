<template>
  <section class="home-project-aside">
    <!-- <img class="home-project-aside__project-image" src="https://www.mirrormedia.mg/projects/20170801aboriginal/ogimage.jpg" alt=""> -->
    <div class="home-project-aside__project-image"></div>
    <div class="home-project-aside__content">
      <h1 class="home-project-aside__project-title">一起回家：原住民傳統領域吵什麼？</h1>
      <nav class="article-nav">
        <span class="comment-icon" @click="renderComment(`.home-article-main__comment > .comment.comment-${get(articleData, [ 'id' ])}`)">
          <img class="comment-icon__thumbnail" src="/public/icons/comment-blue.png" alt="comment">
          <CommentCount class="comment-icon__count" :commentAmount="123" :postId="get(this.articleData, [ 'id' ])" :type="'publicPosts'"></CommentCount>
        </span>
        <img class="follow-icon" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow" @click="toogleFollow">
      </nav>
    </div>
  </section>
</template>

<script>
import CommentCount from 'src/components/comment/CommentCount.vue'
import _ from 'lodash'
const { get } = _

export default {
  components: {
    CommentCount
  },
  methods: {
    get
  }
}
</script>


<style lang="stylus" scoped>
.home-project-aside
  &__project-image
    width 100%
    height 236.4px
    margin-top 5px
    background-image url(https://www.mirrormedia.mg/projects/20170801aboriginal/ogimage.jpg)
    background-repeat no-repeat
    background-size cover
    background-position center center
  &__content
    padding 0 20px
  &__project-title
    font-size 15px
    text-align justify
    margin 8.1px 0 6px 0

$icon-size
  width 25px
  height 25px
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
    color #11b8c9
.follow-icon
  @extends $icon-size
  margin-left 4.5px
  cursor pointer
</style>

