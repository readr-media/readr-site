<template>
  <article class="home-article-main">
    <div class="home-article-main__share">
      <AppShareButton :shareUrl="shareUrl" :direction="'down'" :iconColor="'white'" :backgroundColor="'#11b8c9'"/>
    </div>
    <div class="home-article-main__author">
      <figure class="author-info">
        <img class="author-info__thumbnail" :src="articleData.author.profileImage" alt="">
        <figcaption class="author-info__meta">
          <p class="author-info__date" v-text="dateDiffFromNow"></p>
          <p class="author-info__nickname" v-text="articleData.author.nickname"></p>
        </figcaption>
      </figure>
    </div>
    <div class="home-article-main__content">
      <PostContent :post="articleData"></PostContent>
    </div>
  </article>
</template>

<script>
import AppShareButton from 'src/components/AppShareButton.vue'
import PostContent from 'src/components/PostContent.vue'
import { SITE_DOMAIN_DEV } from 'src/constants'
import { dateDiffFromNow } from 'src/util/comm'

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
    PostContent
  },
  data () {
    return {
      isReadMore: false
    }
  },
  computed: {
    dateDiffFromNow () {
      return dateDiffFromNow(this.articleData.updatedAt)
    },
    shareUrl () {
      return `${SITE_DOMAIN_DEV}/post/${this.articleData.id}`
    }
  }
}
</script>

<style lang="stylus">
.home-article-main
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 650px
  position relative
  &__share
    width 25px
    height 25px
    position absolute
    top 21px
    right 36px
  &__author
    width 100%
    height 60px
    background-color #11b8c9
  &__content
    width calc(650px + 1px + 1px)
    height inherit
    border solid 1.5px #d3d3d3
    border-top none
    padding 16px 32.5px
    background-color white
    display flex
    flex-direction column
  // &__comment
  //   margin-top 20px
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
    flex-direction row
    justify-content flex-start
    align-items center
    &__thumbnail
      width 60px
      height 60px
    &__meta
      margin-left 22.5px
      > p
        margin 5px 0
    &__date
      font-size 14px
      font-weight 500
      color white
    &__nickname
      font-size 18px
      color white
</style>