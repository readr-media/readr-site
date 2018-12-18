<template>
  <section class="plugins">
    <div :is="pluginName"></div>
  </section>
</template>

<script>
import { get, } from 'lodash'
const PluginLatest = () => import('src/components/plugins/PluginLatest.vue')

export default {
  components: {
    'latest': PluginLatest,
  },
  computed: {
    pluginName () {
      return get(this.$route, [ 'params', 'pluginName', ], '')
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>

