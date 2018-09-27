<template>
  <div class="public-page">
    <h1 v-text="pageTitle"></h1>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'PublicPage',
  props: {
    pageTitle: {
      type: String,
      default: '',
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