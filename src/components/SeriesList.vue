<template>
  <section class="series-list">
    <ProjectsFigure v-for="project in projects" :key="project.id" class="project" :project="project" ></ProjectsFigure>
  </section>
</template>
<script>
import { get, } from 'lodash'
import { isScrollBarReachBottom, } from 'src/util/comm'
import ProjectsFigure from 'src/components/projects/ProjectsFigure.vue'

const DEFAULT_PAGE = 1
const debug = require('debug')('CLIENT:SeriesList')

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
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
      this.fetchProjectsList(this.$store, { page: this.currentPage + 1, })
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
  props: {
    fetchProjectsList: {
      type: Function,
      default: () => Promise.resolve(),
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
