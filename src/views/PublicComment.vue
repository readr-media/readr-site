<template>
  <div class="public-comments">
    <CommentContainer
      :asset="resourceURL"
      :isPublic="true"
      :isPublicCommentView="true"
      @heightChanged="sendHeight"
    />
  </div>
</template>

<script>
import CommentContainer from 'src/components/comment/CommentContainer.vue'

export default {
  props: {
    resourceURL: {
      typs: String,
      default: '',
    },
  },
  components: {
    CommentContainer,
  },
  data () {
    return {
      comments_raw: [],
      pymChild: undefined,
    }
  },
  methods: {
    sendHeight () {
      this.pymChild.sendHeight()
    }, 
  },
  mounted () {
    const pym = require('pym.js/dist/pym.v1.js')
    this.pymChild = new pym.Child()
  },
}
</script>

<style lang="stylus" scoped>
.public-comments
  padding 0 20px 20px 20px
</style>


