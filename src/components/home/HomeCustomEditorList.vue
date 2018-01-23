<template>
  <section class="custom-editor-list">
    <HomeCustomEditorArticle v-for="post in posts" :articleData="post"/>
  </section>
</template>

<script>
import HomeCustomEditorArticle from './HomeCustomEditorArticle.vue'

const fetchPosts = (store, id) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      where: {
        author: id
      }
    }
  })
}

export default {
  components: {
    HomeCustomEditorArticle
  },
  computed: {
    posts () {
      return this.$store.state.publicPosts.items
    }
  },
  mounted () {
    fetchPosts(this.$store, 'id')
  }
}
</script>

<style lang="stylus" scoped>
.custom-editor-list
  max-width 650px
</style>
