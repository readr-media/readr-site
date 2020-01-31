<template>
  <div class="comment">
    <h1>{{ commentAmount }} 則留言</h1>
    <CommentContainer
      :asset="resourceUrl"
      :is-public="true"
      :is-public-comment-view="true"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CommentContainer from 'src/components/Comment/CommentContainer.vue'

export default {
  components: {
    CommentContainer
  },
  computed: {
    ...mapGetters({
      resourceUrl: 'DataComment/resourceUrl'
    }),
    ...mapState({
      commentAmount: state => state.DataPost.post.commentAmount || 0
    })
  }
}
</script>

<style lang="stylus" scoped>
.comment
  h1
    font-size 30px
    font-weight 600
    margin 0 0 20px 0
</style>
