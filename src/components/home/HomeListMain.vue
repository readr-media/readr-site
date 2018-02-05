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
const fetchPosts = (store, { mode, max_result, page, sort }) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      mode: mode || DEFAULT_MODE,
      max_result: max_result || MAXRESULT,
      page: page || DEFAULT_PAGE,
      sort: sort || DEFAULT_SORT
    }
  })
}
const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: params.subject,
      resource: params.resource
    })
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
      mode: params.mode,
      resource: params.resource,
      ids: params.ids
    })
  }
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
  methods: {
    autoLoadmoreListener () {
      window.addEventListener('scroll', () => {
        if (isScrollBarReachBottom()) {
          fetchPosts(this.$store, { mode: 'update', max_result: 10, page: this.page })
          .then((res) => {
            this.page += 1
            if (this.$store.state.isLoggedIn) {
              const ids = res.items.map(post => post.id)
              fetchFollowing(this.$store, {
                mode: 'update',
                resource: 'post',
                ids: ids
              })
            }
          })
          .catch((res) => {
            if (res === 'not found') {
              console.log('auto loadmore reach the end')
            }
          })
        }
      })
    }
  },
  mounted () {
    this.autoLoadmoreListener()
  }
}
</script>

<style lang="stylus" scoped>
.home-list-main
  max-width 650px
</style>
