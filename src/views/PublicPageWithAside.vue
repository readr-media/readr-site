<template>
  <div class="public-page">
    <Leading v-if="hasLeading"></Leading>
    <div class="public-page__container">
      <div v-if="hasPostList" class="public-page__main">
        <PostList></PostList>
      </div>
      <AppTitledList v-else
        class="public-page__main-container"
        :listTitle="listTitle">
        <template v-if="$route.path === '/reports'">
          <HomeReportAside/>
        </template>
        <template v-if="$route.path === '/memos'">
          <template v-for="memo in memos">
            <MemoFigure :key="memo.id" :memo="memo" :showStatusTooltip="false"></MemoFigure>
          </template>
        </template>
      </AppTitledList>
      <div class="public-page__aside">
        <div class="public-page__aside-comment" v-if="commentAsset && isClientSide"><CommentContainer :asset="commentAsset"></CommentContainer></div>
        <div v-else></div>
        <AppTitledList v-if="projects.length > 0"
          class="public-page__aside-container"
          :listTitle="$t('SECTIONS.PROJECTS')"
          :moreButtonShow="true"
          :moreButtonTo="'/series-list'">
          <ProjectList :projects="projects"></ProjectList>
        </AppTitledList>
      </div>
    </div>  
  </div>
</template>
<script>
import AppTitledList from 'src/components/AppTitledList.vue'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import HomeReportAside from 'src/components/home/HomeReportAside.vue'
import Leading from 'src/components/leading/Leading.vue'
import MemoFigure from 'src/components/projects/MemoFigure.vue'
import PostList from 'src/components/post/PostList.vue'
import ProjectList from 'src/components/projects/ProjectList.vue'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, MEMO_PUBLISH_STATUS, POINT_OBJECT_TYPE, } from 'api/config'
import { isClientSide, isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import { get, uniq, } from 'lodash'

const MAXRESULT = 10
const MAXRESULT_REPORTS_MEMOS = 50
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const DEFAULT_SORT_REPORTS_MEMOS = '-published_at'

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

const fetchReportsList = (store, {
  max_result = MAXRESULT_REPORTS_MEMOS,
  sort = DEFAULT_SORT_REPORTS_MEMOS,
  page = 1,
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
      page,
    },
  })
}

const fetchMemos = (store, {
  max_result = MAXRESULT_REPORTS_MEMOS,
  sort = DEFAULT_SORT_REPORTS_MEMOS,
} = {}) => {
  return store.dispatch('GET_PUBLIC_MEMOS', {
    params: {
      max_result: max_result,
      where: {
        publish_status: MEMO_PUBLISH_STATUS.PUBLISHED,
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
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

export default {
  name: 'PublicPageWithAside',
  props: {
    hasLeading: {
      type: Boolean,
      default: true,
    },
    hasPostList: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    AppTitledList,
    CommentContainer,
    HomeReportAside,
    Leading,
    PostList,
    MemoFigure,
    ProjectList,
  },
  // TODO: reportList and memoList loadmore
  // watch: {
  //   isReachBottom (value) {
  //     if (value) {
  //       fetchReportsList(this.$store, {
  //         page: 2
  //       })
  //     }
  //   },
  // },
  data () {
    const listTitleMain = this.getListTitleMain(this.$route.path)
    return {
      isReachBottom: false,
      listTitle: [ this.$t('SECTIONS.PROJECTS'), this.$t(listTitleMain), ],
    }
  },
  computed: {
    commentAsset () {
      let asset
      switch (this.route) {
        case 'series':
          asset = `${get(this.$store, 'state.setting.HOST')}/series/${get(this.$route, 'params.slug')}`
      }
      return asset
    },
    isClientSide,
    memos () {
      return get(this.$store.state, 'publicMemos', [])
    },
    projects () {
      return get(this.$store, 'state.publicProjects.done') || []
    },
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
    },
  },
  methods: {
    getListTitleMain (path) {
      switch (path) {
        case '/reports':
          return 'SECTIONS.REPORTS'
        case '/memos':
          return 'SECTIONS.MEMOS'
        default:
          return ''
      }
    },
    getRequests (path) {
      let requests = [ fetchProjectsList(this.$store, { status: PROJECT_STATUS.DONE, }), ]
      switch (path) {
        case '/reports':
          requests.push(fetchReportsList(this.$store))
          break
        case '/memos':
          requests.push(fetchMemos(this.$store))
          break
        default:
          break
      }
      return requests
    },
    isElementReachInView,
    isScrollBarReachBottom,
  },
  beforeMount () {
    const requests = this.getRequests(this.$route.path)
    Promise.all(requests).then(() => {
      const projectIds = uniq(get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))
      if (projectIds.length !== 0) {
        fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
      }
      // if (this.$store.state.isLoggedIn) {
      //   const reportIds = _.get(this.$store.state, 'publicReports', []).map(report => `${report.id}`)
      //   fetchFollowing(this.$store, {
      //     resource: 'report',
      //     ids: reportIds,
      //   })
      // }
    })
  },
  // TODO: reportList and memoList loadmore  
  // mounted () {
  //   window.addEventListener('scroll', () => {
  //     this.isReachBottom = this.isElementReachInView('.public-page__main-container', 0.5) || this.isScrollBarReachBottom()
  //   })
  // },
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
    &-comment
      width 100%
      background-color #fff
      padding 10px 15px
      margin-bottom 20px
  &__main
    &-container
      width 650px
</style>