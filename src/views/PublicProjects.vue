<template>
  <div class="projects-list">
    <div class="projects-list__container">
      <div class="projects-list__list-main">
        <ProjectsFigure v-for="project in projects" :project="project" :key="project.id"/>
      </div>
      <div class="projects-list__list-aside">
        <!-- <ProjectsFigureProgress/>
        <ProjectsFigureProgress/>
        <AppTitledList :listTitle="$t('project.WORDING_PROJECT_HOT_KEYWORD')">
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
import ProjectsFigureProgress from '../components/projects/ProjectsFigureProgress.vue'
import { PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { isScrollBarReachBottom, isElementReachInView, } from 'src/util/comm'
import _ from 'lodash'

// const debug = require('debug')('CLIENT:ProjectsList')

const MAXRESULT = 5
const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const fetchProjectsList = (store, { page, }) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      page: page || DEFAULT_PAGE,
      max_result: MAXRESULT,
      where: {
        publish_status: PROJECT_PUBLISH_STATUS.DRAFT,
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
    ProjectsFigureProgress,
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
      isReachBottom: false,
      currentPage: 1,
      endPage: false,
    }
  },
  computed: {
    projects () {
      return _.get(this.$store, 'state.publicProjects.normal', [])
    },
  },
  methods: {
    loadmore () {
      fetchProjectsList(this.$store, {
        page: this.currentPage + 1,
      })
      .then(({ status, res, }) => {
        if (status === 'end') {
          this.endPage = true
        } else if (status === 'error') {
          console.log(res)
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
    },
    isScrollBarReachBottom,
    isElementReachInView,
  },
  beforeMount () {
    // Beta version code
    fetchProjectsList(this.$store, {}).then(() => {
      if (this.$store.state.isLoggedIn) {
        const postIdFeaturedProject = _.get(this.$store, 'state.publicProjects.normal', []).map(project => `${project.id}`)
        fetchFollowing(this.$store, {
          resource: 'project',
          ids: postIdFeaturedProject,
        })
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
  &__container
    display flex
  &__list-main
    display flex
    flex-direction column
    justify-content flex-end
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

