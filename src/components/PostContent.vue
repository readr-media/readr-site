<template>
  <div :class="`post-content__${modifier}`">
    <h1 class="post-content__title" v-text="post.title"></h1>
    <div class="editor-writing">
      <router-link :to="`/post/${post.id}`" class="editor-writing__container">
        <template v-for="(p, i) in postContentProcessed">
          <!-- post content for initial display -->
          <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
            <span v-html="p"></span>
            <span v-if="shouldShowReadMoreButton(i)">
              ......<span class="editor-writing__more" @click="toogleReadmore($event)" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
          </p>
          <!-- rest of the post content -->
          <p :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" v-else v-html="p" :key="`${post.id}-${i}`"></p>
        </template>
      </router-link>
    </div>
    <a class="editor-writing-source" v-if="isArticleMain && hasSource" :href="post.link" target="_blank">
      <div class="editor-writing-source__content">
        <h1 class="editor-writing-source__title" v-text="linkTitleTrim"></h1>
        <div class="editor-writing-source__description">
          <p v-text="linkDescriptionTrim"></p>
          <p class="editor-writing-source__cite" v-if="post.linkName">{{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ post.linkName }}</p>
        </div>
      </div>
      <div class="editor-writing-source__figure" v-if="post.linkImage" :style="{ backgroundImage: `url(${post.linkImage})`, backgroundSize: ogImageSize, }"></div>
    </a>
    <AppArticleNav :postId="this.post.id" :commentCount="commentCount"></AppArticleNav>
  </div>
</template>
<script>
  import { find, get, map, } from 'lodash'
  import AppArticleNav from 'src/components/AppArticleNav.vue'
  import sanitizeHtml from 'sanitize-html'
  import truncate from 'html-truncate'

  const dom = require('xmldom').DOMParser
  const seializer  = require('xmldom').XMLSerializer
  // const debug = require('debug')('CLIENT:PostContent')
  export default {
    name: 'PostContent',
    computed: {
      commentCount () {
        return get(find(get(this.$store, 'state.commentCount'), { postId: this.post.id, }), 'count') || 0
      },
      hasSource () {
        return this.post.linkTitle && this.post.linkDescription
      },
      linkTitleTrim () {
        return truncate(this.post.linkTitle, 20)
      },
      linkDescriptionTrim () {
        return truncate(this.post.linkDescription, 45)
      },
      isArticleMain () {
        return this.modifier === 'main'
      },
      showContentWordLimit () {
        return this.isArticleMain ? 150 : 50
      },
      postContent () {
        if (!this.post.content || this.post.content.length === 0) { return [] }
        const wrappedContent = sanitizeHtml(this.post.content, { allowedTags: false, selfClosing: [ 'img', ], })
        const doc = new dom().parseFromString(wrappedContent)
        const postParagraphs = map(get(doc, 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), { allowedTags: [ 'img', ], })))
        return postParagraphs
      },
      postContentProcessed () {
        if (this.postContentWordCountTotal <= this.showContentWordLimit){
          return this.postContent
        } else {
          return this.postContent.map((paragraph, index) => {
            if (!this.isReadMoreClicked && index === this.shouldContentStopAtIndex && this.isStopParagraphWordCountExceedLimit) {
              const wordCountBeforeStop = this.postContentWordCount.reduce((acc, curr, currIndex) => currIndex < this.shouldContentStopAtIndex ? acc + curr : acc, 0)
              return truncate(paragraph, this.showContentWordLimit - wordCountBeforeStop, { ellipsis: this.isArticleMain ? null : '...', })
            }
            return paragraph
          })
        }
      },
      postContentWordCount () {
        return this.postContent.map(paragraph => paragraph.length)
      },
      postContentWordCountTotal () {
        return this.postContentWordCount.reduce((acc, curr) => acc + curr, 0)
      },
      shouldContentStopAtIndex () {
        let count = 0
        let index = 0
        if (this.postContentWordCountTotal <= this.showContentWordLimit) return this.postContent.length
        while (count + this.postContent[index].length <= this.showContentWordLimit) {
          const currentParagraph = this.postContent[index]
          const currentParagraphWordLength = currentParagraph.length
          if (index < this.postContent.length - 1) {
            index += 1
          }
          count += currentParagraphWordLength
        }
        return index
      },
      isStopLastParagraphBeforeTruncate () {
        return this.shouldContentStopAtIndex === this.postContent.length - 1
      },
      isStopParagraphWordCountExceedLimit () {
        const stopParagraph = this.postContent[this.shouldContentStopAtIndex]
        const stopParagraphWordLength = stopParagraph.length
        return stopParagraphWordLength > this.showContentWordLimit
      },
    },
    components: {
      AppArticleNav,
    },
    data () {
      return {
        isReadMoreClicked: false,
        ogImageSize: '',
      }
    },
    methods: {
      toogleReadmore (event) {
        if (event) event.preventDefault()
        this.isReadMoreClicked = true
      },
      isLastParagraphAfterTruncate (index) {
        return index === this.shouldContentStopAtIndex
      },      
      shouldShowReadMoreButton (index) {
        return this.isArticleMain && !this.isReadMoreClicked && (!this.isStopLastParagraphBeforeTruncate || this.isStopParagraphWordCountExceedLimit) && this.isLastParagraphAfterTruncate(index)
      },
      fetchOgImage () {
        const img = new Image()
        img.src = this.post.linkImage
        return new Promise((resolve, reject) => {
          if (!this.post.linkImage) {
            reject()
          } else {
            img.onload = function () {
              resolve({ width: this.width, height: this.height, })
            }
          }
        })
      },
    },
    beforeMount () {
      this.fetchOgImage().then(({ width, height, }) => {
        this.ogImageSize = width < height ? 'contain' : 'cover'
      })
    },
    mounted () {},
    props: {
      post: {
        type: Object,
        required: true,
      },
      modifier: {
        type: String,
        default: 'main',
      },
    },
  }
</script>
<style lang="stylus">
  .post-content
    &__main
      .post-content
        &__title
          font-size 18px
          font-weight 600
          margin 0
          line-height 1.5
      .editor-writing
        margin 18px 0
        &__container 
          // min-height 105px
          // overflow hidden
          // text-overflow: ellipsis;
          display inline-block
          margin-bottom 5px
          color black
          min-width 100%
          min-height 20px
          & > p
            font-size 15px
            font-weight 400
            text-align justify
            line-height 1.5
            margin 0
            // text-overflow: ellipsis;
          p > br
            display none
          p > img, p img
            width 100%
            margin 20px 0
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
        margin-bottom 15.5px
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
          background-repeat no-repeat
          background-position center center
          background-color #444746
        &__cite
          font-size 14px
          font-weight 300
          color #808080
          align-self flex-end
          position absolute
          bottom 0

    &__aside
      .post-content
        &__title
          font-size 15px
          font-weight 500
          text-align justify
          line-height 1.5
          margin 1em 0
      .editor-writing
        margin 5px 0 12.5px 0
        &__container 
          display inline-block
          min-width 100%
          min-height 58px
          color black
          & > p
            font-size 15px
            font-weight 400
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