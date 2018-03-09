<template>
  <div class="search">
    <div class="search__container">
      <aside class="search__container__aside">
        <AppAsideNav></AppAsideNav>
      </aside>
      <main class="search__container__main">
        <SearchFilter @searchChange="searchChange"></SearchFilter>
        <div v-if="currFilter === 'post'">
          <HomeArticleMain v-for="(post, k) in items" :articleData="post" :key="`post-${k}`"></HomeArticleMain>
        </div>
        <div v-else-if="currFilter === 'conversation'"></div>
        <div v-else>
          <ProjectsFigure v-for="project in items" :project="project" :key="project.id"></ProjectsFigure>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
  import { filter, get } from 'lodash'
  import AppAsideNav from 'src/components/AppAsideNav.vue'
  import HomeArticleMain from 'src/components/home/HomeArticleMain.vue'
  import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'
  import SearchFilter from 'src/components/search/SearchFilter.vue'

  const MAXRESULT = 12
  const PAGE = 1
  const debug = require('debug')('CLIENT:views:Search')

  const fetchSearch = (store, { keyword, params }) => {
    return store.dispatch('SEARCH', {
      keyword,
      params
    })
  }
  const fetchData = (store) => {
    debug('store.state.route.params', store.state.route.params)
    debug('store.state.route.params.keyword', store.state.route.params.keyword)
    return Promise.all([
      fetchSearch(store, {
        keyword: store.state.route.params.keyword,
        params: {
          page: PAGE,
          max_results: MAXRESULT
        }
      }),
    ])
  }

  export default {
    name: 'Search',
    // asyncData ({ store }) {
    //   /**
    //    * dont fetch data through this method on client side. instead, use the hook beforeMount().
    //    */
    //   return !process.browser ? fetchData(store) : Promise.resolve()
    // },
    components: {
      AppAsideNav,
      HomeArticleMain,
      ProjectsFigure,
      SearchFilter
    },
    computed: {
      items () {
        return filter(get(this.$store, 'state.searchResult.items'), { objectType: this.currFilter })
      }
    },
    data () {
      return {
        currFilter: 'post'
      }
    },
    // beforeRouteEnter (to, from, next) {
    //   debug('beforeRouteEnter')
    //   // next(vm => {
    //   //   return fetchSearch(vm.$store, {
    //   //     keyword: to.params.keyword,
    //   //     params: {
    //   //       page: PAGE,
    //   //       max_results: MAXRESULT
    //   //     }
    //   //   })
    //   // })
    //   next()
    // }, 
    beforeRouteUpdate (to, from, next) {
      debug('beforeRouteUpdate')
      this.page = PAGE
      fetchSearch(this.$store, {
        keyword: to.params.keyword,
        params: {
          page: PAGE,
          max_results: MAXRESULT
        }
      }).then(() => {
        next()
      })
    },
    methods: {
      searchChange (key) {
        debug('Filter changes to:', key)
        this.currFilter = key
      }
    },
    beforeMount () {
      debug('this.$route.params.keyword', this.$route.params.keyword)
      fetchSearch(this.$store, {
        keyword: this.$route.params.keyword,
        params: {
          page: PAGE,
          max_results: MAXRESULT
        }
      })
    },
    mounted () {
      debug('Mounted')
    }
  }
</script>
<style lang="stylus" scoped>
  .search
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
        top 60px
        z-index 999
      &__main
        margin-left 40px
        display flex
        flex-direction column
        justify-content flex-start
        align-items flex-start
</style>