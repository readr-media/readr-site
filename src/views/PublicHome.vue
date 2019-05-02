<template>
  <section class="section">
    <div
      v-if="publicProjectsRecommends.length > 0"
      class="section__block block"
    >
      <h1 class="block__title">
        為您推薦
      </h1>
      <SeriesList
        :items="publicProjectsRecommends"
      />
    </div>
    <div
      v-if="publicProjectsTrends.length > 0"
      class="section__block block"
    >
      <h1 class="block__title block__title--decorated">
        最熱門系列
      </h1>
      <SeriesListWide
        :items="publicProjectsTrends"
      />
    </div>
    <div class="section__block block">
      <h1 class="block__title block__title--decorated">
        系列報導 
      </h1>
      <SeriesList
        :items="publicProjectsNormal"
        :theme="'narrow'"
      />
    </div>
  </section>
</template>

<script>
import { get, } from 'lodash'
import { mapState, } from 'vuex'
import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from '../../api/config'
import { isScrollBarReachBottom, } from '../util/comm'

import SeriesList from 'src/components/SeriesList/List.vue'
import SeriesListWide from 'src/components/SeriesListWide/List.vue'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAX_RESULT = 12

const fetchProjectsList = (store, {
  max_result = MAX_RESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('publicHome/GET_PUBLIC_PROJECTS', {
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
  components: {
    SeriesList,
    SeriesListWide,
  },
  asyncData ({ store, }) {
    return fetchProjectsList(store)
  },
  data () {
    return {
      currentPage: DEFAULT_PAGE,
      hasMore: true,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      publicProjects: state => state.publicHome.publicProjects,
    }),
    publicProjectsRecommends () {
      // return this.publicProjects.recommends
      return this.publicProjects.normal
    },
    publicProjectsTrends () {
      // return this.publicProjects.trends
      return this.publicProjects.normal
    },
    publicProjectsNormal () {
      return this.publicProjects.normal
    },
  },
  mounted () {
    window.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadMore)
  },
  methods: {
    loadMore () {
      if (this.hasMore && !this.loading && isScrollBarReachBottom(1/3)) {
        const origCount = get(this.projects, [ 'length', ], 0)
        this.loading = true
        fetchProjectsList(this.$store, { page: this.currentPage + 1, })
        .then(() => {
          this.currentPage += 1
          get(this.projects, [ 'length', ], 0) <= origCount ? this.hasMore = false : true
          this.loading = false
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.section
  padding 152px 0 128px 0
  max-width 1400px
  margin 0 auto

.block
  & + &
    margin 65px 0 0 0
  &__title
    font-size 30px
    font-weight 600
    margin 0 0 24px 0
    text-align center
    display flex
    justify-content center
    align-items center
    &--decorated
      &:before
        content ''
        display block
        flex 1 1 auto
        height 1px
        background-color #979797
        margin 0 25px 0 0
      &:after
        content ''
        display block
        flex 1 1 auto
        height 1px
        background-color #979797
        margin 0 0 0 25px
</style>
