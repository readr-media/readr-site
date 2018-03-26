<template>
  <div class="projects-list">
    <div class="projects-list__container">
      <aside class="projects-list__aside">
        <AppAsideNav/>
      </aside>
      <main class="projects-list__main">
        <div class="projects-list__list-main">
          <ProjectsFigure v-for="project in projects" :project="project" :key="project.id"/>
        </div>
        <div class="projects-list__list-aside">
          <ProjectsFigureProgress/>
          <ProjectsFigureProgress/>
          <AppTitledList :listTitle="'熱門關鍵字'">
            <ul class="projects-tags-hot-list-container">
              <li class="projects-tags-hot-list-container__list">
                <span class="projects-tags-hot-list-container__tag-name">原住民傳統領域</span>
                <span class="projects-tags-hot-list-container__tag-count">7631</span>
              </li>
              <li class="projects-tags-hot-list-container__list">
                <span class="projects-tags-hot-list-container__tag-name">農舍</span>
                <span class="projects-tags-hot-list-container__tag-count">631</span>
              </li>
            </ul>
          </AppTitledList>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AppAsideNav from '../components/AppAsideNav.vue'
import AppTitledList from '../components/AppTitledList.vue'
import ProjectsFigure from '../components/projects/ProjectsFigure.vue'
import ProjectsFigureProgress from '../components/projects/ProjectsFigureProgress.vue'
import _ from 'lodash'

// const debug = require('debug')('CLIENT:ProjectsList')
const fetchProjectsList = (store, params) => {
  return store.dispatch('GET_PROJECTS_LIST', {
    params: params,
  })
}
const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: params.subject,
      resource: params.resource,
    })
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
      resource: params.resource,
      ids: params.ids,
    })
  }
}

export default {
  name: 'ProjectsList',
  asyncData ({ store, }) {
    return fetchProjectsList(store, {})
  },
  components: {
    AppAsideNav,
    AppTitledList,
    ProjectsFigure,
    ProjectsFigureProgress,
  },
  computed: {
    projects () {
      return _.get(this.$store, 'state.projectsList.items', [])
    },
  },
  beforeMount () {
    const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => `${project.id}`)
    fetchFollowing(this.$store, {
      resource: 'project',
      ids: postIdFeaturedProject,
    })
  },
}
</script>

<style lang="stylus" scoped>
.projects-list
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
    margin-left 40px
    display flex
  &__list-main
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
  &__list-aside
    margin-left 40px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    & > figure
      & + figure
        margin-top 10px
    section
      margin-top 16.5px

.projects-tags-hot-list-container
  margin 15px 0 0 0
  padding 0 15px
  width 355px
  list-style none
  &__list
    margin 10px 0
    font-size 15px
    display flex
  &__tag-count
    margin-left 10px
    font-size 12px
    align-self center
    color #444746
</style>

