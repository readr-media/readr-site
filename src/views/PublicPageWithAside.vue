<template>
  <div class="public-page">
    <div class="public-page__container">
      <div class="public-page__main">
        <Leading></Leading>
        <PostList></PostList>
      </div>
      <div class="public-page__aside">
        <AppTitledList v-if="projects.length > 0"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.PROJECTS')">
          <ProjectList :projects="projects"></ProjectList>
        </AppTitledList>
      </div>
    </div>  
  </div>
</template>
<script>
import AppTitledList from 'src/components/AppTitledList.vue'
import HomeReportAside from 'src/components/home/HomeReportAside.vue'
import Leading from 'src/components/leading/Leading.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import PostList from 'src/components/post/PostList.vue'
import ProjectList from 'src/components/projects/ProjectList.vue'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from 'api/config'
import { get, } from 'lodash'

const MAXRESULT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'

const fetchProjectsList = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
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
      sort: sort,
    },
  })
}

export default {
  name: 'PublicPageWithAside',
  components: {
    AppTitledList,
    HomeReportAside,
    Leading,
    PostList,
    MemoFigure,
    ProjectList,
  },
  computed: {
    projects () {
      return get(this.$store, 'state.publicProjects.done') || []
    },
  },
  methods: {},
  beforeMount () {
    Promise.all([
      fetchProjectsList(this.$store, { status: PROJECT_STATUS.DONE, }),
    ]).then(() => {
      // if (this.$store.state.isLoggedIn) {
      //   const reportIds = _.get(this.$store.state, 'publicReports', []).map(report => `${report.id}`)
      //   fetchFollowing(this.$store, {
      //     resource: 'report',
      //     ids: reportIds,
      //   })
      // }
    })
  },  
  mounted () {},
}
</script>
<style lang="stylus" scoped>
.public-page
  width 100%
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