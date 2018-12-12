<template>
  <div class="homepage">
    <BaseLightBox v-show="showLightBox" :showLightBox="showLightBox" :hadRouteBeenNavigate="hadRouteBeenNavigate" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox" />
    </BaseLightBox>
    <div class="homepage__container">
      <TagNavAside class="homepage__tag-nav-aside"/>
      <div class="homepage__list-main">
        <div class="invitation">
        </div>
        <transition-group name="fade" mode="out-in">
          <PostItem
            v-for="post in postsMain"
            :key="`${post.id}-main`"
            :post="post"
            :shouldShowMultipleDate="false"
          />
        </transition-group>
      </div>
      <div class="homepage__list-aside aside-latest-comments">
        <h1 class="aside-latest-comments__title" v-text="$t('homepage.WORDING_HOME_ASIDE_TITLE')"></h1>
        <div class="aside-latest-comments__list">
          <HomeAsideLatestComment
            class="aside-latest-comments__list-item"
            v-for="comment in commentsForHome"
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
import { SITE_FULL, } from 'src/constants'
import { get, uniqBy, find, } from 'lodash'
import { mapState, } from 'vuex'
import { isScrollBarReachBottom, isElementReachInView, isCurrentRoutePath, } from 'src/util/comm'
// import { createStore, } from '../store'
import AppTitledList from 'src/components/AppTitledList.vue'
import AppNavExternalLinks from 'src/components/AppNavExternalLinks.vue'
import HomeAsideReport from 'src/components/home/HomeAsideReport.vue'
import HomeAsideArticle from 'src/components/home/HomeAsideArticle.vue'
import HomeAsideLatestComment from 'src/components/home/HomeAsideLatestComment.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import PostItem from 'src/components/post/PostItem.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import TagNavAside from 'src/components/tag/TagNavAside.vue'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate-html'

const debug = require('debug')('CLIENT:Home')

const MAXRESULT_POSTS = 10
const MAXRESULT_LATEST_COMMENTS = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-published_at'
const DEFAULT_SORT_LATEST_COMMENTS = '-created_at'
const DEFAULT_CATEGORY = 'latest'

const fetchEmotion = (store, params) => {
  return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
}

const fetchPost = (store, { id, isPreview, }) => {
  return store.dispatch('GET_POST', {
    id,
    isPreview,
    params: {
      showAuthor: true,
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
      showAuthor: true,
      sort: sort,
    },
  })
}

const fetchComment = (store, { params = {}, } = {}) => store.dispatch('FETCH_COMMENT_FOR_HOME', {
  params: Object.assign({}, { sort: DEFAULT_SORT_LATEST_COMMENTS, max_result: MAXRESULT_LATEST_COMMENTS, }, params),
})

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

