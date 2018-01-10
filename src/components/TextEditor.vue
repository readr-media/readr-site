<template>
  <section class="editor">
    <div class="editor__heading">
      <div class="editor__heading--text">編輯器</div>
      <div class="editor__heading--switch" :class="{ active: showHtml }" @click="$_editor_toggleHtml">&lt; / &gt;</div>
    </div>
    <div class="editor__main">
      <div ref="quillEditor" v-model="content" class="quill-editor" v-quill:quillEditor="editorOption"></div>
      <div v-show="showHtml" class="editor__main--html" v-text="content"></div>
    </div>
  </section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const uploadImage = (store, file) => {
  return store.dispatch('UPLOAD_IMAGE', { file })
}

export default {
  name: 'TextEditor',
  data () {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: {
            container: [ [ 'bold', 'italic', 'blockquote', 'code-block' ], [ 'link', 'image', 'video' ] ],
            handlers: {
              'image': this.$_editor_imageHandler
            }
          }
        }
      },
      showHtml: false
    }
  },
  props: {
    contentEdit: {
      default: ''
    },
    needReset: {
      type: Boolean
    }
  },
  watch: {
    content () {
      this.$emit('updateContent', this.content)
    },
    contentEdit (val) {
      this.content = val
    },
    needReset () {
      this.content = ''
    }
  },
  methods: {
    $_editor_imageHandler () {
      this.$_editor_selectImage()
    },
    $_editor_insertToEditor (url) {
      const range = this.quillEditor.getSelection()
      this.quillEditor.insertEmbed(range.index, 'image', url)
    },
    $_editor_saveImage (file) {
      const fd = new FormData()
      fd.append('image', file)
      uploadImage(this.$store, fd)
        .then((res) => {
          this.$_editor_insertToEditor(res.body.url)
        })
        .catch((err) => {
          console.log(err)
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
      if (this.showHtml) {
        this.$refs.quillEditor.classList.add('half')
      } else {
        this.$refs.quillEditor.classList.remove('half')
      }
    },
    applyTextEdit (e) {
      this.content = e.event.target.innerHTML
    }
  }
}
</script>

<style lang="stylus" scoped>

.editor
  position relative
  width 100%
  height 400px
  margin-top 15px
  border-bottom 1px solid #d3d3d3
  .quill-editor
    width 100%
    height 338px
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
    height 380px
    
    &--html
      position absolute
      top 42px
      right 0
      width 50%
      height 338px
      padding 10px
      border-right 1px solid #d3d3d3
      overflow-x hidden

  // &__result
  //   width 100%
  //   min-height 125px
  //   padding 20px
  //   background-color #fff
  // &__markdown
  //   width 100%
  //   min-height 125px
  //   padding 20px
  //   background-color #fff
  //   border 1px solid #000


</style>
