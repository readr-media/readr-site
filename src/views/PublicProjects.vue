<template>
  <div class="projects-list">
    <div class="projects-list__container">
      <div class="projects-list__list-main">
        <ProjectsFigure v-for="project in projects" :project="project" :key="project.id"/>
      </div>
      <div class="projects-list__list-aside">
        <AppTitledList v-if="memos.length > 0" class="projects-list__project-container" :listTitle="$t('SECTIONS.MEMOS')">
          <template v-for="memo in memos">
            <MemoFigure :key="memo.id" :memo="memo"></MemoFigure>
          </template>
        </AppTitledList>
        <!-- <ProjectsFigureProgress/> -->
        <!-- <ProjectsFigureProgress/> -->
        <!-- <AppTitledList :listTitle="$t('project.WORDING_PROJECT_HOT_KEYWORD')">
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
        </AppTitledList> -->
      </div>
    </div>
  </div>
</template>

<script>
import AppTitledList from '../components/AppTitledList.vue'
import ProjectsFigure from '../components/projects/ProjectsFigure.vue'
import MemoFigure from '../components/projects/MemoFigure.vue'
import { MEMO_PUBLISH_STATUS, POINT_OBJECT_TYPE, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from '../../api/config'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import _ from 'lodash'

const debug = require('debug')('CLIENT:ProjectsList')

const MAXRESULT = 5
const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'

const fetchMemos = (store, {
  max_result = MAXRESULT,
  sort = '-published_at',
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
      memberId: _.get(store, [ 'state', 'profile', 'id', ]),
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
  // Uncomment this when v1.0 is released
  // asyncData ({ store, }) {
  //   return fetchProjectsList(store, {})
  // },
  components: {
    AppTitledList,
    ProjectsFigure,
    MemoFigure,
  },
  watch: {
    isReachBottom(isReachBottom) {
      if (isReachBottom && !this.endPage) {
        this.loadmore()
      }
    },
  },
  data () {
    return {
      currentPage: 1,
      endPage: false,
      isReachBottom: false,
    }
  },
  computed: {
    memos () {
      return _.get(this.$store.state, 'publicMemos', [])
    },
    projects () {
      return _.get(this.$store, 'state.publicProjects.done', [])
    },
  },
  methods: {
    loadmore () {
      const origCount = _.get(this.projects, [ 'length', ], 0)
      fetchProjectsList(this.$store, {
        status: PROJECT_STATUS.DONE,
        page: this.currentPage + 1,
      })
      .then(({ res, }) => {
        if (_.get(this.projects, [ 'length', ], 0) <= origCount) {
          this.endPage = true
        } else {
          this.currentPage += 1
          if (this.$store.state.isLoggedIn) {
            const ids = res.items.map(project => `${project.id}`)
            fetchFollowing(this.$store, {
              mode: 'update',
              resource: 'project',
              ids: ids,
            })
          }
        }
      })
      .catch(({ status, res, }) => {
        debug('error while loadmore, status: ', status)
        debug('error while loadmore, res: ', res)
      })
    },
    isScrollBarReachBottom,
    isElementReachInView,
  },
  beforeMount () {
    // Beta version code
    Promise.all([
      fetchMemos(this.$store),
      fetchProjectsList(this.$store, { status: PROJECT_STATUS.DONE, }),
    ]).then(() => {
      if (this.$store.state.isLoggedIn) {
        const postIdFeaturedProject = _.get(this.$store, 'state.publicProjects.done', []).map(project => `${project.id}`)
        const projectIds = _.uniq(_.get(this.$store, 'state.publicMemos', []).map(memo => memo.projectId))

        fetchFollowing(this.$store, {
          resource: 'project',
          ids: postIdFeaturedProject,
        })

        if (projectIds.length !== 0) {
          fetchPointHistories(this.$store, { objectType: POINT_OBJECT_TYPE.PROJECT_MEMO, objectIds: projectIds, })
        }
      }
    })
    // Uncomment this when v1.0 is released
    // if (this.$store.state.isLoggedIn) {
    //   const postIdFeaturedProject = this.$store.state.projectsList.items.map(project => `${project.id}`)
    //   fetchFollowing(this.$store, {
    //     resource: 'project',
    //     ids: postIdFeaturedProject,
    //   })
    // }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.isReachBottom = this.isScrollBarReachBottom()
    })
  },
}
</script>

<style lang="stylus" scoped>
.projects-list
  width 100%
  &__container
    display flex
  &__list-main
    display flex
    flex-direction column
    justify-content flex-end
    align-items flex-start
  &__list-aside
    flex 1
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
  &__project-container
    width 100%
    >>> .app-titled-list__content
      padding 0

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

