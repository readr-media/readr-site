<template>
  <div class="backstage member">
    <div class="backstage-container">
      <app-about :profile="profile"></app-about>
      <app-tab class="backstage__tab" :tabs="tabs">
        <following-list-tab slot="0"></following-list-tab>
      </app-tab>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import About from '../components/About.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import Tab from '../components/Tab.vue'

  // const MAXRESULT = 20
  // const DEFAULT_PAGE = 1
  // const DEFAULT_SORT = '-updated_at'

  export default {
    name: 'AppMember',
    components: {
      'app-about': About,
      'app-tab': Tab,
      'following-list-tab': FollowingListInTab,
    },
    data () {
      return {
        tabs: [
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ],
      }
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
