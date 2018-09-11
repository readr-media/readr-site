<template>
  <router-link v-if="projectSlug" :to="`/series/${projectSlug}/donate`"><img src="/public/icons/donate.png" alt=""></router-link>
</template>
<script>
  export default {
    name: 'DonateButton',
    methods: {},
    mounted () {},
    props: {
      projectSlug: {},
    },
  }
</script>
<style lang="stylus" scoped>
  img
    width 20px
    height 20px
</style>