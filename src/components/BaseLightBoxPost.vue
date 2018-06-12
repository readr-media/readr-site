<template>
  <div :class="[ { 'baselightbox-post--review': !isNews }, { 'baselightbox-post--news': isNews } ]">
    <!-- template for post type is news -->
    <template v-if="isNews">
      <img class="baselightbox-post__leading-image" v-if="post.ogImage && isClientSide" :src="getImageUrl(post.ogImage)" @load="setLeadingImageOrientation(getImageUrl(post.ogImage), $event)">
      <div class="baselightbox-post__article-container">
        <article class="baselightbox-post__article">
          <section class="author-info">
            <router-link :to="`/profile/${authorId}`">
              <img class="author-info__thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
            </router-link>
            <div class="author-info__meta">
              <p class="author-info__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></p>
              <router-link class="author-info__author-nickname" :to="`/profile/${authorId}`" v-text="authorNickname"></router-link>
            </div>
          </section>
          <section class="article-content">
            <h1 v-text="!isPostEmpty ? post.title : ''"></h1>
            <template v-for="p in postContent">
              <figure v-if="isImg(p)">
                <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
              </figure>
              <p v-else v-html="p"></p>
            </template>
          </section>
        </article>
        <div class="nav-container">
          <AppArticleNav :postId="post.id" :articleType="this.post.flag" :commentCount="commentCount"/>
        </div>
      </div>
    </template>
    <!-- template for post type is review and others -->
    <template v-if="!isNews">
      <article class="baselightbox-post__article">
        <img class="baselightbox-post__author-thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
        <section class="article-content">
          <h2 class="article-content__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></h2>
          <h2 class="article-content__author-nickname" v-text="authorNickname"></h2>
          <h1 class="article-content__title" v-text="!isPostEmpty ? post.title : ''"></h1>
          <div class="article-content__paragraph-container" v-html="!isPostEmpty ? post.content : ''"></div>
          <a class="article-content__source-link" :href="post.link" target="_blank" v-text="post.linkTitle"></a>
          <AppArticleNav :postId="post.id" :articleType="this.post.flag" :commentCount="commentCount" :inLightbox="true" @toogleComment="toogleComment"/>
        </section>
      </article>
      <CommentContainer class="baselightbox-post__comment" v-show="showComment" v-if="shouldRenderComment" :asset="asset"></CommentContainer>
    </template>
  </div>
</template>

<script>
import { POST_TYPE, } from '../../api/config'
import { get, find,  map, isEmpty, } from 'lodash'
import { updatedAtYYYYMMDD, isClientSide, getArticleAuthorId, getArticleAuthorNickname, getArticleAuthorThumbnailImg, getImageUrl, onImageLoaded, } from '../util/comm'
import AppArticleNav from 'src/components/AppArticleNav.vue'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import sanitizeHtml from 'sanitize-html'

const debug = require('debug')('CLIENT:BaseLightBoxPost')
const dom = require('xmldom').DOMParser
const seializer  = require('xmldom').XMLSerializer

