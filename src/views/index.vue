<template>
  <div class="index-page">
    <LoginPanel></LoginPanel>
  </div>
</template>
<script>
  import LoginPanel from '../components/LoginPanel.vue'

  export default {
    components: {
      LoginPanel
    },
    name: 'index-page',
    methods: {},
    mounted () {
      console.log('test')
    },
  }
</script>
<style lang="stylus" scoped>

</style>