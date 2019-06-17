<template>
  <section class="account">
    <AppTab
      :current="currentTab"
      :items="tabs"
      class="account__tab app-content-area"
      @change="handleTab"
    />
    <div
      :is="currentTabComponent"
      :profile="profile"
      v-bind="currentProps"
      class="account__feature app-content-area"
    />
  </section>
</template>
<script>

import AccountNotice from 'src/components/member/AccountNotice.vue'
import AccountSetting from 'src/components/member/AccountSetting.vue'

import AppTab from 'src/components/AppTab.vue'
import { SITE_NAME } from '../constants'
import { find } from 'lodash'
import { mapState } from 'vuex'

const componentMapping = {
  notice: { index: 0, component: 'AccountNotice', route: '/account/notice' },
  setting: { index: 1, component: 'AccountSetting', route: '/account/' }
}

export default {
  name: 'MemberAccount',
  components: {
    AccountNotice,
    AccountSetting,
    AppTab
  },
  metaInfo: {
    title: SITE_NAME,
    titleTemplate: null
  },
  data () {
    return {
      currentTab: 1,
      tabs: [ '通知', '設定' ]
    }
  },
  computed: {
    ...mapState({
      profile: state => state.DataUser.profile,
      notification: state => state.DataNotification.notification
    }),
    currentTabComponent () {
      return this.routeSection ? componentMapping[this.routeSection].component : componentMapping.setting.component
    },
    currentProps () {
      return this.getProps()
    },
    routeSection () {
      return this.$route.params.section
    }
  },
  watch: {
    '$route.path' () {
      this.getData()
      this.currentTab = this.getCurrentTab()
    }
  },
  beforeMount () {
    this.getData()
    this.currentTab = this.getCurrentTab()
  },
  methods: {
    getCurrentTab () {
      return this.routeSection ? componentMapping[this.routeSection].index : componentMapping.setting.index
    },
    getData () {
      const features = {
        notice: () => this.$store.dispatch('DataNotification/GET_NOTIFICATION', this.profile.id)
      }
      return this.routeSection ? features[this.routeSection]() : ''
    },
    getProps () {
      const mapping = {
        notice: { notification: this.notification },
        setting: { profile: this.profile }
      }
      return this.routeSection ? mapping[this.routeSection] : mapping.setting
    },
    handleTab (tab) {
      const info = find(componentMapping, { index: tab.index })
      this.$router.push({ path: info.route })
    }
  }
}
</script>
<style lang="stylus" scoped>
.account
  padding calc(50px + 1em) 0 0
  &__tab
    margin-top 50px
  &__feature
    margin-top 50px
    padding-bottom 20px
  >>> .account-notice, >>> .account-setting
    > div
      padding-bottom 25px

</style>
