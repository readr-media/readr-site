<template>
  <section class="home-list-main">
    <HomeArticleMain v-for="post in posts" :articleData="post" :key="post.id"/>
  </section>
</template>

<script>
import HomeArticleMain from './HomeArticleMain.vue'

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
    HomeArticleMain
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
.home-list-main
  max-width 650px
</style>
