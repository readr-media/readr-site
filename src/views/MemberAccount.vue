<template>
  <section class="account">
    <div class="app-content-area">
      <AppTab
        :current="currentTab"
        :items="tabs"
        class="account__tab"
        @change="handleTab"
      />
      <div
        :is="currentTabComponent"
        :profile="profile"
        v-bind="currentProps"
        class="account__feature"
      />
      <button
        v-if="!routeSection"
        class="logout"
        @click="logout"
      >
        登出
      </button>
    </div>
  </section>
</template>
<script>

import AccountNotice from 'src/components/member/AccountNotice.vue'
import AccountSetting from 'src/components/member/AccountSetting.vue'

import AppTab from 'src/components/AppTab.vue'
import { SITE_NAME } from '../constants'
import { find, get } from 'lodash'
import { mapActions, mapState } from 'vuex'
import { removeToken } from 'src/util/services'

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
    titleTemplate: null,
    meta: [
      { vmid: 'og:type', property: 'og:type', content: 'profile' }
    ]
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
    notificationFiltered () {
      return this.notification.filter(item => item.object_type !== 'member')
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
    ...mapActions({
      GET_NOTIFICATION: 'DataNotification/GET_NOTIFICATION',
      LOGOUT: 'DataUser/LOGOUT'
    }),
    getCurrentTab () {
      return this.routeSection ? componentMapping[this.routeSection].index : componentMapping.setting.index
    },
    getData () {
      const features = {
        notice: () => this.GET_NOTIFICATION(this.profile.id)
      }
      return this.routeSection ? features[this.routeSection]() : ''
    },
    getProps () {
      const mapping = {
        notice: { notification: this.notificationFiltered },
        setting: { profile: this.profile }
      }
      return this.routeSection ? mapping[this.routeSection] : mapping.setting
    },
    handleTab (tab) {
      const info = find(componentMapping, { index: tab.index })
      this.$router.push({ path: info.route })
    },
    logout () {
      const domain = get(this.$store, 'state.setting.DOMAIN')
      removeToken(domain)
      this.LOGOUT()
      this.$router.push('/')
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

  .logout
    display block
    width 100%
    padding .4em .5em
    margin 20px 0
    color #11b8c9
    border 1px solid #11b8c9

@media (min-width: 1024px)
  .account
    .logout
      width 90px
      height 40px
      margin 20px 0 20px auto
</style>
