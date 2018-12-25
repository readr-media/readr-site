<template>
  <div class="profile">
    <About v-if="profile" :profile="profile"></About>
    <TabHideProfile v-if="isProfileHide" class="profile__hide-profile"/>
    <Tab v-else class="profile__tab" :tabs="tabsName" :tabCurrIndex.sync="curr_tab">
      <!-- reviews tab -->
      <template :slot="findIndexOf($t('TAB.REVIEW_RECORD'))">
        <div class="profile__main__review">
          <div class="profile__main__review__container">
            <template v-if="postsReview.length <= 0">
              <p class="data-empty-hint" v-text="$t('FOLLOWING.DATA_EMPTY_HINT.PROFILE.review')"></p>
            </template>
            <template v-else>
              <div class="item" v-for="post in postsReview" :key="post.id">
                <div class="datetime"><span v-text="dateDiffFromNow(get(post, 'publishedAt'))"></span></div>
                <PostContent :modifier="'main'" :post="post"></PostContent>
              </div>
            </template>
            <div class="spinner"><Spinner :show="shouldShowSpinner" :height="'100px'"></Spinner></div>
          </div>
        </div>
      </template>
      <!-- news tab -->
      <template :slot="findIndexOf($t('TAB.NEWS_RECORD'))">
        <div class="profile__main__review">
          <div class="profile__main__review__container">
            <template v-if="postsNews.length <= 0">
              <p class="data-empty-hint" v-text="$t('FOLLOWING.DATA_EMPTY_HINT.PROFILE.news')"></p>
            </template>
            <template v-else>
              <div class="item" v-for="post in postsNews" :key="post.id">
                <div class="datetime"><span v-text="dateDiffFromNow(get(post, 'publishedAt'))"></span></div>
                <PostContent :modifier="'main'" :post="post"></PostContent>
              </div>
            </template>
            <div class="spinner"><Spinner :show="shouldShowSpinner" :height="'100px'"></Spinner></div>
          </div>
        </div>
      </template>
      <!-- followings tab -->
      <template :slot="findIndexOf($t('TAB.FOLLOW_RECORD'))">
        <FollowingListInTab :isReachBottom="isReachBottom"></FollowingListInTab>
      </template>
    </Tab>
  </div>
</template>
<script>
  import { POST_TYPE, } from 'api/config'
  import { ROLE_MAP, } from 'src/constants'
  import { concat, find, get, map, uniq, } from 'lodash'
  import { dateDiffFromNow, isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
  import About from 'src/components/member/About.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PostContent from 'src/components/post/PostContent.vue'
  import Tab from 'src/components/Tab.vue'
  import TabHideProfile from 'src/components/TabHideProfile.vue'
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

  const fetchEmotion = (store, params) => {
    return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
  }

  const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      id: id,
      resource: resource,
      resource_type: resourceType,
    })
  }

  const getPosts = (store, {
    mode = 'set',
    maxResult = MAXRESULT,
    outputStateTarget,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  }) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode,
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

  export default {
    name: 'Profile',
    components: {
      About,
      FollowingListInTab,
      PostContent,
      Tab,
      TabHideProfile,
      Spinner,
    },
    asyncData ({ store, route, }) {
      return getMemberPublic(store, {
        id: Number(get(route, 'params.id')),
      })
    },
    metaInfo () {
      return {
        description: get(this.profile, 'description', ''),
        ogTitle: get(this.profile, 'nickname', ''),
        title: get(this.profile, 'nickname', ''),
        metaUrl: this.$route.path,         
      }
    },    
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
        let tabs = [
          { key: 'review', name: this.$t('TAB.REVIEW_RECORD'), },
          { key: 'news', name: this.$t('TAB.NEWS_RECORD'), },
          { key: 'follow', name: this.$t('TAB.FOLLOW_RECORD'), },
        ]
        return tabs
      },
      tabsName () {
        return map(this.tabs, t => t.name)
      },
      profileId () {
        return get(this.$route, 'params.id')
      },
      profile () {
        const profile = get(this.$store, 'state.publicMember', {})
        return get(profile, 'id') == get(this.$route, 'params.id') && profile
      },
      isProfileHide () {
        return get(this.profile, 'hideProfile', false)
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
          debug('Loadmore done. Status', get(res, 'status'), get(res, 'res'))
          if (get(res, 'status') === 200) {
            get(this.curr_page, this.currTabKey)
              && (this.curr_page[ this.currTabKey ] += 1)
          } else if (get(res, 'status') === 'end') {
            this.isLoadMoreEnd[ this.currTabKey ] = true
          }
        })
        .then(() => {
          const postIdsReview = get(this.$store.state.publicPostReview, 'items', []).map(post => post.id)
          const postIdsNews = get(this.$store.state.publicPostNews, 'items', []).map(post => post.id)
          const ids = uniq(concat(postIdsReview, postIdsNews))
          if (ids.length > 0) {
            fetchEmotion(this.$store, { resource: 'post', ids: ids, emotion: 'like', })
            fetchEmotion(this.$store, { resource: 'post', ids: ids, emotion: 'dislike', })
          }
        })
      },
      isElementReachInView,
      isScrollBarReachBottom,
      routeToMemCenter () {
        if (this.isCurrUser) {
          const route = get(find(ROLE_MAP, (r) => (r.key === get(this.$store, 'state.profile.role'))), 'route')
          debug('About to route to member center.', route)
          this.$router.push(`/${route}`)
        }
      },
      findIndexOf(tabName) {
        return this.tabsName.indexOf(tabName)
      },
    },
    beforeMount () {
      if (!this.isProfileHide) {
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
        ])
        .then(() => {
          const postIdsReview = get(this.$store.state.publicPostReview, 'items', []).map(post => post.id)
          const postIdsNews = get(this.$store.state.publicPostNews, 'items', []).map(post => post.id)
          const ids = uniq(concat(postIdsReview, postIdsNews))
          if (ids.length > 0) {
            fetchEmotion(this.$store, { resource: 'post', ids: ids, emotion: 'like', })
            fetchEmotion(this.$store, { resource: 'post', ids: ids, emotion: 'dislike', })
          }
        })
        getUserFollowing(this.$store, { resource: [ 'project', 'tag', ], })
      }
    },
    mounted () {
       debug(`/profile/${this.$route.params.id}`)
      
      /**
       * check if current user owns this profile. If yes, redirect it to member center.
       */
      this.routeToMemCenter()

      window.addEventListener('scroll', () => {
        this.isReachBottom = this.isElementReachInView(this.$el, '.profile > .tab', 0.5) || this.isScrollBarReachBottom()
      })
    },
    destroyed () {
      this.$store.commit('SET_PUBLIC_POSTS', { posts: [], outputStateTarget: 'publicPostReview', })
      this.$store.commit('SET_PUBLIC_POSTS', { posts: [], outputStateTarget: 'publicPostNews', })
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
        if (!this.isReachBottom || this.isLoadMoreEnd[ this.currTabKey ] || this.isProfileHide) { return }
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
    &__hide-profile
      margin-top 35px
    &__tab
      margin-top 35px
      background-color #fff

  .data-empty-hint
    font-size 18px

</style>