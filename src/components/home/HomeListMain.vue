<template>
  <section class="home-list-main">
    <HomeArticleMain v-for="post in posts" :articleData="post" :key="post.id"/>
  </section>
</template>

<script>
import HomeArticleMain from './HomeArticleMain.vue'
import { isScrollBarReachBottom } from '../../util/comm'

const DEFAULT_MODE = 'set'
const MAXRESULT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const fetchPosts = (store, { mode, max, page, sort }) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      mode: mode || DEFAULT_MODE,
      max_result: max || MAXRESULT,
      page: page || DEFAULT_PAGE,
      sort: sort || DEFAULT_SORT
    }
  })
}

export default {
  components: {
    HomeArticleMain
  },
  data () {
    return {
      page: 2
    }
  },
  computed: {
    posts () {
      return this.$store.state.publicPosts.items
    }
  },
  mounted () {
    fetchPosts(this.$store, {})
    window.addEventListener('scroll', () => {
      if (isScrollBarReachBottom()) {
        fetchPosts(this.$store, { mode: 'update', max: 10, page: this.page })
        .then((status) => {
          this.page += 1
        })
        .catch((res) => {
          if (res === 'not found') {
            console.log('auto loadmore reach the end')
          }
        })
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.home-list-main
  max-width 650px
</style>
