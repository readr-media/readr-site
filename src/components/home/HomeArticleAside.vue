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
          <span class="comment-icon">
            <img class="comment-icon__thumbnail" src="/public/icons/comment-grey.png" alt="comment">
            <span class="comment-icon__count">123</span>
          </span>
          <img class="follow-icon" src="/public/icons/star-line.png" alt="follow">
        </nav>
      </div>
    </div>
  </article>
</template>

<script>
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
  height 204px
  background-color white
  padding 15px 0 12.5px 0
  border-bottom .5px solid #979797
  // &__author
  //   display flex
  &__title
    font-size 15px
    font-weight 500
    text-align justify

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
    &__thumbnail
      @extends $icon-size
    &__count
      position relative
      right 5px
      font-size 14px
      color #a9a9a9
  .follow-icon
    @extends $icon-size
    margin-left 9px
</style>

