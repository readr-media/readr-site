<template>
  <div class="series">
    <h1>系列內容</h1>
    <SidebarSeriesContentsList :items="seriesContentsData" />
    <NoSSR>
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
  data () {
    return {
      page: 1
    }
  },
  computed: {
    ...mapState({
      seriesData: state => _.get(state.DataPost, 'post', {}),
      singleSeries: state => state.DataSeries.singleSeries,
      seriesContentsData: state => state.DataSeriesContents.publicProjectContents
    }),
    seriesId () {
      return this.$route.name === 'series' ? _.get(this.singleSeries, 'id', '') : _.get(this.seriesData, 'projectId', '')
    }
  },
  watch: {
    seriesId: {
      handler () {
        this.RESET_PUBLIC_PROJECT_CONTENTS()
        this.page = 1
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      RESET_PUBLIC_PROJECT_CONTENTS: 'DataSeriesContents/RESET_PUBLIC_PROJECT_CONTENTS'
    }),

    infiniteHandler ($state) {
      debug('Start fetching DataSeriesContents of projectId: ', this.seriesId)
      this.$store.dispatch(
        'DataSeriesContents/FETCH',
        {
          projectId: this.seriesId,
          params: { page: this.page }
        }
      ).then(res => {
        if (res.body.items.length) {
          debug('page: ', this.page)
          debug('body items exist, should prepare to fetching next page')
          this.page += 1
          $state.loaded()
        } else {
          debug('page: ', this.page)
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
