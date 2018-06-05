<template>
  <section class="series-list">
    <ProjectsFigure v-for="project in projects" :key="project.id" class="project" :project="project" ></ProjectsFigure>
  </section>
</template>
<script>
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from '../../api/config'
import { get, uniq,  } from 'lodash'
import { isScrollBarReachBottom, } from 'src/util/comm'
import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'

const debug = require('debug')('CLIENT:SeriesList')

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAXRESULT = 9

const fetchFollowing = (store, params) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
    resource: params.resource,
    ids: params.ids,
  })
}

const fetchProjectsList = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: max_result,
      page: page,
      where: {
        status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: DEFAULT_SORT,
    },
  })
}

export default {
  name: 'SeriesList',
  components: {
    ProjectsFigure,
  },
  data () {
    return {
      currentPage: DEFAULT_PAGE,
      endPage: false,
      isReachBottom: false,
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    projects () {
      return get(this.$store, 'state.publicProjects.normal', []) || []
    },
  },
  watch: {
    isReachBottom(value) {
      if (value && !this.endPage) {
        this.loadmore()
      }
    },
  },
  beforeMount () {
    fetchProjectsList(this.$store)
    .then(() => {
      const projectIds = uniq(get(this.$store, 'state.publicProjects.normal', []).map(p => `${p.id}`))
      if (this.isLoggedIn && projectIds.length > 0) {
        fetchFollowing(this.$store, { resource: 'project', ids: projectIds, })
      }
    })
  },
  mounted () {
    window.addEventListener('scroll', this.detectReachBottom)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.detectReachBottom)
  },
  methods: {
    detectReachBottom () {
      this.isReachBottom = isScrollBarReachBottom()
    },
    loadmore () {
      const origCount = get(this.projects, 'length', 0) || 0
      fetchProjectsList(this.$store, { page: this.currentPage + 1, })
      .then(({ res, }) => {
        if (get(this.projects, 'length', 0) <= origCount) {
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
  },
}

</script>
<style lang="stylus" scoped>
  .series-list
    display flex
    flex-wrap wrap
    width 100%
    margin-top 15px
    .project
      width calc((100% - 60px) / 3)
      margin 10px 10px
        
</style>
