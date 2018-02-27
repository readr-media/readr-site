<template>
  <div class="profile">
    <aside class="profile__aside">
      <AppAsideNav></AppAsideNav>
    </aside>
    <main class="profile__main">
      <About :profile="profile"></About>
      <Tab :tabs="tabs" @changeTab="tabHandler">
        <!--PostListInTab slot="0" :posts="posts"></PostListInTab-->
        <template slot="0">
          <!--HomeArticleMain v-for="post in posts" :articleData="post" :key="post.id"></HomeArticleMain-->
        </template>
      </Tab>
    </main>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from 'api/config'
  import { WORDING_TAB_REVIEW_RECORD, WORDING_TAB_FOLLOW_RECORD } from 'src/constants'
  import { get } from 'lodash'
  import About from 'src/components/About.vue'
  import AppAsideNav from 'src/components/AppAsideNav.vue'
  // import PostListInTab from 'src/components/PostListInTab.vue'
  // import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  import Tab from 'src/components/Tab.vue'

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
    where = {}
  }) => {
    return store.dispatch('GET_PUBLIC_POSTS', {
      params: {
        mode,
        category,
        max_result: maxResult,
        page,
        sort,
        where
      }
    })
  }

  const getPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params
    })
  }

  export default {
    name: 'Profile',
    components: {
      About,
      AppAsideNav,
      // HomeArticleMain,
      // PostListInTab,
      Tab
    },
    computed: {
      posts () {
        return get(this.$store, 'state.publicPosts.items', [])
      },
      profile () {
        return get(this.$store, 'state.profile', {})
      },
    },
    data () {
      return {
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_FOLLOW_RECORD
        ]
      }
    },
    methods: {
      tabHandler (tab) {
        switch (tab) {
          case 0: 
            Promise.all([
              getPosts(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  type: POST_TYPE.REVIEW
                }
              }),
              getPostsCount(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  type: POST_TYPE.REVIEW
                }
              })              
            ])
            break
        }
      }
    },
    beforeMount () {
      Promise.all([
        getPosts(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        }),
        getPostsCount(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        })
      ])
    },
    mounted () {},
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
      margin-left 93.5px
  @media (min-width 1200px)
    .profile
      max-width 1200px
</style>