<template>
  <div class="profile">
    <About v-if="profile" :profile="profile"></About>
    <Tab class="profile__tab" :tabs="map(tabs, t => t.name)" :tabCurrIndex.sync="curr_tab">
      <template slot="0" v-if="postsReview.length !== 0">
        <div class="profile__main__review">
          <!--div class="profile__main__review__filter">
            <select v-model="filter">
              <option v-text="$t('PROFILE.FILTER_ALL')" value="all"></option>
              <option v-for="item in POST_FILTER" v-text="$t(`PROFILE.${item.name}`)" :value="item.code" :selected="item === filter"></option>
            </select>
          </div-->
          <div class="profile__main__review__container">
            <div class="item" v-for="post in postsReview" :key="post.id">
              <div class="datetime"><span v-text="dateDiffFromNow(get(post, 'publishedAt'))"></span></div>
              <PostContent :modifier="'main'" :post="post"></PostContent>
            </div>
            <div class="spinner"><Spinner :show="shouldShowSpinner" :height="'100px'"></Spinner></div>
          </div>
        </div>
      </template>
      <template :slot="postsReview.length !== 0 ? 1 : 0" v-if="postsNews.length !== 0">
        <div class="profile__main__review">
          <!--div class="profile__main__review__filter">
            <select v-model="filter">
              <option v-text="$t('PROFILE.FILTER_ALL')" value="all"></option>
              <option v-for="item in POST_FILTER" v-text="$t(`PROFILE.${item.name}`)" :value="item.code" :selected="item === filter"></option>
            </select>
          </div-->
          <div class="profile__main__review__container">
            <div class="item" v-for="post in postsNews" :key="post.id">
              <div class="datetime"><span v-text="dateDiffFromNow(get(post, 'publishedAt'))"></span></div>
              <PostContent :modifier="'main'" :post="post"></PostContent>
            </div>
            <div class="spinner"><Spinner :show="shouldShowSpinner" :height="'100px'"></Spinner></div>
          </div>
        </div>
      </template>
      <template slot="2">
        <FollowingListInTab></FollowingListInTab>
      </template>
    </Tab>
  </div>
