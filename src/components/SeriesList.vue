<template>
  <section class="series-list">
    <ProjectsFigure v-for="project in projects" :key="project.id" class="project" :project="project" ></ProjectsFigure>
  </section>
</template>
<script>
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from '../../api/config'
import { get, } from 'lodash'
import { isScrollBarReachBottom, } from 'src/util/comm'
import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'

const debug = require('debug')('CLIENT:SeriesList')

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAXRESULT = 9

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

const fetchProjectsList = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: max_result,
      page: page,
      sort: sort,
      where: {
        status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
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
    getUserFollowing(this.$store, { resource: 'project', })
    getUserFollowing(this.$store, { resource: 'tag', })
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
      .then(() => {
        if (get(this.projects, 'length', 0) <= origCount) {
          this.endPage = true
        } else {
          this.currentPage += 1
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
