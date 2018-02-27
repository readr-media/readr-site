<template>
  <div class="profile">
    <aside class="profile__aside">
      <AppAsideNav></AppAsideNav>
    </aside>
    <main class="profile__main">
      <About :profile="profile"></About>
      <Tab :tabs="tabs"></Tab>
    </main>
  </div>
</template>
<script>
  import { WORDING_TAB_REVIEW_RECORD, WORDING_TAB_FOLLOW_RECORD } from 'src/constants'
  import { get } from 'lodash'
  import About from 'src/components/About.vue'
  import AppAsideNav from 'src/components/AppAsideNav.vue'
  import Tab from 'src/components/Tab.vue'

  export default {
    name: 'Profile',
    components: {
      About,
      AppAsideNav,
      Tab
    },
    computed: {
      profile () {
        return get(this.$store, [ 'state', 'profile' ], {})
      },
    },
    data () {
      return {
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_FOLLOW_RECORD
        ]
      }
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .profile
    min-height 100vh
    width 100%
    background-color #fff
    display flex
    padding 25px 0
    &__aside
      width 75px
      height 100%
      position sticky
      top 60px
    &__main
      margin-left 93.5px
  @media (min-width 1200px)
    .profile
      max-width 1200px
</style>