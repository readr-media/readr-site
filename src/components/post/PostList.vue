<template>
  <div class="post-list">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"></BaseLightBoxPost>
    </BaseLightBox>  
    <div class="post-list__items">
      <transition-group name="fade" mode="out-in">
        <PostItem v-for="post in posts" :post="post" :key="`${post.id}-main`" width="650"></PostItem>
      </transition-group>  
    </div>
  </div>
</template>
<script>
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import PostItem from 'src/components/post/PostItem.vue'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { createPost, } from 'src/util/post'
import { find, get, isEqual, uniqWith, } from 'lodash'

const DEFAULT_PAGE = 1
const debug = require('debug')('CLIENT:PostList')

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
    jobsLoadmore () {
      const jobs = []
      switch (this.route) {
        case 'series': {
            let job
            if (this.me.id) {
              job =
                this.fetchProjectContents(this.$store, { mode: 'update', project_id: get(this.projectSingle, 'id', 0), page: this.currPage + 1, })
                .then(res => {
                  this.currPage += 1
                  debug('Loadmore done. Status', get(res, 'status'))

                  if (get(res, 'status') === 'end') {
                    this.isLoadMoreEnd = true
                  } else {
                    const items = get(res, [ 'body', 'items', ], [])
                    this.fetchSeriesPostsResources(items, 'update')
                  }
                })
            } else {
              job = 
                this.fetchPublicProjectContents(this.$store, { mode: 'update', project_id: get(this.projectSingle, 'id', 0), page: this.currPage + 1, })
                .then(res => {
                  this.currPage += 1
                  debug('Loadmore done. Status', get(res, 'status'))

                  if (get(res, 'status') === 'end') {
                    this.isLoadMoreEnd = true
                  } else {
                    const items = get(res, [ 'body', 'items', ], [])
                    this.fetchSeriesPostsResources(items, 'update')
                  }
                })
            }
            jobs.push(job)
          }
          break
        case 'tag': {
          const hasMore = get(this.$store, 'state.itemsByTag.links.next.url')
          if (hasMore) {
            jobs.push(this.fetchPostAndReportByTag(this.$store, {
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
        case 'series': {
          const publicProjectContents = get(this.$store.state, 'publicProjectContents')
          const projectContents = get(this.$store.state, 'projectContents')
          return projectContents.length === 0 ? publicProjectContents : projectContents
        }
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
          return get(this.$store, 'state.memoSingle.id') ? get(this.$store, 'state.memoSingle') : get(this.$store, 'state.publicMemoSingle', {})
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
    projectSingle () {
      return get(this.$store, 'state.publicProjectSingle')
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
      this.shouldShowSpinner = true
      return Promise.all(this.jobsLoadmore).then(() => {
        debug('####')
        debug('####')
        debug('do loadmore done.')
        this.shouldShowSpinner = false
      })
    },
    fetchSeriesPostsResources (postItems, mode = 'set') {
        const posts = postItems.map(item => createPost(item)).map(item => ({ postType: get(item, [ 'processed', 'postType', ], ''), id: item.id, }))
        const reportIds = posts.filter(item => item.postType === 'report').map(item => item.id)
        const memoIds = posts.filter(item => item.postType === 'memo').map(item => item.id)
        if (reportIds.length > 0) {
          // fetchFollowing(this.$store, { resource: 'report', ids: reportIds, })
          fetchEmotion(this.$store, { mode, resource: 'report', ids: reportIds, emotion: 'like', })
          fetchEmotion(this.$store, { mode, resource: 'report', ids: reportIds, emotion: 'dislike', })
        }
        if (memoIds.length > 0) {
          // fetchFollowing(this.$store, { resource: 'memo', ids: memoIds, })
          fetchEmotion(this.$store, { mode, resource: 'memo', ids: memoIds, emotion: 'like', })
          fetchEmotion(this.$store, { mode, resource: 'memo', ids: memoIds, emotion: 'dislike', })
        }
    },
    runJobs () {
      if (this.route === 'series') {
        this.fetchSeriesPostsResources(this.posts, 'update')
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
    },
    isElementReachInView,
    isScrollBarReachBottom, 
  },
  beforeMount () {
    this.runJobs()
  },   
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom
        = this.$el.getBoundingClientRect().bottom < window.innerHeight - 10
        || this.isElementReachInView(this.$el, '.post-list__items', 0.5)
        || this.isScrollBarReachBottom()
    })    
  },
  props: {
    fetchPublicMemos: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchMemos: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchMemoSingle: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchReportsList: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchPostAndReportByTag: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchProjectContents: {
      type: Function,
      default: () => Promise.resolve(),
    },
    fetchPublicProjectContents: {
      type: Function,
      default: () => Promise.resolve(),
    },
  },
  watch: {
    isReachBottom () {
      debug('Mutation detected: isReachBottom', this.isReachBottom, this.isLoadMoreEnd)
      if (!this.isReachBottom || this.isLoadMoreEnd) { return }
      this.loadmore()
    },
    me () {
      this.runJobs()
    },
    '$route' (to, from) {
      debug('Mutation detected: $route', to, from)
    },
    curr_ref () {
      debug('Mutation detected: curr_ref')
      this.currPage = DEFAULT_PAGE
    },
  },
}
</script>
