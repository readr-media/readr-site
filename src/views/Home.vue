<template>
  <div class="homepage">
    <!-- <app-header :sections="sections"></app-header> -->
    <!-- <div class="celebrities-talk block">
      <div class="block__title"><h2 v-text="sections[ 'celebrities-talk' ]"></h2></div>
      <div class="block__content">
        <div :style="{ width: '100%', height: '213px', backgroundColor: 'black' }"></div>
      </div>
    </div>
    <div class="hot-talk block">
      <div class="block__title"><h2 v-text="sections[ 'hot-talk' ]"></h2></div>
      <div class="block__content">
        <div class="block__content__item" v-for="n in 3">
          <div class="block__content__item__left">
            <div class="thumbnail">
              <img src="/public/icons/account.png">
            </div>
          </div>
          <div class="block__content__item__right">
            <div class="name"><span v-text="'某總編'"></span></div>
            <div class="title"><h3 v-text="'台北不是我的家！？租屋黑市大揭露'"></h3></div>
            <div class="content"><p v-text="'根據線上訂餐服務「Seamless」的數據顯示，美國大學生期末考期間購買高熱量食物......'"></p></div>
            <div class="info"></div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="homepage__container">
      <aside class="homepage__aside">
        <AppAsideNav/>
      </aside>
      <main class="homepage__main">
        <div class="homepage__list-main">
          <HomeArticleMain v-for="post in postsLatest" :articleData="post" :key="post.id"/>
        </div>
        <div class="homepage__list-aside">
          <AppTitledList :listTitle="'議題'">
            <HomeProjectAside/>
          </AppTitledList>
          <AppTitledList :listTitle="'焦點'">
            <HomeArticleAside v-for="post in postsHot" :articleData="post" :key="post.id"/> 
          </AppTitledList>
        </div>
      </main>
    </div>
  </div> 
  
</template>
<script>
  // import { SECTIONS_DEFAULT } from '../constants'
  import { removeToken } from '../util/services'
  import { isScrollBarReachBottom } from '../util/comm'
  // import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import AppTitledList from '../components/AppTitledList.vue'
  import HomeProjectAside from '../components/home/HomeProjectAside.vue'
  import HomeArticleMain from '../components/home/HomeArticleMain.vue'
  import HomeArticleAside from '../components/home/HomeArticleAside.vue'

  const fetchPosts = (store, { mode, category, max_result, page, sort }) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode: mode,
        category: category,
        max_result: max_result,
        page: page,
        sort: sort
      }
    })
  }
  const fetchProjectsList = (store, { max_result }) => {
    return store.dispatch('GET_PROJECTS_LIST', {
      params: {
        max_result: max_result
      }
    })
  }
  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', {
        subject: params.subject,
        resource: params.resource
      })
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
        resource: params.resource,
        ids: params.ids
      })
    }
  }

  export default {
    components: {
      // 'app-header': AppHeader,
      AppAsideNav,
      AppTitledList,
      HomeProjectAside,
      HomeArticleMain,
      HomeArticleAside
    },
    watch: {
      isReachBottom(isReachBottom) {
        if (isReachBottom) {
          this.loadmoreLatest()
        }
      }
    },
    data () {
      return {
        isReachBottom: false,
        currentPageLatest: 1
      } 
    },
    computed: {
      // sections () {
      //   return SECTIONS_DEFAULT
      // }
      postsLatest () {
        return this.$store.state.publicPosts.items
      },
      postsHot () {
        return this.$store.state.publicPostsHot.items
      }
    },
    name: 'Home',
    methods: {
      logout () {
        removeToken()
      },
      loadmoreLatest () {
        fetchPosts(this.$store, { mode: 'update', max_result: 10, page: this.currentPageLatest + 1 })
        .then((res) => {
          this.currentPageLatest += 1
          if (this.$store.state.isLoggedIn) {
            const ids = res.items.map(post => post.id)
            fetchFollowing(this.$store, {
              mode: 'update',
              resource: 'post',
              ids: ids
            })
          }
        })
        .catch((res) => {
          if (res === 'not found') {
            console.log('auto loadmore reach the end')
          }
        })
      },
      isScrollBarReachBottom
    },
    beforeMount () {
      // console.log('currentUser', currentUser())
      // console.log('isLoggedIn', isLoggedIn())
      Promise.all([
        fetchPosts(this.$store, {
          mode: 'set',
          category: 'latest',
          max_result: 10,
          page: this.currentPageLatest,
          sort: '-updated_at'
        }),
        fetchPosts(this.$store, {
          mode: 'set',
          category: 'hot',
          max_result: 5,
          page: 1,
          sort: '-updated_at'
        }),
        fetchProjectsList(this.$store, {
          max_result: 1
        })
      ]).then(() => {
        if (this.$store.state.isLoggedIn) {
          const postIdsLatest = this.$store.state.publicPosts.items.map(post => post.id)
          const postIdsHot = this.$store.state.publicPostsHot.items.map(post => post.id)
          const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => project.id)
          const ids = _.uniq(_.concat(postIdsLatest, postIdsHot))
          fetchFollowing(this.$store, {
            resource: 'post',
            ids: ids
          })
          fetchFollowing(this.$store, {
            resource: 'project',
            ids: postIdFeaturedProject
          })
        }
      })
    },
    mounted () {
      window.addEventListener('scroll', () => {
        this.isReachBottom = this.isScrollBarReachBottom()
      })
    }
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
      margin-left 30px
      display flex
      justify-content flex-start
      align-items flex-start
    &__list-main
      max-width 650px
    &__list-aside
      section
        &:nth-child(2)
          margin-top 10px
    .block
      padding 0 17px
      margin 20px auto
      &__title
        h2
          font-size 0.9375rem
          font-weight 600
          color #000
          letter-spacing 3px
      &__content
        &__item
          display flex
          border-bottom solid 1px #979797
          padding 9px 0
          &__left
            .thumbnail
              width 65px
              height 65px
              border-radius 50%
              overflow hidden
              > img
                width 100%
                height 100%
                object-fit contain
                object-position center center
          &__right
            padding-left 10px
            .name
              font-size 0.85rem
              font-weight 500
            .title
              h3
                font-size 0.9375rem
                margin 8px 0
                font-weight 400
            .content
              font-size 0.85rem
              line-height 1.125rem
              font-weight 300

</style>