<template>
  <header>
    <ReadrLogoOfHeader />
  </header>
</template>

<script>

import ReadrLogoOfHeader from './ReadrLogoOfHeader.vue'

export default {
  name: 'Header',
  components: {
    ReadrLogoOfHeader
  }
}
</script>

<style lang="stylus" scoped>
header
  padding-top 9px
  padding-bottom 9px
  text-align center
  background-color #fff
  >>> img
    width 48px
</style>
