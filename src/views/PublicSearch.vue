<template>
  <div class="search">
    <div class="search__container">
      <SearchFilter :filter.sync="currFilter" />
      <div v-if="currFilter === 'post'">
        <PostItem v-for="(post, k) in items" :post="post" :key="`post-${k}`" />
      </div>
      <div v-else-if="currFilter === 'project'">
        <ProjectsFigure v-for="project in items" :project="project" :key="project.id" />
      </div>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import PostItem from 'src/components/post/PostItem.vue'
  import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'
  import SearchFilter from 'src/components/search/SearchFilter.vue'

  const MAXRESULT = 12
  const PAGE = 1
  const debug = require('debug')('CLIENT:views:Search')

  const fetchSearch = (store, { keyword, params, }) => {
    return store.dispatch('SEARCH', {
      keyword,
      params,
    })
  }
  const fetchData = (store, route, objectType) => {
    debug('store.state.route.params', route.params)
    debug('store.state.route.params.keyword', route.params.keyword)
    return Promise.all([
      fetchSearch(store, {
        keyword: route.params.keyword,
        params: {
          page: PAGE,
          max_results: MAXRESULT,
          object_type: objectType || 'post',
        },
      }),
    ])
  }

  export default {
    name: 'Search',
    components: {
      PostItem,
      ProjectsFigure,
      SearchFilter,
    },
    computed: {
      items () {
        return get(this.$store, 'getters.searchResultNormalized')
      },
    },
    data () {
      return {
        currFilter: 'post',
        isProcessing: false,
      }
    },
    methods: {
      fetchItems () {
        if (!this.isProcessing) {
          this.isProcessing = true
          fetchData(this.$store, this.$route, this.currFilter).then(() => {
            this.isProcessing = false
          }).catch(() => {
            this.isProcessing = false
          })
        }
      },
      searchChange (key) {
        debug('Filter changes to:', key)
        this.currFilter = key
      },
    },
    beforeMount () {
      fetchData(this.$store, this.$route)
    },
    watch: {
      currFilter () {
        this.fetchItems()
      },
      '$route.fullPath': function () {
        /**
         * Revise this.currFilter to trigger data fetching.
         */
        this.currFilter = 'post'
        this.fetchItems()
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .search
    &__container
      margin-left 40px
      display flex
      flex-direction column
      justify-content flex-start
      align-items flex-start
</style>