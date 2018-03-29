<template>
  <div class="page-not-found"></div>
</template>
<script>
  export default {
    name: 'PageNotFound',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .page-not-found
    height 100vh
    width 100vw
    background-image url('/public/404.jpg')
    background-position center center
    background-size cover
    background-repeat no-repeat
</style>