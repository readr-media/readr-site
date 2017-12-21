<template>
  <div class="index-page">index</div> 
</template>
<script>
  import { currentUser } from '../util/services'

  export default {
    name: 'index-page',
    methods: {},
    mounted () {
      console.log('currentUser', currentUser())
    },
  }
</script>
<style lang="stylus" scoped>

</style>