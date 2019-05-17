<template>
  <nav class="navs">
    <router-link
      class="navs__nav"
      to="/search"
    >
      <img
        src="/public/2.0/icons/search-white.png"
        alt=""
      >
    </router-link>
    <router-link
      class="navs__nav"
      to="/following"
    >
      <img
        src="/public/2.0/icons/follow-white-bold.png"
        alt=""
      >
    </router-link>
    <NavsDefaultUser
      class="navs__nav"
    />
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NavsDefaultUser from './NavsDefaultUser.vue'

export default {
  components: {
    NavsDefaultUser
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.DataUser.isLoggedIn
    })
  },
  methods: {
    ...mapActions({
      LOGIN_ASK_TOGGLE: 'UILoginLightbox/LOGIN_ASK_TOGGLE'
    }),
    switchOnLoginPanel () {
      this.LOGIN_ASK_TOGGLE({ active: 'on', message: '' })
    },
    login () {
      this.switchOnLoginPanel()
    }
  }
}
</script>

<style lang="stylus" scoped>
.navs
  display flex
  align-items center
  &__nav
    display flex
    height 30px
    align-items center
    cursor pointer
    & + &
      margin 0 0 0 30px
    img
      height 100%
    p
      font-size 20px
      margin 0
      color white
</style>