export default {
  name: 'Home',
  asyncData ({ store, route, router, }) {
    const jobs = !get(store, 'state.publicPosts.items.length') ? [
      fetchPosts(store),
      fetchComment(store),
    ] : []
  
    if (get(route, 'params.postId')) {
      jobs.push(fetchPost(store, {
        id: get(route, 'params.postId'),
      }).catch(e => {
        /** Post Not Found */
        debug('Error:', e)
        if (e === 'Not Found') {
          if (!get(store, 'state.publicPostSingle.items.0.ogTitle') && !get(store, 'state.publicPostSingle.items.0.title')) {

            /** If preview, dont redirect to 404 */
            if (get(route, 'query.preview')) { return }

            if (process.browser) {
              router.push('/404')
            } else {
              debug('Going to throw 404 Error')
              const err = new Error()
              err.massage = 'Page Not Found'
              err.code = 404
              throw err  
            }
          }          
        } else {
          const err = new Error()
          err.massage = e
          err.code = 404
          throw err 
        }
      }))
    }
    return Promise.all(jobs)
  },
  metaInfo () {
    if (this.$route.params.postId) {  
      return {
        ogTitle: get(this.postSingle, 'ogTitle') || get(this.postSingle, 'title'),
        description: get(this.postSingle, 'ogDescription') || truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100),
        metaUrl: this.$route.path,
        metaImage: get(this.postSingle, 'ogImage') || `${SITE_FULL}/public/og-image-post.jpg`,
      }
    } else {
      return {
        description: this.$i18n ? this.$t('OG.DESCRIPTION') : '',
        ogTitle: '',
        title: '',
        metaUrl: this.$route.path,
      }

    }
  },
  components: {
    AppTitledList,
    AppNavExternalLinks,
    HomeAsideReport,
    HomeAsideArticle,
    HomeAsideLatestComment,
    BaseLightBox,
    BaseLightBoxPost,
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
    me() {
      getUserFollowing(this.$store, { resource: 'post', })
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
      hadRouteBeenNavigate: false,
    } 
  },
  computed: {
    ...mapState({
      commentsForHome: state => get(state, 'commentsForHome', []),
      me: state => get(state, 'profile', {}),
      postsLatest: state => get(state, 'publicPosts.items', []),
      postSingle: state => get(state, 'publicPostSingle.items.0', {}), // store binding to the post fetched while user visiting /post/:postid
    }),
    postsMain () {
      return this.postsLatest
    },
    postsMainTagIds () {
      return uniqBy(this.postsMain.map(post => post.tags).filter(tags => tags).reduce((all, tags) => all.concat(tags), []), 'id').map(tag => tag.id)
    },
    postLightBox () {
      if (this.showLightBox) {
        debug('Going to show lightbox of content for post', get(this.$route, 'params.postId'))
        const findPostInList = find(this.postsMain, [ 'id', Number(this.$route.params.postId), ])
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
    getEmotion () {
      const postIdsLatest = get(this.$store.state.publicPosts, 'items', []).map(post => post.id)
      if (postIdsLatest.length > 0) {
        fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'like', })
        fetchEmotion(this.$store, { resource: 'post', ids: postIdsLatest, emotion: 'dislike', })
      } 
    },
    loadmoreLatest () {
      fetchPosts(this.$store, {
        mode: 'update',
        category: 'latest',
        max_result: MAXRESULT_POSTS,
        page: this.currentPageLatest + 1,
      }).then(({ status, res, }) => {
        if (status === 'end') {
          this.endPage = true
        } else if (status === 'error') {
          console.log(res)
        } else {
          this.currentPageLatest += 1
          const ids = res.items.map(post => post.id)
          fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'like', })
          fetchEmotion(this.$store, { mode: 'update', resource: 'post', ids: ids, emotion: 'dislike', })
          // if (this.$store.state.isLoggedIn) {
          //   fetchFollowing(this.$store, { mode: 'update', resource: 'post', ids: ids, })
          // }
        }
      })
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (isCurrentRoutePath(to, '/post/:postId') && !isCurrentRoutePath(from, '/') && !isCurrentRoutePath(from, '/about')) {
        vm.hadRouteBeenNavigate = true
      }
      // if (get(vm.$route, 'params.postId') && !get(vm.$route, 'query.preview')) {
      //   if (!get(vm.postSingle, 'ogTitle') && !get(vm.postSingle, 'title')) {
      //     vm.$router.push('/404')
      //   }     
      // }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  beforeMount () {
    getUserFollowing(this.$store, { resource: 'post', })
    if (!get(this.postsLatest, 'length')) {
      fetchPosts(this.$store).then(() => {
        this.getEmotion()
      })
    } else {
      this.getEmotion()
    }
    if (!get(this.commentsForHome, 'length')) {
      fetchComment(this.$store)
    }
    if (get(this.$route, 'params.postId') && get(this.$route, 'query.preview')) {
      fetchPost(this.$store, {
        id: get(this.$route, 'params.postId'),
        isPreview: get(this.$route, 'query.preview'),
      })
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
    justify-content center
    align-items flex-start
  &__list-main
    max-width 540px
    width 540px
    margin 0 0 0 27px
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

@media (max-width 1440px)
  .homepage
    &__container
      padding-right 240px
</style>
