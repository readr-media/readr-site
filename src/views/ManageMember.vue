<template>
  <div class="backstage member">
    <main class="backstage-container">
      <app-about :profile="profile"></app-about>
    </main>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import About from '../components/About.vue'

  // const MAXRESULT = 20
  // const DEFAULT_PAGE = 1
  // const DEFAULT_SORT = '-updated_at'

  export default {
    name: 'AppMember',
    components: {
      'app-about': About,
    },
    computed: {
      profile () {
        return get(this.$store, [ 'state', 'profile', ], {})
      },
    },
  }
</script>
<style lang="stylus" scoped>

</style>
