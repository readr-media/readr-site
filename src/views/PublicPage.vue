<template>
  <div class="public-page">
    <h1 v-text="$t('SECTIONS.SERIES_LIST')"></h1>
    <SeriesList></SeriesList>
  </div>
</template>
<script>
import SeriesList from 'src/components/SeriesList.vue'

export default {
  name: 'PublicPage',
  components: {
    SeriesList,
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
