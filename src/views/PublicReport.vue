<template>
  <section class="section">
    <iframe
      class="section__iframe iframe"
      :src="`http://dev.readr.tw/project/${slug}`"
      frameborder="0"
    />
  </section>
</template>

<script>
import _ from 'lodash'

import {
  PROJECT_PUBLISH_STATUS,
  PROJECT_STATUS,
} from 'api/config'

const fetchProjectSingle = (store, proj_slug) => {
  return store.dispatch('publicReport/GET_SERIES_DATA', {
    params: {
      where: {
        status: [ PROJECT_STATUS.WIP, PROJECT_STATUS.DONE, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      slugs: [ proj_slug, ],
    },
  })
}

export default {
  asyncData ({ store, route, }) {
    return fetchProjectSingle(store, _.get(route, 'params.slug'))
  },
  computed: {
    slug () {
      return this.$route.params.slug
    },
  },
}
</script>

<style lang="stylus" scoped>
.iframe
  width 100%
  height 100vh
  background-color white
</style>
