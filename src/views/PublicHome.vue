<template>
  <div class="homepage">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"/>
    </BaseLightBox>
    <div class="homepage__container">
      <div class="homepage__list-main">
        <div class="invitation">
          <Invite></Invite>
        </div>
        <transition-group name="fade" mode="out-in">
          <PostItem v-for="post in postsMain" :post="post" :key="`${post.id}-main`"></PostItem>
        </transition-group>
      </div>
      <div class="homepage__list-aside">
        <AppTitledList v-if="reports.length > 0" class="homepage__report-container" :listTitle="[ $t('SECTIONS.PROJECTS'), $t('SECTIONS.REPORTS') ]">
          <ul class="aside-list-container">
            <HomeReportAside />
          </ul>
        </AppTitledList>
        <AppTitledList v-if="memos.length > 0" class="homepage__project-container" :listTitle="[ $t('SECTIONS.PROJECTS'), $t('SECTIONS.MEMOS')]">
          <template v-for="memo in memos">
            <MemoFigure :key="memo.id" :memo="memo"></MemoFigure>
          </template>
        </AppTitledList>
        <AppNavExternalLinks/>
        <!-- <AppTitledList :listTitle="this.$route.path !== '/hot' ? $t('SECTIONS.HOT_TALK') : $t('SECTIONS.CHIEF_EDITOR_TALK')">
          <ul class="aside-list-container">
            <transition-group name="fade" mode="out-in">
              <HomeArticleAside v-for="post in postsAside" :articleData="post" :key="`${post.id}-aside`"/>
            </transition-group> 
          </ul>
        </AppTitledList> -->
      </div>
    </div>
  </div>   
</template>

<script>
import { MEMO_PUBLISH_STATUS, POINT_OBJECT_TYPE, REPORT_PUBLISH_STATUS, } from '../../api/config'
import { currEnv, isScrollBarReachBottom, isElementReachInView, isCurrentRoutePath, } from 'src/util/comm'
import _ from 'lodash'
import { createStore, } from '../store'
import AppTitledList from 'src/components/AppTitledList.vue'
import AppNavExternalLinks from 'src/components/AppNavExternalLinks.vue'
import HomeReportAside from 'src/components/home/HomeReportAside.vue'
import HomeArticleAside from 'src/components/home/HomeArticleAside.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import Invite from 'src/components/invitation/Invite.vue'
import PostItem from 'src/components/post/PostItem.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'

const debug = require('debug')('CLIENT:Home')

const MAXRESULT_MEMOS = 3
const MAXRESULT_POSTS = 10
const MAXRESULT_REPORTS = 4
// const MAXRESULT_VIDEOS = 1
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-published_at'
const DEFAULT_CATEGORY = 'latest'

