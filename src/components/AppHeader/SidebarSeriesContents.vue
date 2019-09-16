<template>
  <div class="series">
    <h1>目錄</h1>
    <SidebarSeriesContentsList :items="seriesContentsData" />
    <NoSSR
      v-if="showSidebar && currentSidebarSlot === 'seriesContents'"
    >
      <infinite-loading @infinite="infiniteHandler" />
    </NoSSR>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'

import SidebarSeriesContentsList from './SidebarSeriesContentsList.vue'
import NoSSR from 'vue-no-ssr'

const debug = require('debug')('CLIENT:SidebarSeriesContents')

export default {
  components: {
    SidebarSeriesContentsList,
    NoSSR
  },
  computed: {
    ...mapState({
      seriesData: state => _.get(state.DataPost, 'post', {}),
      singleSeries: state => state.DataSeries.singleSeries,
      seriesContentsData: state => state.DataSeriesContents.publicProjectContents,
      currentPage: state => state.DataSeriesContents.currentPage
    }),
    ...mapState({
      showSidebar: state => state.UIAppHeader.showSidebar,
      currentSidebarSlot: state => state.UIAppHeader.currentSidebarSlot
    }),
    seriesId () {
      return this.$route.name === 'series' ? _.get(this.singleSeries, 'id', '') : _.get(this.seriesData, 'projectId', '')
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
  methods: {
    ...mapMutations({
      RESET_PUBLIC_PROJECT_CONTENTS: 'DataSeriesContents/RESET_PUBLIC_PROJECT_CONTENTS',
      SET_CURRENT_PAGE: 'DataSeriesContents/SET_CURRENT_PAGE'
    }),

    infiniteHandler ($state) {
      debug('Start fetching DataSeriesContents of projectId: ', this.seriesId)
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
          debug('page: ', this.page)
          debug('body items exist, should prepare to fetching next page')
          this.SET_CURRENT_PAGE(this.currentPage + 1)
          $state.loaded()
        } else {
          debug('page: ', this.currentPage)
          debug('body items empty, complete infinite loading')
          $state.complete()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.series
  h1
    font-size 30px
    font-weight 600
    margin 0 0 20px 0
</style>
