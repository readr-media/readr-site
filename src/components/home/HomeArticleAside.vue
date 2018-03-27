<template>
  <article class="home-article-aside">
    <div class="home-article-aside__author">
      <div class="author-info">
        <router-link class="author-info__thumbnail" :to="`/profile/${get(articleData, 'author.id')}`">
          <img :src="articleData.author.profileImage" alt="">
        </router-link>
        <div class="author-info__meta-container">
          <router-link class="author-info__nickname" :to="`/profile/${get(articleData, 'author.id')}`">
            <p class="author-info__nickname" v-text="articleData.author.nickname"></p>
          </router-link>
          <p class="author-info__date" v-text="updatedAtYYYYMMDD(articleData.updatedAt)"></p>
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
        <AppArticleNav :postId="this.articleData.id" :commentCount="commentCount"/>
      </div>
    </div>
  </article>
</template>

<script>
import { updatedAtYYYYMMDD, } from '../../util/comm'
import _ from 'lodash'
import AppArticleNav from 'src/components/AppArticleNav.vue'

export default {
  components: {
    AppArticleNav,
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
      return _.get(_.find(_.get(this.$store, [ 'state', 'commentCount', ]), { postId: this.articleData.id, }), [ 'count', ], 0)
    },
    titleTrim () {
      const limit = 18
      if (!this.articleData) return ''
      return this.articleData.title.length > limit ? this.articleData.title.slice(0, limit) + ' ......' : this.articleData.title
    },
    firstParagraph () {
      const limit = 35
      if (!this.articleContent[0]) return ''
      return this.articleContent[0].length > limit ? this.articleContent[0].slice(0, limit) + ' ......' : this.articleContent[0]
    },
  },
  methods: {
    get: _.get,
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
  margin 0 15px
  background-color white
  padding 15px 0px 12.5px 0px
  border-bottom .5px solid #979797
  // &__author
  //   display flex
  &__title
    font-size 15px
    font-weight 500
    text-align justify
  &__content
    display flex
    flex-direction column
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
      color #000
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
</style>

