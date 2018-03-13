<template>
  <section class="editor">
    <div class="editor__heading">
      <div class="editor__heading--text" v-text="wording.WORDING_POSTEDITOR_EDITOR"></div>
      <div class="editor__heading--switch" :class="{ active: showHtml }" @click="$_editor_toggleHtml">&lt; / &gt;</div>
    </div>
    <div class="editor__main">
      <div v-show="type === config.type.REVIEW">
        <div
          ref="quillReviewEditor"
          :content="contentReview"
          class="quill-editor review"
          v-quill:quillReviewEditor="editorReviewOption"
          @change="onEditorChange($event)">
        </div>
      </div>
      <div v-show="type === config.type.NEWS">
        <div
          ref="quillNewsEditor"
          :content="contentNews"
          class="quill-editor news"
          v-quill:quillNewsEditor="editorNewsOption"
          @change="onEditorChange($event)">
        </div>
      </div>
      <div
        v-show="showHtml"
        class="editor__main--html"
        :class="{ review: type === config.type.REVIEW, news: type === config.type.NEWS }"
        v-text="content">
      </div>
    </div>
  </section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { POST_TYPE } from '../../api/config'
import { WORDING_POSTEDITOR_EDITOR } from '../constants'

const uploadImage = (store, file) => {
  return store.dispatch('UPLOAD_IMAGE', { file, type: 'post' })
}

export default {
  name: 'TextEditor',
  props: {
    content: {
      default: ''
    },
    type: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      config: {
        type: POST_TYPE
      },
      contentNews: '',
      contentReview: '',
      editorNewsOption: {
        formats: [ 'bold', 'italic', 'blockquote', 'code-block', 'link', 'image', 'video' ],
        modules: {
          toolbar: {
            container: [ [ 'bold', 'italic', 'blockquote', 'code-block' ], [ 'link', 'image', 'video' ] ],
            handlers: {
              'image': this.$_editor_imageHandler
            }
          },
          clipboard: {
            matchVisual: false
          }
        }
      },
      editorReviewOption: {
        formats: [],
        modules: {
          toolbar: false,
          clipboard: {
            matchVisual: false
          }
        }
      },
      showHtml: false,
      wording: {
        WORDING_POSTEDITOR_EDITOR
      }
    }
  },
  watch: {
    content () {
      if (this.type === POST_TYPE.REVIEW) {
        this.contentReview = this.content
      } else if (this.type === POST_TYPE.NEWS) {
        this.contentNews = this.content
      }
    },
  },
  methods: {
    onEditorChange(event) {
      if (event.html) {
        if (this.type === POST_TYPE.REVIEW) {
          this.$emit('updateContent', event.html)
        } else if (this.type === POST_TYPE.NEWS) {
          this.$emit('updateContent', event.html)
        }
      }
    },
    $_editor_imageHandler () {
      this.$_editor_selectImage()
    },
    $_editor_insertToEditor (url) {
      const range = this.quillNewsEditor.getSelection()
      this.quillNewsEditor.insertEmbed(range.index, 'image', url)
    },
    $_editor_saveImage (file) {
      const fd = new FormData()
      fd.append('image', file)
      uploadImage(this.$store, fd)
        .then((res) => {
          this.$_editor_insertToEditor(res.body.url)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    $_editor_selectImage () {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = () => {
        const file = input.files[0]
        if (/^image\//.test(file.type)) {
          this.$_editor_saveImage(file)
        }
      }
    },
    $_editor_toggleHtml () {
      this.showHtml = !this.showHtml
      if (this.type === POST_TYPE.REVIEW) {
        this.$refs.quillReviewEditor.classList.toggle('half')
      } else if (this.type === POST_TYPE.NEWS) {
        this.$refs.quillNewsEditor.classList.toggle('half')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.editor
  flex 1
  position relative
  width 100%
  margin-top 15px
  border-bottom 1px solid #d3d3d3
  .quill-editor
    width 100%
    height 100%
    &.half
      width 50%
  .medium-editor-element
    width 100%
    min-height 230px
    padding 10px
    border 1px solid #d3d3d3
    border-top none
    overflow-y auto
    &.half
      width 50%
  &__heading
    display flex
    width 100%
    height 20px
    color #fff
    font-size 14px
    font-weight 300
    line-height 20px
    background-color #000
    &--text
      flex-grow 1
      padding-left 10px
      user-select none
    &--switch
      width 50px
      text-align center
      background-color #808080
      cursor pointer
      user-select none
      &.active
        background-color #d8ca21
  &__main
    position relative
    display flex
    flex-direction column
    height calc(100% - 20px)
    
    &--html
      position absolute
      
      right 0
      width 50%
      height 338px
      padding 10px
      border-right 1px solid #d3d3d3
      overflow-x hidden
      &.news
        top 42px
      &.review
        top 0

@media (min-width 950px)
  .editor
    height 400px
    .quill-editor.news
      height 338px
    .quill-editor.review
      height 380px
    &__main
      height 380px

</style>
