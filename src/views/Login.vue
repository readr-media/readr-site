<template>
  <div class="login-page">
    <LoginPanel></LoginPanel>
  </div>
</template>
<script>
  import LoginPanel from '../components/LoginPanel.vue'
  export default {
    components: {
      LoginPanel
    },
    name: 'login-page',
    methods: {},
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
.login-page
  min-height 100vh
  width 100%
  background-color #fff
</style>