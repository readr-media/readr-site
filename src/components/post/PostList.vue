<template>
  <div class="post-list">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"></BaseLightBoxPost>
    </BaseLightBox>  
    <transition-group name="fade" mode="out-in">
      <PostItem v-for="post in posts" :post="post" :key="`${post.id}-main`" width="650"></PostItem>
    </transition-group>  
  </div>
</template>
<script>
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import PostItem from 'src/components/post/PostItem.vue'
import moment from 'moment'
import { MEMO_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, } from 'api/config'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { find, get, isEqual, sortBy, union, uniqWith, } from 'lodash'

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
        memo_publish_status: [ 2, ],
      },
    },
    mode,
  })
}

const fetchPublicMemos = (store, { 
  max_result = MAXRESULT_POSTS, 
  mode = 'set',
  proj_ids = [],
  sort = DEFAULT_SORT, 
  page = DEFAULT_PAGE,
} = {}) => { 
  return store.dispatch('GET_PUBLIC_MEMOS', { 
    params: { 
      member_id: get(store, 'state.profile.id', -1), 
      project_id: proj_ids,
      max_result: max_result, 
      page,
      where: { 
        memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED, 
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED, 
      }, 
      sort: sort, 
    },
    mode,
  })
}
const fetchMemoSingle = (store, memoId) => {
  return store.dispatch('GET_MEMO', {
    params: {
      member_id: get(store, 'state.profile.id'),
      memoId,
    },
  })
}

const fetchPostAndReportByTag = (store, {
  tagId,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
  sort = '-published_at',
  datetime,
  nextLink,
} = {}) => {
  const time = datetime ? datetime : new Date().toISOString()
  const sortClean = sort.replace('-', '')
  return store.dispatch('GET_POST_REPORT_BY_TAG', {
    tagId,
    params: {
      max_result,
      page,
      sort,
      filter: `pnr:${sortClean}<=${time}`,
    },
    nextLink,
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
        report_publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchFollowing = (store, params) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
}

const fetchEmotion = (store, params) => {
  return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
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
      return get(this.$route, 'params.slug') || get(this.$route, 'params.tagId')
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
                  this.me.id ? fetchMemos(this.$store, {
                    mode: this.currPage === 1 ? 'set' : 'update',
                    proj_ids: [ this.currRefId, ],
                    page: this.currPage,
                  }) : fetchPublicMemos(this.$store, {
                    mode: this.currPage === 1 ? 'set' : 'update',
                    proj_ids: [ this.currRefId, ],
                    page: this.currPage,
                  }),
                  fetchReportsList(this.$store, {
                    proj_ids: [ this.currRefId, ], 
                    page: this.currPage,  
                  }),
                ]).then(() => { this.currPage += 1 }),
                get(this.$route, 'params.subItem')  && get(this.$route, 'params.subItem') !== 'donate'
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
        case 'tag':
          jobs.push(fetchPostAndReportByTag(this.$store, {
            tagId: this.$route.params.tagId,
          }))
          break
      }
      return jobs
    },
    jobsLoadmore () {
      const jobs = []
      switch (this.route) {
        case 'series':
          jobs.push(this.me.id ? fetchMemos(this.$store, {
            mode: 'update',
            proj_ids: [ this.currRefId, ],
            page: this.currPage,
          }).then(res => {
            this.currPage += 1
            debug('Loadmore done. Status', get(res, 'status'))
            const memoIds = res.body.items.map(post => post.id)
            if (memoIds.length > 0) {
              fetchFollowing(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, })
              fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'like', })
              fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'dislike', })
            }          
            if (get(res, 'status') === 'end') {
              this.isLoadMoreEnd = true
            }          
          }) : fetchPublicMemos(this.$store, {
            mode: 'update',
            proj_ids: [ this.currRefId, ],
            page: this.currPage,
          }).then(res => {
            this.currPage += 1
            debug('Loadmore done. Status', get(res, 'status'))
            const memoIds = this.posts.map(post => post.id)
            if (memoIds.length > 0) {
              fetchFollowing(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, })
              fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'like', })
              fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'dislike', })
            }          
            if (get(res, 'status') === 'end') {
              this.isLoadMoreEnd = true
            }
          }))
          break
        case 'tag': {
          const hasMore = get(this.$store, 'state.itemsByTag.links.next.url')
          if (hasMore) {
            jobs.push(fetchPostAndReportByTag(this.$store, {
              nextLink: hasMore,
            }).then(res => {
              this.currPage += 1
              const items = res.body.items || []
              const postIds = items.filter(post => !post.projectId).map(post => post.id)
              const reportIds = items.filter(report => report.projectId).map(report => report.id)
              if (postIds.length > 0) {
                fetchFollowing(this.$store, { resource: 'post', ids: postIds, })
                fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'like', })
                fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'dislike', })
              }
              if (reportIds.length > 0) {
                fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
                fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'like', })
                fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'dislike', })
              }
            }))
          }
          break
        }
      }
      return jobs      
    },
    me () {
      return get(this.$store, 'state.profile', {})
    },
    postsByTag () {
      return get(this.$store, [ 'state', 'postsByTag', 'items', ], [])
    },
    posts () {
      switch (this.route) {
        case 'series':
          return sortBy(union(get(this.$store, this.me.id ? 'state.memos' : 'state.publicMemos', []), get(this.$store, 'state.publicReports', [])), [ p => -moment(p.publishedAt), ])
        case 'tag': {
          return uniqWith(this.$store.state.itemsByTag.items, isEqual)
        }
        default:
          return []
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
      return typeof(get(this.$route, 'params.subItem')) === 'string' && get(this.$route, 'params.subItem') !== 'donate'
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
      if (this.route === 'series') {
        const reportIds = get(this.$store.state, 'publicReports', []).map(report => report.id)
        const memoIds = get(this.$store.state, this.me.id ? 'memos' : 'publicMemos', []).map(memo => memo.id)
        if (reportIds.length > 0) {
          fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
          fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'like', })
          fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'dislike', })
        }
        if (memoIds.length > 0) {
          fetchFollowing(this.$store, { resource: 'memo', ids: memoIds, })
          fetchEmotion(this.$store, { resource: 'memo', ids: memoIds, emotion: 'like', })
          fetchEmotion(this.$store, { resource: 'memo', ids: memoIds, emotion: 'dislike', })
        }
      } else if (this.route === 'tag') {
        const postIds = this.posts.filter(post => !post.projectId).map(post => post.id)
        const reportIds = this.posts.filter(report => report.projectId).map(report => report.id)
        if (postIds.length > 0) {
          fetchFollowing(this.$store, { resource: 'post', ids: postIds, })
          fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'like', })
          fetchEmotion(this.$store, { resource: 'post', ids: postIds, emotion: 'dislike', })
        }
        if (reportIds.length > 0) {
          fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
          fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'like', })
          fetchEmotion(this.$store, { resource: 'report', ids: reportIds, emotion: 'dislike', })
        }
      }
    })
  },   
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isElementReachInView(this.$el, '.post-list', 0.5) || this.isScrollBarReachBottom()
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
