<template>
  <div class="error-container">
    <div v-text="error" />
  </div>
</template>
<script>
import { get } from 'lodash'
export default {
  name: 'ServerError',
  data () {
    return {
      error: JSON.stringify(get(this.$store, 'state.error') || {})
    }
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="stylus" scoped>
  .error-container
    height 100vh
    width 100vw
    background-image url('/public/500.jpg')
    background-position center center
    background-size cover
    background-repeat no-repeat
    > div
      display none
</style>
