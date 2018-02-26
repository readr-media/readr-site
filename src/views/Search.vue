<template>
  <div class="search">
    <div class="search__container">
      <aside class="search__container__aside">
        <AppAsideNav></AppAsideNav>
      </aside>
      <main class="search__container__main">
        <SearchFilter @searchChange="searchChange"></SearchFilter>
        <div v-if="currFilter === 'view'"></div>
        <div v-else-if="currFilter === 'conversation'"></div>
        <div v-else>
          <ProjectsFigure v-for="project in projects" :project="project" :key="project.id"></ProjectsFigure>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
  import { get } from 'lodash'
  import AppAsideNav from 'src/components/AppAsideNav.vue'
  import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'
  import SearchFilter from 'src/components/search/SearchFilter.vue'

  const debug = require('debug')('CLIENT:views:Search')
  const fetchProjectsList = (store, params) => {
    return store.dispatch('GET_PROJECTS_LIST', {
      params: params
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
    name: 'Search',
    components: {
      AppAsideNav,
      ProjectsFigure,
      SearchFilter
    },
    computed: {
      projects () {
        return get(this.$store, 'state.projectsList.items', [])
      }
    },
    data () {
      return {
        currFilter: 'view'
      }
    },
    beforeMount () {
      fetchProjectsList(this.$store, {}).then(() => {
        const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => project.id)
        fetchFollowing(this.$store, {
          resource: 'project',
          ids: postIdFeaturedProject
        })
      })
    },
    methods: {
      searchChange (key) {
        debug('Filter changes to:', key)
        this.currFilter = key
      }
    },
    mounted () {},
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