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
import moment from 'moment'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, } from 'api/config'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { find, get, sortBy, union, } from 'lodash'

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
      member_id: get(store, 'state.profile.id'),
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
const fetchProjectSingle = (store, proj_slug) => {
  return store.dispatch('GET_PUBLIC_PROJECT', {
    params: {
      where: {
        status: [ PROJECT_STATUS.WIP, PROJECT_STATUS.DONE, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      slugs: [ proj_slug, ],
    },
  })
}
const fetchReportsList = (store, {
  max_result = 10,
  proj_ids = [],
  sort = '-updated_at',
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      project_id: proj_ids,
      where: {
        publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
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
    curr_ref () {
      return get(this.$route, 'params.slug')
    },
    jobs () {
      const jobs = []

      /**
       * check what type of posts is it gonna fetch by route.
       */
      switch (this.route) {
        case 'series':
          /**
           * make sure the project id is legal.
           */
          jobs.push(fetchProjectSingle(this.$store, this.curr_ref).then((proj) => {
            console.log('proj', proj)
            this.currRefId = get(proj, 'id')
            if (proj) {
              return Promise.all([
                Promise.all([
                  fetchMemos(this.$store, {
                    mode: this.currPage === 1 ? 'set' : 'update',
                    proj_ids: [ this.currRefId, ],
                    page: this.currPage,
                  }),
                  fetchReportsList(this.$store, {
                    proj_ids: [ this.currRefId, ], 
                    page: this.currPage,  
                  }),
                ]).then(() => { this.currPage += 1 }),
                get(this.$route, 'params.subItem')
                  ? fetchMemoSingle(this.$store, get(this.$route, 'params.subItem'))
                  : Promise.resolve(),
              ])
            } else {
              /**
              * Forbidden.
              */
              this.isLoadMoreEnd = true
              this.$router.push('/')
              return
            }
          }))
          break
      }
      return jobs
    },
    jobsLoadmore () {
      const jobs = []
      switch (this.route) {
        case 'series':
          jobs.push(fetchMemos(this.$store, {
            mode: 'update',
            proj_ids: [ this.currRefId, ],
            page: this.currPage,
          }).then(res => {
            this.currPage += 1
            debug('Loadmore done. Status', get(res, 'status'))                  
            if (get(res, 'status') === 'end') {
              this.isLoadMoreEnd = true
            }                  
          }))
          break
      }
      return jobs      
    },
    posts () {
      switch (this.route) {
        case 'series':
          return sortBy(union(get(this.$store, 'state.memos', []), get(this.$store, 'state.publicReports', [])), [ p => -moment(p.publishedAt), ])
        default:
          return get(this.$store, `state.${this.targState}`)
      }
    },
    postSingle () {
      switch (this.route) {
        case 'series':
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
        case 'series':
          targ_state = 'series'
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
      currRefId: 0,
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
      return Promise.all(this.jobsLoadmore).then(() => {
        // this.shouldShowSpinner = false
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
    '$route' (to, from) {
      debug('Mutation detected: $route', to, from)
    },
    curr_ref () {
      debug('Mutation detected: curr_ref')
      this.currPage = DEFAULT_PAGE,
      Promise.all(this.jobs)
    },
  },
}
</script>
<style lang="stylus" scoped></style>