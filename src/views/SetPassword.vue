<template>
  <div class="pwd-set">
    <app-header></app-header>
    <InitBasicProfile></InitBasicProfile>
  </div>
</template>
<script>
  import AppHeader from '../components/AppHeader.vue'
  import InitBasicProfile from '../components/register/InitBasicProfile.vue'
  export default {
    components: {
      'app-header': AppHeader,
      InitBasicProfile
    },
    name: 'SetPassword',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped></style>