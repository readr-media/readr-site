<template>
  <article class="home-article-main">
    <!-- <div class="home-article-main__share">
      <AppShareButton :shareUrl="shareUrl" :direction="'down'" :iconColor="'white'" :backgroundColor="'#d3d3d3'"/>
    </div> -->
    <div class="home-article-main__author">
      <figure class="author-info">
        <router-link class="author-info__thumbnail" :to="`/profile/${get(articleData, 'author.id')}`">
          <img :src="getImageUrl(get(articleData, 'author.profileImage', '/public/icons/exclamation.png'))" alt="">
        </router-link>
        <figcaption class="author-info__meta">
          <p class="author-info__date" v-text="dateDiffFromNow"></p>
          <router-link class="author-info__nickname" :to="`/profile/${get(articleData, 'author.id')}`">
            <p class="author-info__nickname" v-text="articleData.author.nickname"></p>
          </router-link>
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
import { dateDiffFromNow, getImageUrl, } from 'src/util/comm'
import { get, } from 'lodash'

export default {
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
  components: {
    AppShareButton,
    PostContent,
  },
  data () {
    return {
      isReadMore: false,
    }
  },
  computed: {
    dateDiffFromNow () {
      return dateDiffFromNow(this.articleData.updatedAt)
    },
    shareUrl () {
      return `/post/${this.articleData.id}`
    },
  },
  methods: {
    get,
    getImageUrl,
  },
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
    background-color #d3d3d3
  &__content
    width 650px
    height inherit
    box-shadow 0px 0px 3px 2px rgba(211, 211, 211, 1)
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
    position relative
    &__thumbnail
      width 60px
      height 60px
      img
        width 100%
        height 100%
        object-fit cover
    &__meta
      margin-left 22.5px
      p
        margin 5px 0
    &__date
      font-size 14px
      font-weight 500
    &__nickname
      font-size 18px
      color #000
    &:before
      content ''
      position absolute
      left calc(60px - 12px)
      bottom 0
      width 0
      height 0
      border-style solid
      border-width 0 12px 20px 12px
      border-color transparent transparent #ffffff transparent

  .editor-writing
    margin 10px 0
    &__container 
      // min-height 105px
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
      color #a7a7a7
      cursor pointer
      &:hover
        border-bottom 1px solid currentColor
    &__paragraph
      &--visible
        display block
      &--invisible
        display none

  .editor-writing-source
    height 102px
    border solid 0.5px #d3d3d3
    padding 8px 15px 5px 19.5px
    display flex
    justify-content space-between
    margin-bottom 7.5px
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
      margin 0
      display flex
      align-self center
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