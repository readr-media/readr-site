<template>
  <div class="homepage">
    <BaseLightBox v-show="showLightBox" @closeLightBox="closeLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="postLightBox"/>
    </BaseLightBox>
    <div class="homepage__container">
      <aside class="homepage__aside">
        <AppAsideNav></AppAsideNav>
      </aside>
      <main class="homepage__main">
        <div class="homepage__list-main">
          <div class="invitation">
            <Invite></Invite>
          </div>
          <transition-group name="fade" mode="out-in">
            <HomeArticleMain v-for="post in postsMain" :articleData="post" :key="`${post.id}-main`"/>
          </transition-group>
        </div>
        <div class="homepage__list-aside">
          <AppTitledList :listTitle="'議題'">
            <ul class="aside-list-container">
              <HomeProjectAside/>
            </ul>
          </AppTitledList>
          <AppTitledList :listTitle="this.$route.path !== '/hot' ? '焦點' : '視角'">
            <ul class="aside-list-container">
              <transition-group name="fade" mode="out-in">
                <HomeArticleAside v-for="post in postsAside" :articleData="post" :key="`${post.id}-aside`"/>
              </transition-group> 
            </ul>
          </AppTitledList>
        </div>
      </main>
    </div>
  </div>   
</template>

<script>
import { isScrollBarReachBottom, isCurrentRoutePath, } from 'src/util/comm'
import _ from 'lodash'
import AppAsideNav from 'src/components/AppAsideNav.vue'
import AppTitledList from 'src/components/AppTitledList.vue'
import HomeProjectAside from 'src/components/home/HomeProjectAside.vue'
import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
import HomeArticleAside from 'src/components/home/HomeArticleAside.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
import Invite from 'src/components/invitation/Invite.vue'

const fetchPost = (store, { id, }) => {
  return store.dispatch('GET_POST', {
    params: {
      id: id,
    },
  })
}
const fetchPosts = (store, { mode, category, max_result, page, sort, where, }) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      mode: mode,
      category: category,
      max_result: max_result,
      page: page,
      sort: sort,
      where: where,
    },
  })
}
const fetchProjectsList = (store, { max_result, }) => {
  return store.dispatch('GET_PROJECTS_LIST', {
    params: {
      max_result: max_result,
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

export default {
  asyncData ({ store, route, }) {
    let reqs = [
      fetchPosts(store, {
        mode: 'set',
        category: 'latest',
        max_result: 20,
        page: 1,
        sort: '-updated_at',
      }),
      fetchPosts(store, {
        mode: 'set',
        category: 'hot',
        sort: '-updated_at',
      }),
      fetchProjectsList(store, {
        max_result: 1,
      }),
    ]

    if (route.params.postId) {
      reqs.push(fetchPost(store, { id: route.params.postId, }))
    }

    return Promise.all(reqs)

  },
  metaInfo () {
    if (this.$route.params.postId) {
      return {
        ogTitle: this.postSingle.ogTitle,
        description: this.postSingle.ogDescription,
        metaUrl: this.$route.path,
        metaImage: this.postSingle.ogImage,
      }
    } else {
      if (this.$route.path === '/') {
        return {
          ogTitle: '視角',
        }
      } else if (this.$route.path === '/hot') {
        return {
          ogTitle: '焦點',
        }
      }
    }
  },
  components: {
    AppAsideNav,
    AppTitledList,
    HomeProjectAside,
    HomeArticleMain,
    HomeArticleAside,
    BaseLightBox,
    BaseLightBoxPost,
    Invite,
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
        const findPostInList = _.find(this.postsHome, [ 'id', Number(this.$route.params.postId), ])
        return findPostInList || this.postSingle
      } else {
        return {}
      }
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
        max_result: 20,
        page: this.currentPageLatest + 1,
        sort: '-updated_at',
      }).then((res) => {
        this.currentPageLatest += 1
        if (this.$store.state.isLoggedIn) {
          const ids = res.items.map(post => `${post.id}`)
          fetchFollowing(this.$store, {
            mode: 'update',
            resource: 'post',
            ids: ids,
          })
        }
      })
      .catch((res) => {
        if (res === 'end') {
          this.endPage = true
        } else {
          console.log(res)
        }
      })
    },
    isScrollBarReachBottom,
  },
  beforeMount () {
    if (this.$store.state.isLoggedIn) {
      const postIdsLatest = this.$store.state.publicPosts.items.map(post => `${post.id}`)
      const postIdsHot = this.$store.state.publicPostsHot.items.map(post => `${post.id}`)
      const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => `${project.id}`)
      const ids = _.uniq(_.concat(postIdsLatest, postIdsHot))
      fetchFollowing(this.$store, {
        resource: 'post',
        ids: ids,
      })
      fetchFollowing(this.$store, {
        resource: 'project',
        ids: postIdFeaturedProject,
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isScrollBarReachBottom()
    })
  },
}
</script>

<style lang="stylus" scoped>
.homepage
  background-color #e6e6e6
  min-height 100vh
  &__container
    max-width 1200px
    margin auto
    padding 25px 0
    display flex
  &__aside
    width 75px
    height 100%
    position sticky
    // position fixed
    top 60px
    z-index 999
  &__main
    flex 1
    margin-left 30px
    margin-right 30px
    display flex
    justify-content flex-end
    align-items flex-start
  &__list-main
    max-width 650px
  &__list-aside
    margin-left 35px
    .aside-list-container
      margin 0
      padding 0
    section
      &:nth-child(2)
        margin-top 10px
</style>