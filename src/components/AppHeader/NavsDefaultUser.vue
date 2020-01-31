<template>
  <NoSSR>
    <div class="nav">
      <div
        v-if="!isLoggedIn"
        class="nav__login"
        @click="login"
      >
        <p>登入</p>
      </div>
      <a
        v-else
        :class="{ account: inAccountPage }"
        href="/account"
        class="nav__user user"
        @click="sendGaEvent('click', 'header_readr', 'profile')"
      >
        <img
          class="user__thumbnail"
          :src="userThumbnail"
          alt=""
        >
        <div
          v-if="hasUnreadNotifications"
          class="user__alert"
        />
      </a>
    </div>
  </NoSSR>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

import { getFullUrl, sendGaEvent } from 'src/util/comm'

import NoSSR from 'vue-no-ssr'

export default {
  components: {
    NoSSR
  },
  computed: {
    ...mapState({
      profile: state => state.DataUser.profile,
      isLoggedIn: state => state.DataUser.isLoggedIn,
      notification: state => state.DataNotification.notification
    }),
    hasUnreadNotifications () {
      return this.notification.filter(item => !item.read).length > 0
    },
    inAccountPage () {
      return this.$route.name === 'account'
    },
    userThumbnail () {
      const path = _.get(this.profile, 'profileImage') || '/public/icons/exclamation.png'
      return getFullUrl(path)
    }
  },
  watch: {
    isLoggedIn (value) {
      value && this.GET_NOTIFICATION(this.profile.id)
    }
  },
  beforeMount () {
    this.isLoggedIn && this.GET_NOTIFICATION(this.profile.id)
  },
  methods: {
    ...mapActions({
      GET_NOTIFICATION: 'DataNotification/GET_NOTIFICATION',
      LOGIN_ASK_TOGGLE: 'UILoginLightbox/LOGIN_ASK_TOGGLE'
    }),
    sendGaEvent,
    switchOnLoginPanel () {
      this.LOGIN_ASK_TOGGLE({ active: 'on', message: '' })
    },
    login () {
      this.switchOnLoginPanel()
      sendGaEvent('click', 'header_readr', 'log in')
    }
  }
}
</script>

<style lang="stylus" scoped>
.nav
  p
    font-size 20px
    margin 0
    color white

.user
  position relative
  font-size 0
  &__thumbnail
    width 30px
    height 30px
    border-radius 30px
    object-fit cover
  &__alert
    position absolute
    right -2px
    bottom -2px
    width 8px
    height 8px
    background-color #11b8c9
    border-radius 50%

.account
  border 2px solid #ddcf21
  border-radius 50%

</style>
