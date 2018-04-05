<template>
  <div class="profile">
    <aside class="profile__aside">
      <AppAsideNav></AppAsideNav>
    </aside>
    <main class="profile__main">
      <About :profile="profile"></About>
      <Tab :tabs="tabs" @changeTab="tabHandler">
        <template slot="0">
          <div class="profile__main__review">
            <div class="profile__main__review__filter">
              <select @change="filterChanged">
                <option v-text="$t('profile.WORDING_PROFILE_FILTER_ALL')" value="all"></option>
                <option v-for="item in filters" v-text="item" :value="item"></option>
              </select>
            </div>
            <div class="profile__main__review__container">
              <div class="item" v-for="post in posts" :key="post.id">
                <PostContent :post="post"></PostContent>
              </div>
            </div>
          </div>
        </template>
      </Tab>
    </main>
  </div>
</template>
<script>
  import { POST_TYPE, } from 'api/config'
  import { ROLE_MAP, } from 'src/constants'
  import { find, filter, get, map, } from 'lodash'
  import About from 'src/components/About.vue'
  import AppAsideNav from 'src/components/AppAsideNav.vue'
  import PostContent from 'src/components/PostContent.vue'
  import Tab from 'src/components/Tab.vue'
  import moment from 'moment'

  const debug = require('debug')('CLIENT:Profile')
  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const getPosts = (store, {
    mode = 'set',
    category = 'latest',
    maxResult = MAXRESULT,
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
    })
  }

  const getMemberPublic = (store, params) => {
    return store.dispatch('GET_PUBLIC_MEMBER', {
      params: params,
    })
  }

  const getPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params,
    })
  }

  export default {
    name: 'Profile',
    components: {
      About,
      AppAsideNav,
      PostContent,
      Tab,
    },
    asyncData ({ store, route, }) {
      debug('profileId', get(route, 'params.id'))
      return Promise.all([
        getPosts(store, {
          where: {
            author: get(route, 'params.id'),
            type: POST_TYPE.REVIEW,
          },
        }),
        getPostsCount(store, {
          where: {
            author: get(route, 'params.id'),
            type: POST_TYPE.REVIEW,
          },
        }),
        getMemberPublic(store, {
          id: get(route, 'params.id'),
        }),
      ])
    },
    computed: {
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      isCurrUser () {
        debug('currUser', this.currUser)
        debug('targUser', get(this.$route, 'params.id'))
        return this.currUser === get(this.$route, 'params.id')
      },
      filters () {
        return map(get(this.$store, 'state.publicPosts.items', []), post => moment(new Date(post.publishedAt)).format('YYYY/MM/DD'))
      },
      posts () {
        if (this.filter === 'all') {
          return get(this.$store, 'state.publicPosts.items') || []
        } else {
          return filter(get(this.$store, 'state.publicPosts.items') || [], post => (moment(new Date(post.publishedAt)).format('YYYY/MM/DD') === this.filter))
        }
      },
      profileId () {
        return get(this.$route, 'params.id')
      },
      profile () {
        const profile = get(this.$store, 'state.publicMember', {})
        return get(profile, 'id') === get(this.$route, 'params.id') && profile
      },
    },
    data () {
      return {
        filter: 'all',
        tabs: [
          this.$t('tab.WORDING_TAB_REVIEW_RECORD'),
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ],
      }
    },
    methods: {
      filterChanged (event) {
        this.filter = event.target.value
      },
      routeToMemCenter () {
        if (this.isCurrUser) {
          const route = get(find(ROLE_MAP, (r) => (r.key === get(this.$store, 'state.profile.role'))), 'route')
          debug('About to route to member center.', route)
          this.$router.push(`/${route}`)
        }
      },
      tabHandler (tab) {
        switch (tab) {
          case 0: 
            Promise.all([
              getPosts(this.$store, {
                where: {
                  author: this.profileId,
                  type: POST_TYPE.REVIEW,
                },
              }),
              getPostsCount(this.$store, {
                where: {
                  author: this.profileId,
                  type: POST_TYPE.REVIEW,
                },
              }),              
            ])
            break
        }
      },
    },
    mounted () {
      debug(`/profile/${this.$route.params.id}`)
      this.routeToMemCenter()
    },
    watch: {
      currUser: function () {
        debug('currUser changed', this.currUser)
        this.routeToMemCenter()
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .profile
    min-height 100vh
    width 100%
    background-color #fff
    display flex
    padding 25px 0
    &__aside
      width 75px
      height 100%
      position sticky
      top 60px
    &__main
      padding-left 93.5px
      width 100%
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
          > .item
            margin 35px auto
  @media (min-width 950px)
    .profile
      &__main
        max-width 950px
  @media (min-width 1200px)
    .profile
      max-width 1200px

</style>