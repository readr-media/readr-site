<template>
  <section class="editor review" :class="{ disabled: disabled }">
    <div class="editor__heading" v-text="$t('POST_EDITOR.EDITOR')"></div>
    <div
      ref="quillEditor"
      :content="content"
      :disabled="disabled"
      class="editor__quill"
      v-quill:quillEditor="editorOption"
      @change="$_quillEditor_onEditorChange($event)">
    </div>
  </section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'QuillEditorReview',
  props: {
    content: {
      default: '',
    },
    disabled: {
      type: Boolean,
    },
  },
  data () {
    return {
      editorOption: {
        formats: [],
        modules: {
          toolbar: false,
          clipboard: {
            matchVisual: false,
          },
        },
      },
    }
  },
  methods: {
    $_quillEditor_onEditorChange(event) {
      this.$emit('updateContent', event.html)
    },
  },
}
</script>

<style lang="stylus" scoped>
  .editor
    margin-top 15px
    transition background-color .5s linear
    &.input--error
      background-color #ffe5e5
    &.disabled
      background-color rgba(0, 0, 0, .3)
    &__heading
      height 20px
      padding-left 10px
      color #fff
      font-size .875rem
      line-height 20px
      background-color #000
    &__quill
      height 380px
      font-size .9375rem
      overflow-y auto
      
</style>
