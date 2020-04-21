<template>
  <section class="series">
    <main>
      <div
        v-if="singleSeries.heroImage || singleSeries.ogImage"
        class="series__image app-content-area"
      >
        <figure>
          <img
            :src="singleSeries.heroImage || singleSeries.ogImage"
            :alt="singleSeries.title || singleSeries.ogTitle"
          >
        </figure>
      </div>
      <h1
        class="app-content-area"
        v-text="singleSeries.title || singleSeries.ogTitle"
      />
      <p
        class="app-content-area"
        v-text="singleSeries.description || singleSeries.ogDescription"
      />
    </main>
    <SeriesCatalog />
    <lazy-component
      class="series-bottom"
      @show="fetchSeries"
    >
      <div class="app-content-area series__more-series">
        <h2>更多專題</h2>
        <SeriesList
          :item-style="'comm-series-more'"
          :items="seriesFilterSelf"
          ga-event-label="series"
          class="series__more-series-list"
        />
      </div>
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL, SITE_NAME } from 'src/constants'
import { getFullUrl } from 'src/util/comm'
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

import SeriesCatalog from 'src/components/catalog/SeriesCatalog.vue'
import SeriesList from 'src/components/series/SeriesList.vue'

export default {
  name: 'AppSeries',
  components: {
    SeriesCatalog,
    SeriesList
  },
  metaInfo () {
    const title = this.singleSeries.ogTitle || this.singleSeries.title
    const description = this.singleSeries.ogDescription || this.singleSeries.description
    const image = this.singleSeries.ogImage || this.singleSeries.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { vmid: 'og:title', property: 'og:title', content: `${title} - ${SITE_NAME}` },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: getFullUrl(this.$route.path) },
        { vmid: 'og:image', property: 'og:image', content: image }
      ]
    }
  },
  computed: {
    ...mapState({
      series: state => state.DataSeries.publicProjects.normal,
      singleSeries: state => state.DataSeries.singleSeries
    }),
    seriesFilterSelf () {
      return this.series.filter(series => series.slug !== this.$route.params.slug).slice(0, 3)
    },
    seriesId () {
      return _.get(this.singleSeries, 'id', '')
    }
  },
  watch: {
    seriesId: {
      handler () {
        this.RESET_PUBLIC_PROJECT_CONTENTS()
        this.SET_CURRENT_PAGE(1)
      },
      immediate: true
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataSeries/FETCH_SINGLE_SERIES', { slug: route.params.slug })
      .then(res => {
        if (res.body.items.length === 0) {
          const err = new Error()
          err.status = 404
          return Promise.reject(err)
        }
      })
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
  },
  methods: {
    ...mapMutations({
      RESET_PUBLIC_PROJECT_CONTENTS: 'DataSeriesContents/RESET_PUBLIC_PROJECT_CONTENTS',
      SET_CURRENT_PAGE: 'DataSeriesContents/SET_CURRENT_PAGE'
    }),
    fetchSeries () {
      this.$store.dispatch('DataSeries/FETCH', { maxResult: 4 })
    }
  }
}
</script>
<style lang="stylus" scoped>
.series
  main
    h1, div
      & + *
        margin-top 1.5rem
    a
      display block
      width 300px
      height 50px
      margin-left auto
      margin-right auto
      font-weight 500
      line-height 50px
      text-align center
      background-color #ddcf21
      border-radius 8px
  h1
    & + p
      margin-top 17px
  h2
    & + div
      margin-top 1.5rem
  p
    text-align justify
    line-height 1.86
    & + *
      margin-top 17px
  &__image
    figure
      position relative
      width 100%
      padding-top 56.25%
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__more-series
    margin-top 2em
    padding-bottom 2em
    &-list
      display flex
      justify-content space-between
      >>> .list-item
        figure
          border 1px solid #979797
        h1
          margin-top .2em
</style>
