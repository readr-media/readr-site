<template>
  <div class="public-page">
    <div class="public-page__container">
      <div class="public-page__main">
        <Leading></Leading>
        <PostList></PostList>
      </div>
      <div class="public-page__aside">
        <AppTitledList v-if="memos.length > 0"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.MEMOS')">
          <template v-for="memo in memos">
            <MemoFigure :key="memo.id" :memo="memo"></MemoFigure>
          </template>
        </AppTitledList>
        <AppTitledList 
          v-if="hasProjectsDone"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.PROJECTS')">
          <HomeReportAside></HomeReportAside>
        </AppTitledList>
      </div>
    </div>  
  </div>
</template>
<script>
import AppTitledList from 'src/components/AppTitledList.vue'
import HomeReportAside from 'src/components/home/HomeReportAside.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostList from 'src/components/post/PostList.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import { MEMO_PUBLISH_STATUS, POINT_OBJECT_TYPE, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from 'api/config'
import { get, uniq, } from 'lodash'

const MAXRESULT = 5
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'

const fetchMemos = (store, {
  max_result = MAXRESULT,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_MEMOS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const fetchPointHistories = (store, { objectIds, objectType, }) => {
  return store.dispatch('GET_POINT_HISTORIES', {
    params: {
      memberId: get(store, [ 'state', 'profile', 'id', ]),
      objectType: objectType,
      objectIds: objectIds,
    },
  })
}

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
    HomeReportAside,
    Leading,
    PostList,
    MemoFigure,
  },
  computed: {
    hasProjectsDone () {
      return this.projectsDone.length > 0      
    },
    memos () {
      return get(this.$store.state, 'publicMemos', [])
    },
    projectsDone () {
      return get(this.$store, 'state.publicProjects.done', [])
    },
  },
  methods: {},
  beforeMount () {
    Promise.all([
      fetchMemos(this.$store),
      fetchProjectsList(this.$store, { max_result: 2, status: PROJECT_STATUS.DONE, }),
    ]).then(() => {
      const projectIds = uniq(get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))
      
      if (projectIds.length !== 0) {
        fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
      }
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