</template>
<script>
  import { POST_TYPE, } from 'api/config'
  import { ROLE_MAP, } from 'src/constants'
  import { concat, find, get, map, uniq, } from 'lodash'
  import { dateDiffFromNow, isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
  import About from 'src/components/About.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PostContent from 'src/components/post/PostContent.vue'
  import Tab from 'src/components/Tab.vue'
  import Spinner from 'src/components/Spinner.vue'

  const debug = require('debug')('CLIENT:Profile')
  const MAXRESULT = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-published_at,-updated_at'
  const POST_FILTER = [
    { code: 0, name: 'FILTER_1D', },
    { code: 1, name: 'FILTER_1W', },
    { code: 2, name: 'FILTER_1M', },
    { code: 3, name: 'FILTER_3M', },
    { code: 4, name: 'FILTER_6M', },
    { code: 5, name: 'FILTER_1Y', },
    { code: 5, name: 'FILTER_1YPLUS', },
  ]

  const getFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', params)
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
    }
  }

  const getPosts = (store, {
    mode = 'set',
    category = 'latest',
    maxResult = MAXRESULT,
    outputStateTarget,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  }) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode,
        category,
        max_result: maxResult,
        page,
        sort,
        where,
      },
      outputStateTarget,
    })
  }

  const getMemberPublic = (store, params) => {
    return store.dispatch('GET_PUBLIC_MEMBER', {
      params: params,
    })
  }

  // const getPostsCount = (store, params = {}) => {
  //   return store.dispatch('GET_POSTS_COUNT', {
  //     params: params,
  //   })
  // }

  export default {
    name: 'Profile',
    components: {
      About,
      FollowingListInTab,
      PostContent,
      Tab,
      Spinner,
    },
    // Uncomment this when v1.0 is released
    // asyncData ({ store, route, }) {
    //   debug('profileId', get(route, 'params.id'))
    //   return Promise.all([
    //     getPosts(store, {
    //       where: {
    //         author: get(route, 'params.id'),
    //         type: POST_TYPE.REVIEW,
    //       },
    //     }),
    //     getPostsCount(store, {
    //       where: {
    //         author: get(route, 'params.id'),
    //         type: POST_TYPE.REVIEW,
    //       },
    //     }),
    //     getMemberPublic(store, {
    //       id: get(route, 'params.id'),
    //     }),
    //   ])
    // },
    computed: {
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      currTabKey () {
        return get(this.tabs, [ this.curr_tab, 'key', ], 'follow')
      },
      isCurrUser () {
        debug('currUser', this.currUser)
        debug('targUser', get(this.$route, 'params.id'))
        return get(this.$store, 'state.profile.id') == (get(this.$route, 'params.id'))
      },
      postsReview () {
        return get(this.$store, 'state.publicPostReview.items') || []
      },
      postsNews () {
        return get(this.$store, 'state.publicPostNews.items') || []
      },
      tabs () {
        let tabs = []
        if (this.postsReview.length !== 0) tabs.push({ key: 'review', name: this.$t('tab.WORDING_TAB_REVIEW_RECORD'), })
        if (this.postsNews.length !== 0) tabs.push({ key: 'news', name: this.$t('tab.WORDING_TAB_NEWS_RECORD'), })
        tabs.push({ key: 'follow', name: this.$t('tab.WORDING_TAB_FOLLOW_RECORD'), })
        return tabs
      },
      profileId () {
        return get(this.$route, 'params.id')
      },
      profile () {
        const profile = get(this.$store, 'state.publicMember', {})
        return get(profile, 'id') == get(this.$route, 'params.id') && profile
      },
    },
    data () {
      return {
        POST_FILTER,
        curr_tab: 0,
        curr_page: {
          review: DEFAULT_PAGE,
          news: DEFAULT_PAGE,
          follow: DEFAULT_PAGE,
        },
        filter: 'all',
        isLoadMoreEnd: {
          review: false,
          news: false,
          follow: false,
        },
        isReachBottom: false,
        shouldShowSpinner: false,
      }
    },
    methods: {
      dateDiffFromNow,
      get,
      loadmore () {
        this.shouldShowSpinner = true
        debug(`this.tabs[ this.curr_tab ]`, this.tabs[ this.curr_tab ], this.currTabKey)
        /**
         * dont loadmore follow for now
         */
        if (get(this.tabs, [ this.curr_tab, 'key', ], 1) === 'follow') { return }
        return getPosts(this.$store, {
          mode: 'update',
          page: get(this.curr_page, this.currTabKey, 1) + 1,
          outputStateTarget: this.currTabKey === 'review' ? 'publicPostReview' : 'publicPostNews',
          where: {
            author: Number(get(this.$route, 'params.id')),
            type: [ this.currTabKey === 'review' ? POST_TYPE.REVIEW : POST_TYPE.NEWS, ],
          },
        }).then((res) => {
          this.shouldShowSpinner = false
          debug('Loadmore done. Status', get(res, [ 0, 'status', ]), get(res, [ 0, 'res', ]))
          if (get(res, [ 0, 'status', ]) === 200) {
            // if (this.$store.state.isLoggedIn) {
            //   const ids = res.items.map(post => `${post.id}`)
            //   fetchFollowing(this.$store, {
            //     mode: 'update',
            //     resource: 'post',
            //     ids: ids,
            //   })
            // }
            get(this.curr_page, this.currTabKey)
              && (this.curr_page[ this.currTabKey ] += 1)
          } else if (get(res, [ 0, 'status', ]) === 'end') {
            this.isLoadMoreEnd[ this.currTabKey ] = true
          }
        })
      },
      isElementReachInView,
      isScrollBarReachBottom,
      map,
      routeToMemCenter () {
        if (this.isCurrUser) {
          const route = get(find(ROLE_MAP, (r) => (r.key === get(this.$store, 'state.profile.role'))), 'route')
          debug('About to route to member center.', route)
          this.$router.push(`/${route}`)
        }
      },
    },
    beforeRouteUpdate (to, from, next) {
      // Beta version code
      Promise.all([
        getPosts(this.$store, {
          outputStateTarget: 'publicPostReview',
          where: {
            author: Number(get(to, 'params.id')),
            type: [ POST_TYPE.REVIEW, ],
          },
        }),
        getPosts(this.$store, {
          outputStateTarget: 'publicPostNews',
          where: {
            author: Number(get(to, 'params.id')),
            type: [ POST_TYPE.NEWS, ],
          },
        }),
        // getPostsCount(this.$store, {
        //   where: {
        //     author: get(to, 'params.id'),
        //     type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ],
        //   },
        // }),
        getMemberPublic(this.$store, {
          id: Number(get(to, 'params.id')),
        }),
      ]).then(() => {
        if (this.$store.state.isLoggedIn) {
          const postIdsReview = get(this.$store, 'state.publicPostNews.items', []).map(post => `${post.id}`) 
          const postIdsNews = get(this.$store, 'state.publicPostReview.items', []).map(post => `${post.id}`) 
          const ids = uniq(concat(postIdsReview, postIdsNews))
          
          if (ids.length !== 0) { 
            getFollowing(this.$store, { 
              resource: 'post', 
              ids: ids, 
            }) 
          } 
        }
        next()
      })      
    },
    beforeMount () {
      // Beta version code
      Promise.all([
        getPosts(this.$store, {
          outputStateTarget: 'publicPostReview',
          where: {
            author: Number(get(this.$route, 'params.id')),
            type: [ POST_TYPE.REVIEW, ],
          },
        }),
        getPosts(this.$store, {
          outputStateTarget: 'publicPostNews',
          where: {
            author: Number(get(this.$route, 'params.id')),
            type: [ POST_TYPE.NEWS, ],
          },
        }),
        // getPostsCount(this.$store, {
        //   where: {
        //     author: get(this.$route, 'params.id'),
        //     type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ],
        //   },
        // }),
        getMemberPublic(this.$store, {
          id: Number(get(this.$route, 'params.id')),
        }),
        getFollowing(this.$store, {
          subject: get(this.$route, 'params.id'), resource: 'member',
        }),
      ]).then(() => {
        if (this.$store.state.isLoggedIn) {
          const postIdsReview = get(this.$store, 'state.publicPostNews.items', []).map(post => `${post.id}`) 
          const postIdsNews = get(this.$store, 'state.publicPostReview.items', []).map(post => `${post.id}`) 
          const ids = uniq(concat(postIdsReview, postIdsNews))
          
          if (ids.length !== 0) { 
            getFollowing(this.$store, { 
              resource: 'post', 
              ids: ids, 
            }) 
          } 
        }
      })

    },
    mounted () {
       debug(`/profile/${this.$route.params.id}`)
      
      /**
       * check if current user is belone to this profile. If yes, redirect it to member center.
       */
      this.routeToMemCenter()

      window.addEventListener('scroll', () => {
        this.isReachBottom = this.isElementReachInView('.profile > .tab', 0.5) || this.isScrollBarReachBottom()
      })
    },
    watch: {
      currUser () {
        debug('currUser changed', this.currUser)
        this.routeToMemCenter()
      },
      curr_tab () {
        debug('Mutation detected: curr_tab', this.curr_tab)
        this.filter = 'all'
      },
      filter () {
        debug('Mutation detected: filter', this.filter)
      },
      isReachBottom () {
        debug('Mutation detected: isReachBottom', this.isReachBottom)
        if (!this.isReachBottom || this.isLoadMoreEnd[ this.currTabKey ]) { return }
        this.loadmore()
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .profile
    width 950px
    margin 0 auto
    &__main
      &__review
        padding 0 100px
        &__filter
          margin-bottom 30px
          width 130px
          height 30px
          border solid 1px #d3d3d3

          position relative
          padding 0
          overflow hidden
          background-color #fff
          cursor pointer
          
          &:hover
            padding 0
            border 1px solid rgba(211, 211, 211, 0.5)
            &::before
              opacity 0.5

          &::before
            content ''
            position absolute
            top 0
            right 0
            background-color #fff
            background-repeat no-repeat
            background-position center center
            background-size 7px auto
            background-image url(/public/icons/triangle-grey.png)
            display block
            width 15px
            height 100%
            z-index 1

          > select
            color #808080
            padding 5px 15px 5px 8px
            width 100%
            height 100%
            border none
            box-shadow none
            background-color transparent
            background-image none
            appearance none
            outline none
            cursor pointer
            position relative
            z-index 2
            font-size 0.875rem
        &__container
          .item
            margin 35px auto
          .spinner
            height 80px
            width 100%
            text-align center            
    &__tab
      margin-top 35px
      background-color #fff


</style>