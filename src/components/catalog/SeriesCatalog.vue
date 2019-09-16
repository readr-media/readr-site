<template>
  <div class="series-catalog-wrapper">
    <div
      v-if="seriesPosts.length > 0"
      class="series-catalog-list-wrapper"
    >
      <h2>目錄</h2>
      <ol class="series-contents-list">
        <SeriesCatalogListItem
          v-for="(post, i) in seriesPosts"
          :key="i"
          class="series-contents-list__list-item"
          :post="post"
        />
      </ol>
    </div>
    <NoSSR>
      <infinite-loading @infinite="infiniteHandler" />
    </NoSSR>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

import SeriesCatalogListItem from './SeriesCatalogListItem.vue'
import NoSSR from 'vue-no-ssr'

export default {
  components: {
    SeriesCatalogListItem,
    NoSSR
  },
  computed: {
    ...mapState({
      seriesPosts: state => state.DataSeriesContents.publicProjectContents,
      singleSeries: state => state.DataSeries.singleSeries,
      currentPage: state => state.DataSeriesContents.currentPage
    }),
    seriesId () {
      return _.get(this.singleSeries, 'id', '')
    }
  },
  methods: {
    ...mapMutations({
      SET_CURRENT_PAGE: 'DataSeriesContents/SET_CURRENT_PAGE'
    }),
    infiniteHandler ($state) {
      if (this.currentPage === 0) {
        this.SET_CURRENT_PAGE(1)
      }

      this.$store.dispatch(
        'DataSeriesContents/FETCH',
        {
          params: {
            project_id: this.seriesId,
            page: this.currentPage,
            max_result: 10,
            sort: 'post_order,-updated_at'
          }
        }
      ).then(res => {
        if (res && res.body.items.length) {
          this.SET_CURRENT_PAGE(this.currentPage + 1)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.series-catalog-list-wrapper
  width 60%
  max-width 800px
  margin 50px auto

.series-contents-list
  margin 1.5rem 0 0 0
  padding 0
  list-style none
  &__list-item
    border-bottom 1px solid #979797
    &:nth-child(1)
      border-top 1px solid #979797
</style>
