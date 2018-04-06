<template>
  <article class="home-article-aside">
    <div class="home-article-aside__author">
      <div class="author-info">
        <router-link class="author-info__thumbnail" :to="get(articleData, 'author.id') ? `/profile/${get(articleData, 'author.id')}` : '#'">
          <img :src="articleData.author_profileImage || getImageUrl(get(articleData, 'author.profileImage') || '/public/icons/exclamation.png')" alt="">
        </router-link>
        <div class="author-info__meta-container">
          <router-link class="author-info__nickname" :to="`/profile/${get(articleData, 'author')}`">
            <p class="author-info__nickname" v-text="articleData.author_nickname || articleData.author.nickname"></p>
          </router-link>
          <p class="author-info__date" v-text="updatedAtYYYYMMDD(articleData.updatedAt)"></p>
        </div>
      </div>
    </div>
    <div class="home-article-aside__content">
      <h1 class="home-article-aside__title" v-text="titleTrim"></h1>
      <div class="editor-writing">
        <router-link :to="`/post/${articleData.id}`" class="editor-writing__container">
          <p class="editor-writing__paragraph--visible">
            <span v-html="firstParagraph"></span>
          </p>
        </router-link>
        <AppArticleNav :postId="articleData.id" :commentCount="commentCount"/>
      </div>
    </div>
  </article>
</template>

<script>
import { find, get, map, } from 'lodash'
import { updatedAtYYYYMMDD, getImageUrl, } from 'src/util/comm'
import sanitizeHtml from 'sanitize-html'
import AppArticleNav from 'src/components/AppArticleNav.vue'

const dom = require('xmldom').DOMParser
const seializer  = require('xmldom').XMLSerializer
export default {
  components: {
    AppArticleNav,
  },
  computed: {
    commentCount () {
      return get(find(get(this.$store, [ 'state', 'commentCount', ]), { postId: this.articleData.id, }), [ 'count', ], 0)
    },
    titleTrim () {
      const limit = 18
      if (!this.articleData) return ''
      return this.articleData.title.length > limit ? this.articleData.title.slice(0, limit) + ' ......' : this.articleData.title
    },
    // TODOs: merge these features below to PostContent.vue
    postContent () {
      if (!this.articleData.content || this.articleData.content.length === 0) { return }
      const wrappedContent = sanitizeHtml(this.articleData.content, { allowedTags: false, selfClosing: [ 'img', ], })
      const doc = new dom().parseFromString(wrappedContent)
      const postParagraphs = map(get(doc, 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), { allowedTags: [ 'img', ], })))
      return postParagraphs
    },
    firstParagraph () {
      const limit = 35
      if (!this.postContent) return ''
      return !this.isReadMore ? this.postContent[0].slice(0, limit) : this.postContent[0]
    },
  },
  methods: {
    get,
    updatedAtYYYYMMDD,
    getImageUrl,
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

  .editor-writing
    margin 5px 0 15.5px 0
    &__container 
      display inline-block
      min-width 100%
      min-height 58px
      color black
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

