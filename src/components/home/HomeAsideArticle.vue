<template>
  <article class="home-article-aside">
    <div class="home-article-aside__author">
      <div class="author-info">
        <router-link class="author-info__thumbnail" :to="authorPublicProfileUrl">
          <img :src="authorThumbnailImg" alt="" v-if="isClientSide">
        </router-link>
        <div class="author-info__meta-container">
          <router-link class="author-info__nickname" :to="authorPublicProfileUrl">
            <p class="author-info__nickname" v-text="authorNickname"></p>
          </router-link>
          <p class="author-info__date" v-text="updatedAtYYYYMMDD(articleData.updatedAt)"></p>
        </div>
      </div>
    </div>
    <div class="home-article-aside__content">
      <PostContent :modifier="'aside'" :post="articleData"></PostContent>
    </div>
  </article>
</template>

<script>
import { get, } from 'lodash'
import { updatedAtYYYYMMDD, isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'
import PostContent from 'src/components/post/PostContent.vue'

export default {
  components: {
    PostContent,
  },
  computed: {
    isClientSide,
    authorId () {
      return get(this.articleData, 'author')
    },
    authorPublicProfileUrl () {
      return this.authorId ? `/profile/${this.authorId}` : '#'
    },
    authorNickname () {
      return getArticleAuthorNickname(this.articleData)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.articleData)
    },
  },
  methods: {
    get,
    updatedAtYYYYMMDD,
  },
  props: {
    articleData: {
      type: Object,
      default: {
        author: {
          nickname: '',
        },
        title: '',
        content: '',
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
.home-article-aside
  width calc(355px - 15px - 15px)
  margin 0 30px
  background-color white
  padding 15px 0px 12.5px 0px
  border-bottom .5px solid #979797

  &__content
    display flex
    flex-direction column
  &__comment
    margin-top 20px
  .author-info
    display flex
    align-items center
    &__thumbnail
      width 60px
      height 60px
      img
        width 100%
        height 100%
        border-radius 100%
        object-fit cover
    &__meta-container
      margin-left 10.5px
    &__nickname
      margin 0
      font-size 14px
      font-weight 500
      color #000
    &__date
      margin 5px 0 0 0
      font-size 14px
      font-weight 500
      color #808080
</style>

