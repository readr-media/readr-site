<template>
  <section class="home">
    <!-- <div v-if="publicProjectsRecommends.length > 0">
      <h2>
        為您推薦
      </h2>
      <SeriesList
        :items="publicProjectsRecommends"
        class="home__list recommend"
      />
    </div> -->
    <div v-if="publicProjectsTrends.length > 0">
      <h2 class="decorated">
        最熱門專題
      </h2>
      <SeriesList
        :items="publicProjectsTrends"
        class="home__list highlight"
      />
    </div>
    <div>
      <h2 class="decorated">
        專題
      </h2>
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

import SeriesList from 'src/components/series/SeriesList.vue'

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
    // publicProjectsRecommends () {
    //   // return this.publicProjects.recommends
    //   return this.publicProjects.normal.slice(0, 3)
    // },
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
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
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
        const origCount = get(this.publicProjectsNormal, [ 'length' ], 0)
        this.loading = true
        this.$store.dispatch('DataSeries/FETCH', { page: this.currentPage + 1 })
          .then(() => {
            this.currentPage += 1
            this.hasMore = !(get(this.publicProjectsNormal, [ 'length' ], 0) <= origCount)
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
      margin 35px 0 0
  h2
    text-align center
    &.decorated
      display flex
      justify-content center
      align-items center
      padding 0 20px
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

    >>> .list-item.comm-narrow
      width calc((100% - 120px) / 3)
      margin 30px 20px 0
      &:nth-child(1), &:nth-child(2), &:nth-child(3)
        margin-top 0
    &.recommend
      >>> .list-item
        width calc((100% - 120px) / 3)
        margin 0 20px
    &.highlight
      justify-content center
      >>> .list-item
        width 80%
        max-width 900px
        margin 0
        background-color transparent
        h2, p
          text-align center

@media (min-width: 1024px)
  .home
    > div
      & + div
        margin 70px 0 0
    &__list
      >>> .list-item.comm-narrow
        width calc((100% - 180px) / 4)
        margin-top 60px
        &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
          margin-top 14px
</style>