export default {
  name: 'BaseLightBoxPost',
  components: {
    AppArticleNav,
    CommentContainer,
  },
  computed: {
    asset () {
      debug('this.asset', `${get(this.$store, 'state.setting.HOST')}/${get(this.post, 'flag') || 'post'}/${this.post.id}`)
      return `${get(this.$store, 'state.setting.HOST')}/${get(this.post, 'flag') === 'memo' ? `series/${get(this.$route, 'params.slug')}` : 'post'}/${this.post.id}`
    },
    authorId () {
      return getArticleAuthorId(this.post)
    },
    authorNickname () {
      return getArticleAuthorNickname(this.post)
    },
    authorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.post)
    },
    isPostEmpty () {
      return isEmpty(this.post)
    },
    isClientSide,
    isNews () {
      return get(this.post, 'flag') === 'memo' || get(this.post, 'type', POST_TYPE.REVIEW) === POST_TYPE.NEWS
    },    
    postContent () {
      if (!this.post.content || this.post.content.length === 0) { return [] }
      const wrappedContent = sanitizeHtml(this.post.content, { allowedTags: false, selfClosing: [ 'img', ], })
      const doc = new dom().parseFromString(wrappedContent)
      let postParagraphs = map(get(doc, 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), { allowedTags: [ 'img', 'strong', 'a', 'h1', 'h2', 'figcaption', ], })))
      return postParagraphs
    },
    commentCount () {
      return get(find(get(this.$store, 'state.commentCount'), { postId: this.post.id, }), 'count') || 0
    },
  },
  data () {
    return {
      showComment: true,
      shouldRenderComment: false,
    }
  },
  methods: {
    get,
    getImageUrl,
    updatedAtYYYYMMDD,
    isImg (content) {
      const regexp = /<img([\w\W]+?)\/>/
      return regexp.test(content)
    },
    getImgSrc (content) {
      const regexp = /<img.*?src=['"](.*?)['"]/
      return getImageUrl(regexp.exec(content)[1])
    },
    setLeadingImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
      }).catch(() => { event.target.style.objectFit = 'cover' })
    },
    setContentImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.classList.add('portrait') : event.target.classList.add('landscape')
      }).catch(() => { event.target.classList.add('landscape') })
    },
    toogleComment () {
      this.showComment = !this.showComment
    },
  },
  props: {
    post: {
      type: Object,
    },
  },
  watch: {
    post () {
      debug('Mutation detected: post', this.post)
      if (this.post.id && !this.isNews ) {
        this.shouldRenderComment = true
        this.showComment = true
      }
    },
  },
}
</script>

<style lang="stylus">
.baselightbox-post
  &--review
    width 911px
    height 620.5px
    padding 26px 120px 26px 91px
    overflow-y scroll
    .baselightbox-post
      &__article
        display flex
      &__author-thumbnail
        width 75px
        min-width 75px
        height 75px
        border-radius 75px
        object-fit cover
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
      &__source-link
        font-size 18px
        text-align justify
        line-height 1.5
        color #0a5780
        text-decoration underline
        margin 40px 0
        display block

  font-family = 'Songti TC', 'SimSun'
  &--news
    width 1029px
    height 90vh
    overflow-y scroll
    .baselightbox-post
      &__leading-image
        width 100%
        height 617.5px
        background-color #444746
      &__article-container
        width 100%
        padding 65.5px 214.5px 0 214.5px
      &__article
        display flex
        flex-direction column
        padding-bottom 25.5px
        border-bottom solid 0.5px #d3d3d3
    .author-info
      display flex
      &__thumbnail
        width 75px
        min-width 75px
        height 75px
        border-radius 75px
        object-fit cover
      &__meta
        width 100%
        margin-left 12px
        display flex
        flex-direction column
        justify-content center
      &__date
        font-size 14px
        color #808080
        margin 5px 0
      &__author-nickname
        font-size 15px
        font-weight 500
        color black
    .article-content
      h1
        font-family font-family
        font-size 35px
        line-height 1.5
        margin 16.5px 0 21px 0
      h2
        font-family font-family
        font-size 25px
        line-height 1.5
        font-weight bold
        margin 23.5px 0 15px 0
      p
        font-family font-family
        font-size 15px
        letter-spacing 0.5px
        line-height 1.6
        text-align justify
      p + p
        margin 26px 0 0 0
      figure
        margin 41px 0 0px 0
        display flex
        flex-direction column
        align-items center
      figcaption
        font-family font-family
        font-size 14px
        line-height 1.71
        letter-spacing 0.5px
        color #808080
        margin-top 4.5px
        margin-bottom 28px
        text-align center
      .landscape
        width 100%
      .portrait
        width 50%
    .nav-container
      padding 16px 0
</style>
