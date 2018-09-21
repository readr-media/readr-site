<template>
  <div class="backstage member">
    <div class="backstage-container">
      <app-about :profile="profile"></app-about>
      <app-tab class="backstage__tab" :tabs="tabs" :defaultTab="defaultTab">
        <following-list-tab slot="0"></following-list-tab>
        <PointManager slot="1" v-if="isDonationActive"></PointManager>
      </app-tab>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import About from 'src/components/member/About.vue'
  import FollowingListInTab from 'src/components/FollowingListInTab.vue'
  import PointManager from 'src/components/point/PointManager.vue'
  import Tab from 'src/components/Tab.vue'

  // const debug = require('debug')('CLIENT:AppMember')

  export default {
    name: 'AppMember',
    metaInfo () {
      return {
        isTappayNeeded: this.isTappayRequired,
      }
    },      
    components: {
      'app-about': About,
      'app-tab': Tab,
      'following-list-tab': FollowingListInTab,
      PointManager,
    },
    data () {
      return {
        defaultTab: 0,
      }
    },
    computed: {
      isDonationActive () {
        return get(this.$store, 'state.setting.DONATION_IS_DEPOSIT_ACTIVE', false)
      },      
      isTappayRequired () {
        return get(this.$store, 'state.isTappayRequired', false)
      },       
      profile () {
        return get(this.$store, 'state.profile', {})
      },
      tabs () {
        const defaultTabs = [
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ]
        this.isDonationActive && defaultTabs.push(this.$t('tab.WORDING_TAB_REWARD_POINTS_RECORD'))
        return defaultTabs
      },           
    },
    beforeMount () {
      if (get(this.$route, 'params.panel')) {
        switch (get(this.$route, 'params.panel')) {
          case 'profile-edit':
            break
          default:
            this.activePanel = get(this.$route, 'params.panel')
        }
        switch (get(this.$route, 'params.tool')) {
          case 'following':
            this.defaultTab = 0
            break
          case 'point-manager':
            this.isDonationActive && (this.defaultTab = 1)
            break
        }        
      }      
    },
    watch: {
      isTappayRequired () {
        this.$forceUpdate()
      },
    },
  }
</script>
<style lang="stylus" scoped>

</style>
