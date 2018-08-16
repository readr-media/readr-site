<template>
  <div class="public-page">
    <h1 v-text="pageTitle"></h1>
    <div :is="targetComponent"></div>
  </div>
</template>
<script>
import SeriesList from 'src/components/SeriesList.vue'

export default {
  name: 'PublicPage',
  computed: {
    isSeriesListPage () {
      return this.route === 'series-list'
    },
    targetComponent () {
      switch (this.route) {
        case 'series-list': 
          return SeriesList
      }
    },
    pageTitle () {
      switch (this.route) {
        case 'series-list': 
          return this.$t('SECTIONS.SERIES_LIST')
      }
    },
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
    },
  },
}

</script>
<style lang="stylus" scoped>
  .public-page
    width 100%
    margin 4px 0 0
    h1
      margin 0 0 0 10px
      font-size 1.125rem
</style>