const fetchMemos = (store, {
  max_result = MAXRESULT_MEMOS,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_MEMOS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
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
        publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchPointHistories = (store, { objectIds, objectType, }) => {
  return store.dispatch('GET_POINT_HISTORIES', {
    params: {
      memberId: _.get(store, [ 'state', 'profile', 'id', ]),
      objectType: objectType,
      objectIds: objectIds,
    },
  })
}

const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', params)
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
  }
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
    HomeReportAside,
    HomeArticleAside,
    BaseLightBox,
    BaseLightBoxPost,
    Invite,
    MemoFigure,
    PostItem,
  },
  watch: {
    isReachBottom(isReachBottom) {
      if (isReachBottom && !this.endPage && this.$route.path !== '/hot') {
        this.loadmoreLatest()
      }
    },
    '$route' (to, from) {
      this.articlesListMainCategory = this.isCurrentRoutePath('/post/:postId') ? from.path : to.path
    },
    postLightBox () {
      debug('Mutation detected: postLightBox', this.postLightBox)
    },
    postSingle () {
      debug('Mutation detected: postSingle', this.postSingle)
    },
  },
  data () {
    return {
      isReachBottom: false,
      currentPageLatest: 1,
      endPage: false,
      articlesListMainCategory: this.$route.path !== '/hot' ? '/' : '/hot',
    } 
  },
  computed: {
    currEnv,
    isClientSide () {
      return _.get(this.$store, 'state.isClientSide', false)
    },
    memos () {
      return _.get(this.$store.state, 'publicMemos', [])
    },
    postsLatest () {
      return _.get(this.$store.state.publicPosts, 'items', [])
    },
    postsHot () {
      return _.get(this.$store.state.publicPostsHot, 'items', [])
    },
    postsHome () {
      return _.unionBy(this.postsLatest, this.postsHot, 'id', [])
    },
    postSingle () {
      return _.get(this.$store.state.publicPostSingle, 'items[0]', {})
    },
    postsMain () {
      return this.articlesListMainCategory !== '/hot' ? this.postsLatest : this.postsHot
    },
    postsAside () {
      return this.articlesListMainCategory !== '/hot' ? this.postsHot : this.postsLatest
    },
    postLightBox () {
      if (this.showLightBox) {
        debug('Going to show lightbox of content for post', _.get(this.$route, 'params.postId'))
        const findPostInList = _.find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
        debug('findPostInList', findPostInList)
        debug('this.postSingle', this.postSingle)
        return findPostInList || this.postSingle
      } else {
        return {}
      }
    },
    reports () {
      return _.get(this.$store, [ 'state', 'publicReports', ], [])
    },
    showLightBox () {
      return this.isCurrentRoutePath('/post/:postId')
    },
  },
  name: 'Home',
  methods: {
    closeLightBox () {
      this.$router.push(this.articlesListMainCategory)
    },
    isCurrentRoutePath,
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
            const ids = res.items.map(post => `${post.id}`)
            fetchFollowing(this.$store, {
              mode: 'update',
              resource: 'post',
              ids: ids,
            })
          }
        }
      })
    },
    isScrollBarReachBottom,
    isElementReachInView,
  },
  beforeRouteEnter (to, from, next) {
    const store = createStore()
    debug('Hook: beforeRouteEnter', 'postId' in to.params)
    debug(to)
    pageJump({ store, to, next, })
  },
  beforeRouteUpdate (to, from, next) {
    debug('Hook: beforeRouteUpdate', 'postId' in to.params)
    pageJump({ store: this.$store, to, next, })
  },
  beforeMount () {
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
    Promise.all(reqs).then(() => {
      if (this.$store.state.isLoggedIn) {
        const postIdsLatest = _.get(this.$store.state.publicPosts, 'items', []).map(post => `${post.id}`) 
        const postIdsHot = _.get(this.$store.state.publicPostsHot, 'items', []).map(post => `${post.id}`) 
        // const reportIds = _.get(this.$store.state, 'publicReports', []).map(report => `${report.id}`)
        const ids = _.uniq(_.concat(postIdsLatest, postIdsHot))
        const projectIds = _.uniq(_.get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))
        if (ids.length !== 0) { 
          fetchFollowing(this.$store, { 
            resource: 'post', 
            ids: ids, 
          }) 
        } 
   
        // if (reportIds.length !== 0) { 
        //   fetchFollowing(this.$store, { 
        //     resource: 'report', 
        //     ids: reportIds, 
        //   })
        // }
        if (projectIds.length !== 0) {
          fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
        }
      }
    })
    // Uncomment this when v1.0 is released
    // if (this.$store.state.isLoggedIn) {
    //   const postIdsLatest = _.get(this.$store.state.publicPosts, 'items', []).map(post => `${post.id}`) 
    //   const postIdsHot = _.get(this.$store.state.publicPostsHot, 'items', []).map(post => `${post.id}`) 
    //   const postIdFeaturedProject = _.get(this.$store.state.projectsList, 'items', []).map(project => `${project.id}`) 
    //   const ids = _.uniq(_.concat(postIdsLatest, postIdsHot)) 
  
    //   if (ids.length !== 0) { 
    //     fetchFollowing(this.$store, { 
    //       resource: 'post', 
    //       ids: ids, 
    //     }) 
    //   } 
  
    //   if (postIdFeaturedProject.length !== 0) { 
    //     fetchFollowing(this.$store, { 
    //       resource: 'project', 
    //       ids: postIdFeaturedProject, 
    //     })
    //   }
    // }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isElementReachInView('.homepage__list-main', 0.5) || this.isScrollBarReachBottom()
    })
  },
}
</script>

<style lang="stylus" scoped>
.homepage
  &__container
    display flex
    justify-content flex-end
    align-items flex-start
  &__list-main
    max-width 650px
    width 650px
  &__list-aside
    margin-left 35px
    flex 1
    .aside-list-container
      margin 0
      padding 0
    section
      &:nth-child(2)
        margin-top 10px
  &__project-container, &__report-container
    >>> .app-titled-list__content
      padding 0
  
</style>