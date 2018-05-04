<template>
  <div class="post-list">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"></BaseLightBoxPost>
    </BaseLightBox>  
    <transition-group name="fade" mode="out-in">
      <PostItem v-for="post in posts" :post="post" :key="`${post.id}-main`"></PostItem>
    </transition-group>  
  </div>
</template>
<script>
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import PostItem from 'src/components/post/PostItem.vue'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from 'api/config'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { find, get, } from 'lodash'

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
      where: {
        publish_status: [ 2, ],
      },
    },
    mode,
  })
}
const fetchMemoSingle = (store, memoId) => {
  return store.dispatch('GET_MEMO', {
    params: { memoId, },
  })
}
const fetchProjectSingle = (store, proj_id) => {
  return store.dispatch('GET_PUBLIC_PROJECT', {
    params: {
      where: {
        status: [ PROJECT_STATUS.WIP, PROJECT_STATUS.DONE, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      ids: [ proj_id, ],
    },
  })
}

export default {
  name: 'PostList',
  components: {
    BaseLightBox,
    BaseLightBoxPost,    
    PostItem,    
  },
  computed: {
    jobs () {
      const jobs = []

      /**
       * check what type of posts is it gonna fetch by route.
       */
      switch (this.route) {
        case 'memo':
          /**
           * make sure the project id is legal.
           */
          jobs.push(fetchProjectSingle(this.$store, Number(get(this.$route, 'params.id'))).then((proj) => {
            if (proj) {
              return Promise.all([
                fetchMemos(this.$store, {
                  mode: this.currPage === 1 ? 'set' : 'update',
                  proj_ids: [ Number(get(this.$route, 'params.id')), ],
                  page: this.currPage,
                }).then(() => { this.currPage += 1 }),
                get(this.$route, 'params.subItem')
                  ? fetchMemoSingle(this.$store, get(this.$route, 'params.subItem'))
                  : Promise.resolve(),
              ])
            } else {
              /**
              * Forbidden.
              */
              this.$router.push('/')
              return
            }
          }))
          break
      }
      return jobs
    },
    posts () {
      return get(this.$store, `state.${this.targState}`)
    },
    postSingle () {
      switch (this.route) {
        case 'memo':
          return get(this.$store, 'state.memoSingle', {})
        default:
          return
      }
    },    
    postLightBox () {
      if (this.showLightBox) {
        const findPostInList = find(this.posts, { 'id' : Number(this.$route.params.subItem), })
        debug('findPostInList', findPostInList)
        debug('this.postSingle', this.postSingle)
        return findPostInList || this.postSingle
      } else {
        return {}
      }      
    },
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
    },
    showLightBox () {
      return typeof(get(this.$route, 'params.subItem')) === 'string'
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
    closeLightBox () {
      debug('Go Back!')
      this.$router.back()
    },    
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
  beforeRouteEnter (to, from, next) {
    next()
  },  
  beforeRouteUpdate (to, from, next) {
    next()
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
    '$route' (to, from) {
      debug('Mutation detected: $route', to, from)
    },
  },
}
</script>
<style lang="stylus" scoped></style>