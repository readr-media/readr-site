<template>
  <section class="home">
    <div v-if="publicProjectsRecommends.length > 0">
      <h1>
        為您推薦
      </h1>
      <SeriesList
        :item-style="'recommend'"
        :items="publicProjectsRecommends"
        class="home__list"
      />
    </div>
    <div v-if="publicProjectsTrends.length > 0">
      <h1 class="decorated">
        最熱門系列
      </h1>
      <SeriesList
        :item-style="'highlight'"
        :items="publicProjectsTrends"
        class="home__list highlight"
      />
    </div>
    <div>
      <h1 class="decorated">
        系列報導
      </h1>
      <SeriesList
        :item-style="'comm-narrow'"
        :items="publicProjectsNormal"
        class="home__list"
      />
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '../constants'
import { get } from 'lodash'
import { mapState } from 'vuex'
import { isScrollBarReachBottom } from '../util/comm'

import SeriesList from 'src/components/Series/SeriesList.vue'

export default {
  name: 'AppHome',
  components: {
    SeriesList
  },
  metaInfo: {
    title: SITE_NAME,
    titleTemplate: null
  },
  data () {
    return {
      currentPage: 1,
      hasMore: true,
      loading: false
    }
  },
  computed: {
    ...mapState({
      publicProjects: state => state.DataSeries.publicProjects
    }),
    publicProjectsRecommends () {
      // return this.publicProjects.recommends
      return this.publicProjects.normal.slice(0, 3)
    },
    publicProjectsTrends () {
      // return this.publicProjects.trends
      return this.publicProjects.normal.slice(0, 1)
    },
    publicProjectsNormal () {
      return this.publicProjects.normal
    }
  },
  asyncData ({ store }) {
    return store.dispatch('DataSeries/FETCH')
  },
  mounted () {
    window.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadMore)
  },
  methods: {
    loadMore () {
      if (this.hasMore && !this.loading && isScrollBarReachBottom(1 / 3)) {
        const origCount = get(this.projects, [ 'length' ], 0)
        this.loading = true
        this.$store.dispatch('DataSeries/FETCH', { page: this.currentPage + 1 })
          .then(() => {
            this.currentPage += 1
            get(this.projects, [ 'length' ], 0) <= origCount ? this.hasMore = false : this.hasMore = true
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.home
  width 80%
  max-width 1040px
  margin 0 auto
  padding 100px 0
  > div
    & + div
      margin 70px 0 0
  h1
    text-align center
    &.decorated
      display flex
      justify-content center
      align-items center
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
  &__list
    display flex
    flex-wrap wrap
    margin-top 1em
    &.highlight
      justify-content center
    >>> .list-item.comm-narrow
      width calc((100% - 180px) / 4)
      margin 60px 20px 0
      &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
        margin-top 14px
    >>> .list-item.recommend
      width calc((100% - 120px) / 3)
      margin 0 20px
    >>> .list-item.highlight
      width 80%
      max-width 900px
      margin 0
      background-color transparent
      h1, p
        text-align center

</style>
