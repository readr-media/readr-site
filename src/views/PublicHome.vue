<template>
  <div class="homepage">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"/>
    </BaseLightBox>
    <div class="homepage__container">
      <TagNavAside class="homepage__tag-nav-aside"/>
      <div class="homepage__list-main">
        <div class="invitation">
          <Invite></Invite>
        </div>
        <transition-group name="fade" mode="out-in">
          <PostItem v-for="post in postsMain" :post="post" :key="`${post.id}-main`"></PostItem>
        </transition-group>
      </div>
      <div class="homepage__list-aside aside-latest-comments">
        <h1 class="aside-latest-comments__title" v-text="$t('homepage.WORDING_HOME_ASIDE_TITLE')"></h1>
        <div class="aside-latest-comments__list">
          <HomeAsideLatestComment
            class="aside-latest-comments__list-item"
            v-for="comment in latestCommentsList"
            :key="comment.id"
            :comment="comment"
          />
        </div>
        <AppNavExternalLinks/>
      </div>
    </div>
  </div>   
</template>

<script>
import { get, uniqBy, find, unionBy, } from 'lodash'
import { mapState, } from 'vuex'
import { MEMO_PUBLISH_STATUS, REPORT_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { isScrollBarReachBottom, isElementReachInView, isCurrentRoutePath, } from 'src/util/comm'
// import { createStore, } from '../store'
import AppTitledList from 'src/components/AppTitledList.vue'
import AppNavExternalLinks from 'src/components/AppNavExternalLinks.vue'
import HomeAsideReport from 'src/components/home/HomeAsideReport.vue'
import HomeAsideArticle from 'src/components/home/HomeAsideArticle.vue'
import HomeAsideLatestComment from 'src/components/home/HomeAsideLatestComment.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import Invite from 'src/components/invitation/Invite.vue'
import PostItem from 'src/components/post/PostItem.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import TagNavAside from 'src/components/tag/TagNavAside.vue'

const debug = require('debug')('CLIENT:Home')

const MAXRESULT_MEMOS = 3
const MAXRESULT_POSTS = 10
const MAXRESULT_REPORTS = 4
const MAXRESULT_LATEST_COMMENTS = 10
// const MAXRESULT_VIDEOS = 1
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-published_at'
const DEFAULT_SORT_LATEST_COMMENTS = '-created_at'
const DEFAULT_CATEGORY = 'latest'

const fetchEmotion = (store, params) => {
  return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
}

const fetchMemos = (store, {
  max_result = MAXRESULT_MEMOS,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_MEMOS', {
    params: {
      member_id: get(store, 'state.profile.id'),
      max_result: max_result,
      where: {
        memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchPost = (store, { id, }) => {
  return store.dispatch('GET_POST', {
    params: {
      id: id,
    },
  })
}

const fetchPosts = (store, {
  max_result = MAXRESULT_POSTS,
  mode = 'set',
  category = DEFAULT_CATEGORY,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      mode: mode,
      category: category,
      max_result: max_result,
      page: page,
      sort: sort,
    },
  })
}

const fetchReportsList = (store, {
  max_result = MAXRESULT_REPORTS,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      where: {
        report_publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

// const fetchPointHistories = (store, { objectIds, objectType, }) => {
//   return store.dispatch('GET_POINT_HISTORIES', {
//     params: {
//       objectType: objectType,
//       objectIds: objectIds,
//     },
//   })
// }

const fetchComment = (store, { params = {}, } = {}) => store.dispatch('FETCH_COMMENT', {
  params: Object.assign({}, { sort: DEFAULT_SORT_LATEST_COMMENTS, max_result: MAXRESULT_LATEST_COMMENTS, }, params),
})

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

const pageJump = ({ store, to, next, }) => {
  if ('postId' in to.params && to.params.postId) {
    fetchPost(store, { id: to.params.postId, }).then(({ status, }) => {
      if (status === 'error') {
        if (process.browser) {
          next('/404')
        } else {
          const e = new Error()
          e.massage = 'Page Not Found'
          e.code = '404'
          throw e  
        }
      } else {
        next()
      }
    })
  } else {
    next()
  }
}

export default {
  name: 'Home',
  // Uncomment this when v1.0 is released
  // asyncData ({ store, route, }) {
  //   debug('Starting to fetch data by asyncData.')
  //   let reqs = [ 
  //     fetchPosts(store),
  //     fetchPosts(store, { category: 'hot', }),
  //     fetchProjectsList(store, { max_result: 5, status: PROJECT_STATUS.WIP, }),
  //     fetchProjectsList(store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
  //   ] 
  //   if (route.params.postId) {
  //     reqs.push(fetchPost(store, { id: route.params.postId, })) 
  //   }
  //   return Promise.all(reqs)
  // },
  // metaInfo () {
  //   if (this.$route.params.postId) {
  //     return {
  //       ogTitle: this.postSingle.ogTitle,
  //       description: this.postSingle.ogDescription,
  //       metaUrl: this.$route.path,
  //       metaImage: this.postSingle.ogImage,
  //     }
  //   } else {
  //     if (this.$route.path === '/') {
  //       return {
  //         ogTitle: '視角',
  //       }
  //     } else if (this.$route.path === '/hot') {
  //       return {
  //         ogTitle: '焦點',
  //       }
  //     }
  //   }
  // },
  components: {
    AppTitledList,
    AppNavExternalLinks,
    HomeAsideReport,
    HomeAsideArticle,
    HomeAsideLatestComment,
    BaseLightBox,
    BaseLightBoxPost,
    Invite,
    MemoFigure,
    PostItem,
    TagNavAside,
  },
  watch: {
    isReachBottom(isReachBottom) {
      if (isReachBottom && !this.endPage && this.$route.path !== '/hot') {
        this.loadmoreLatest()
      }
    },
    '$route' (to, from) {
      this.articlesListMainCategory = isCurrentRoutePath(this.$route, '/post/:postId') ? from.path : to.path
    },
    postLightBox () {
      debug('Mutation detected: postLightBox', this.postLightBox)
    },
    postSingle () {
      debug('Mutation detected: postSingle', this.postSingle)
    },
    // postsMainTagIds (ids) {
    //   fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
    // },
  },
  data () {
    return {
      isReachBottom: false,
      currentPageLatest: 1,
      endPage: false,
      articlesListMainCategory: this.$route.path !== '/hot' ? '/' : '/hot',
      latestCommentsList: [],
    } 
  },
  computed: {
    ...mapState({
      postsLatest: state => get(state, [ 'publicPosts', 'items', ], []),
      postsHot: state => get(state, [ 'publicPostsHot', 'items', ], []),
      postSingle: state => get(state, [ 'publicPostSingle', 'items', 0, ], []), // store binding to the post fetched while user visiting /post/:postid
      memos: state => get(state, 'publicMemos', []),
      reports: state => get(state, 'publicReports', []),
    }),
    postsHome () {
      return unionBy(this.postsLatest, this.postsHot, 'id', [])
    },
    postsMain () {
      return this.articlesListMainCategory !== '/hot' ? this.postsLatest : this.postsHot
    },
    postsMainTagIds () {
      return uniqBy(this.postsMain.map(post => post.tags).filter(tags => tags).reduce((all, tags) => all.concat(tags), []), 'id').map(tag => tag.id)
    },
    // postsAside () {
    //   return this.articlesListMainCategory !== '/hot' ? this.postsHot : this.postsLatest
    // },
    postLightBox () {
      if (this.showLightBox) {
        debug('Going to show lightbox of content for post', get(this.$route, 'params.postId'))
        const findPostInList = find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
        debug('findPostInList', findPostInList)
        debug('this.postSingle', this.postSingle)
        return findPostInList || this.postSingle
      } else {
        return {}
      }
    },
    showLightBox () {
      return isCurrentRoutePath(this.$route, '/post/:postId')
    },
  },
  methods: {
    closeLightBox () {
      this.$router.push(this.articlesListMainCategory)
    },
    loadmoreLatest () {
      fetchPosts(this.$store, {
        mode: 'update',
        category: 'latest',
        max_result: MAXRESULT_POSTS,
        page: this.currentPageLatest + 1,
        sort: '-published_at',
      }).then(({ status, res, }) => {
        if (status === 'end') {
          this.endPage = true
        } else if (status === 'error') {
          console.log(res)
        } else {
          this.currentPageLatest += 1
          if (this.$store.state.isLoggedIn) {
            const ids = res.items.map(post => post.id)
            // fetchFollowing(this.$store, { mode: 'update', resource: 'post', ids: ids, })
            fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'like', })
            fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'dislike', })
          }
        }
      })
    },
  },
  beforeRouteEnter (to, from, next) {
    // const store = createStore()
    debug('Hook: beforeRouteEnter', 'postId' in to.params)
    debug(to)
    // pageJump({ store, to, next, })
    next()
  },
  beforeRouteUpdate (to, from, next) {
    debug('Hook: beforeRouteUpdate', 'postId' in to.params)
    pageJump({ store: this.$store, to, next, })
  },
  beforeMount () {

    const process = () => {
      // Beta version code
      let reqs = [
        fetchMemos(this.$store),
        fetchPosts(this.$store),
        fetchPosts(this.$store, { category: 'hot', }),
        fetchReportsList(this.$store),
      ]
      if (this.$route.params.postId) {
        reqs.push(fetchPost(this.$store, { id: this.$route.params.postId, })) 
      }
      Promise.all(reqs)

      fetchComment(this.$store)
      .then((comments) => {
        this.latestCommentsList = comments
      })

      getUserFollowing(this.$store, { resource: 'post', })
    }
  
    if (get(this.$route, 'params.postId')) {
      fetchPost(this.$store, { id: get(this.$route, 'params.postId'), }).then(({ status, }) => {
        if (status === 'error') {
          if (process.browser) {
            this.$router.push('/404')
          } else {
            const e = new Error()
            e.massage = 'Page Not Found'
            e.code = '404'
            throw e  
          }
        } else {
          process()
        }
      })  
    } else {
      process()
    }
  },
  mounted () {
    window.onscroll = () => {
      this.isReachBottom = isElementReachInView(this.$el, '.homepage__list-main', 0.5) || isScrollBarReachBottom()
    }
  },
}
</script>

<style lang="stylus" scoped>
.homepage
  &__container
    display flex
    justify-content flex-start
    align-items flex-start
  &__tag-nav-aside
    position sticky
    top 57.5px
  &__list-main
    max-width 650px
    width 650px
    margin 0 0 0 3px
  &__list-aside
    // margin-left 35px
    flex 1
    position fixed
    top 35px
    right 0
    height calc(100vh - 35px)
    background-color white
    overflow-y scroll
  &__project-container, &__report-container
    >>> .app-titled-list__content
      padding 0

.aside-latest-comments
  width 240px
  padding 20px
  &__title
    font-size 18px
    font-weight 600
    margin 0 0 5px 0
</style>