<template>
  <section class="section">
    <iframe
      :src="`http://dev.readr.tw/project/${slug}`"
      class="section__iframe iframe"
      frameborder="0"
    />
  </section>
</template>

<script>
import _ from 'lodash'

export default {
  computed: {
    slug () {
      return this.$route.params.slug
    }
  },
  asyncData ({ store, route, }) {
    return store.dispatch('DataPost/GET_POST_REPORT', { slugs: [ _.get(route, 'params.slug'), ], })
  },
}
</script>

<style lang="stylus" scoped>
.iframe
  width 100%
  height 100vh
  background-color white
</style>
