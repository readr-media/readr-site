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
    mounted () {},
  }
</script>
<style lang="stylus" scoped></style>