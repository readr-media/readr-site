<template>
  <div class="public-page">
    <div class="public-page__container">
      <div class="public-page__main">
        <Leading></Leading>
        <PostList></PostList>
      </div>
      <div class="public-page__aside">
        <AppTitledList v-if="hasProjectsInProgress"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.PROJECTS_IN_PROGRESS')">
          <template v-for="project in projectsInProgress">
            <ProjectsFigureProgress :project="project"></ProjectsFigureProgress>
          </template>
        </AppTitledList>
        <AppTitledList 
          v-if="hasProjectsDone"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.PROJECTS')">
          <HomeProjectAside></HomeProjectAside>
        </AppTitledList>
      </div>
    </div>  
  </div>
</template>
<script>
import AppTitledList from 'src/components/AppTitledList.vue'
import HomeProjectAside from 'src/components/home/HomeProjectAside.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostList from 'src/components/post/PostList.vue'
import ProjectsFigureProgress from 'src/components/projects/ProjectsFigureProgress.vue'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from 'api/config'
import { get, } from 'lodash'

const MAXRESULT = 5
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'

const fetchProjectsList = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  status,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: max_result,
      page: page,
      where: {
        status: status,
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: DEFAULT_SORT,
    },
  })
}

export default {
  name: 'PublicPageWithAside',
  components: {
    AppTitledList,
    HomeProjectAside,
    Leading,
    PostList,
    ProjectsFigureProgress,
  },
  computed: {
    hasProjectsInProgress () {
      return this.projectsInProgress.length > 0
    },    
    hasProjectsDone () {
      return this.projectsDone.length > 0      
    },
    projectsInProgress () {
      return get(this.$store, 'state.publicProjects.inProgress', [])
    },
    projectsDone () {
      return get(this.$store, 'state.publicProjects.done', [])
    },
  },
  methods: {},
  beforeMount () {
    Promise.all([
      fetchProjectsList(this.$store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
      fetchProjectsList(this.$store, { max_result: 3, status: PROJECT_STATUS.WIP, }),
    ]).then(() => {
      // if (this.$store.state.isLoggedIn) {
      //   const postIdFeaturedProject = _.get(this.$store, 'state.publicProjects.done', []).map(project => `${project.id}`)
      //   fetchFollowing(this.$store, {
      //     resource: 'project',
      //     ids: postIdFeaturedProject,
      //   })
      // }
    })
  },  
  mounted () {},
}
</script>
<style lang="stylus" scoped>
.public-page
  &__container
    display flex
  &__main
    width 650px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
  &__aside
    margin-left 40px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    flex 1
    &-container
      width 100%
      >>> .app-titled-list__content
        padding 0
</style>