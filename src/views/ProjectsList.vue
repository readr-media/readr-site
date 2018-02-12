<template>
  <div class="projects-list">
    <div class="projects-list__container">
      <aside class="projects-list__aside">
        <AppAsideNav/>
      </aside>
      <main class="projects-list__main">
        <ProjectsFigure v-for="project in projects" :project="project" :key="project.id"/>
      </main>
    </div>
  </div>
</template>

<script>
import AppAsideNav from '../components/AppAsideNav.vue'
import ProjectsFigure from '../components/projects/ProjectsFigure.vue'
import _ from 'lodash'

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
  components: {
    AppAsideNav,
    ProjectsFigure
  },
  computed: {
    projects () {
      return _.get(this.$store, 'state.projectsList.items', [])
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
  }
}
</script>


<style lang="stylus" scoped>
.projects-list
  background-color #e6e6e6
  min-height 100vh
  &__container
    max-width 1200px
    margin auto
    padding 60px 0
    display flex
  &__aside
    width 75px
    height 100%
    position sticky
    // position fixed
    top 60px
    z-index 999
  &__main
    margin-left 40px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
</style>

