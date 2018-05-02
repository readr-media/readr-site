<template>
  <div>
    <transition-group name="fade" mode="out-in">
      <PostItem v-for="post in postsMain" :post="post" :key="`${post.id}-main`"></PostItem>
    </transition-group>  
  </div>
</template>
<script>
import PostItem from 'src/components/post/PostItem.vue'
import { get, } from 'lodash'

// const MAXRESULT_POSTS = 10
// const DEFAULT_CATEGORY = 'latest'

// const DEFAULT_PAGE = 1
// const DEFAULT_SORT = '-updated_at'

// const debug = require('debug')('CLIENT:PostList')
// const fetchPosts = (store, {
//   max_result = MAXRESULT_POSTS,
//   mode = 'set',
//   category = DEFAULT_CATEGORY,
//   page = DEFAULT_PAGE,
//   sort = DEFAULT_SORT,
// } = {}) => {
//   return store.dispatch('GET_PUBLIC_POSTS', {
//     params: {
//       mode: mode,
//       category: category,
//       max_result: max_result,
//       page: page,
//       sort: sort,
//     },
//   })
// }

const fetchMemos = (store, id) => {
  return store.dispatch('GET_MEMOS', {
    params: { id, },
  })
}

export default {
  name: 'PostList',
  components: {
    PostItem,    
  },
  methods: {},
  computed: {
    postsMain () {
      return this.postsLatest
    },
    postsLatest () {
      return get(this.$store.state.publicPosts, 'items', [])
    },    
  },
  beforeMount () {
    const jobs = []
    const route = this.$route.fullPath.split('/')[ 1 ]
    switch (route) {
      case 'memo':
        /^\/memo\/[A-Za-z0-9(\-)]*$/.test(get(this.$route, 'fullPath', '')) && jobs.push(fetchMemos(this.$store))
        break
    }
    Promise.all(jobs).then(() => {
      // if (this.$store.state.isLoggedIn) {
      //   const postIdFeaturedProject = _.get(this.$store, 'state.publicProjects.done', []).map(project => `${project.id}`)
      //   fetchFollowing(this.$store, {
      //     resource: 'project',
      //     ids: postIdFeaturedProject,
      //   })
      // }
    })
  },   
  mounted () {},
}
</script>
<style lang="stylus" scoped></style>