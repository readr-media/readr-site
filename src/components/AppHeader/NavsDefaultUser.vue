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
      <div
        v-else
        class="nav__user user"
      >
        <img
          class="user__thumbnail"
          :src="userThumbnail"
          alt=""
        >
      </div>
    </div>
  </NoSSR>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions, } from 'vuex'

import { getFullUrl, } from 'src/util/comm'

import NoSSR from 'vue-no-ssr'

export default {
  components: {
    NoSSR,
  },
  computed: {
    ...mapState({
      profile: state => state.DataUser.profile,
      isLoggedIn: state => state.DataUser.isLoggedIn,
    }),
    userThumbnail () {
      const path = _.get(this.profile, 'profileImage', '')
      return getFullUrl(path)
    },
  },
  methods: {
    ...mapActions({
      LOGIN_ASK_TOGGLE: 'UILoginLightbox/LOGIN_ASK_TOGGLE',
    }),
    switchOnLoginPanel () {
      this.LOGIN_ASK_TOGGLE({ active: 'on', message: '', })
    },
    login () {
      this.switchOnLoginPanel()
    },
  },
}
</script>

<style lang="stylus" scoped>
.nav
  p
    font-size 20px
    margin 0
    color white

.user
  &__thumbnail
    width 30px
    height 30px
    border-radius 30px
    object-fit cover
</style>

