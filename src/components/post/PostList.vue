<template>
  <div class="post-list">
    <transition-group name="fade" mode="out-in">
      <PostItem v-for="post in posts" :post="post" :key="`${post.id}-main`"></PostItem>
    </transition-group>  
  </div>
</template>
<script>
import PostItem from 'src/components/post/PostItem.vue'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { get, } from 'lodash'

const MAXRESULT_POSTS = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-memo_order,-updated_at'

const debug = require('debug')('CLIENT:PostList')
const fetchMemos = (store, {
  mode = 'set',
  proj_ids = [],
  page = DEFAULT_PAGE,
}) => {
  return store.dispatch('GET_MEMOS', {
    params: { 
      project_id: proj_ids,
      max_result: MAXRESULT_POSTS,
      page,
      sort: DEFAULT_SORT,      
    },
    mode,
  })
}

export default {
  name: 'PostList',
  components: {
    PostItem,    
  },
  computed: {
    jobs () {
      const jobs = []
      switch (this.route) {
        case 'memo':
          /^\/memo\/[A-Za-z0-9(\-)]*$/.test(get(this.$route, 'fullPath', ''))
            && jobs.push(fetchMemos(this.$store, {
              mode: this.currPage === 1 ? 'set' : 'update',
              proj_ids: [ Number(get(this.$route, 'params.id')), ],
              page: this.currPage,
            }).then(() => { this.currPage += 1 }))
          break
      }
      return jobs
    },
    posts () {
      return get(this.$store, `state.${this.targState}`)
    },
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
    },
    targState () {
      let targ_state
      switch (this.route) {
        case 'memo':
          targ_state = 'memos'
          break
        default:
          targ_state = ''
      }
      return targ_state
    },
  },
  data () {
    return {
      currPage: DEFAULT_PAGE,
      isReachBottom: false,
      isLoadMoreEnd: false,
    }
  },
  methods: {
    loadmore () {
      // this.shouldShowSpinner = true
      return Promise.all(this.jobs).then((res) => {
        this.shouldShowSpinner = false
        debug('Loadmore done. Status', get(res, [ 0, 'status', ]), get(res, [ 0, 'res', ]))
        if (get(res, [ 0, 'status', ]) === 200) {
          this.currPage += 1
        } else if (get(res, [ 0, 'status', ]) === 'end') {
          this.isLoadMoreEnd = true
        }
      })
    },
    isElementReachInView,
    isScrollBarReachBottom, 
  },
  beforeMount () {
    Promise.all(this.jobs).then(() => {
      // if (this.$store.state.isLoggedIn) {
      //   const postIdFeaturedProject = _.get(this.$store, 'state.publicProjects.done', []).map(project => `${project.id}`)
      //   fetchFollowing(this.$store, {
      //     resource: 'project',
      //     ids: postIdFeaturedProject,
      //   })
      // }
    })
  },   
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isElementReachInView('.post-list', 0.5) || this.isScrollBarReachBottom()
    })    
  },
  watch: {
    isReachBottom () {
      debug('Mutation detected: isReachBottom', this.isReachBottom)
      if (!this.isReachBottom || this.isLoadMoreEnd) { return }
      this.loadmore()
    },
  },
}
</script>
<style lang="stylus" scoped></style>