<template>
  <nav class="app-aside-nav">
    <ol class="nav-list">
      <router-link class="nav-list__link" to="/">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.CHIEF_EDITOR_TALK')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/series-list">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.SERIES')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/editors">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.CHIEF_EDITOR_LIST')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/about">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.ABOUT')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" :to="`/profile/${ANNOUNCEMENT_ACCOUNT_ID}`">
        <li class="nav-list__list-item">
          <img src="/public/icons/announcement.png" alt="info">
        </li>
      </router-link>
      <InviteSwitcher class="nav-list__link">
        <li class="nav-list__list-item" slot="icon">
          <img src="/public/icons/invite.png" alt="info">
        </li>
      </InviteSwitcher>
    </ol>
    <div class="online">
      <img class="online__calendar" src="/public/icons/calendar.png" alt="">
      <p class="online__text" v-text="$t('ONLINE')"></p>
    </div>
  </nav>
</template>

<script>
import { ANNOUNCEMENT_ACCOUNT_ID, } from 'src/constants'
import { isCurrentRoutePath, } from 'src/util/comm'
import InviteSwitcher from 'src/components/invitation/InviteSwitcher.vue'

export default {
  name: 'AppNavAside',
  components: {
    InviteSwitcher,
  },
  data () {
    return {
      ANNOUNCEMENT_ACCOUNT_ID,
    }
  },
  methods: {
    isCurrentRoutePath,
  },
}
</script>

<style lang="stylus" scoped>
.app-aside-nav
  display flex
  flex-direction column
  align-items center
  &__logo
    width 50.5px
    height 46.7px

.nav-list
  list-style none
  padding 0 7px
  margin 0
  &__link
    width 50px
    height 50px
    display flex
    justify-content center
    align-items center
    background-color white
    padding 0 7px
    position relative
    & + &
      .nav-list__list-item
        border-top 1px solid #d3d3d3
    // disable seperator if list item is after .router-link-exact-active
    .router-link-exact-active + & 
      .nav-list__list-item
        border-top none
  .router-link-exact-active
    background-color #ddcf21
    border-top none
  &__list-item
    width 100%
    height 50px
    display flex
    justify-content center
    align-items center
    p
      font-size 14px
      color #000000
      margin 0
      text-align center
    img
      width 30px
      height 30px

.online
  margin 12px 0 0 0
  text-align center
  &__calendar
    width 50px
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.3)
  &__text
    margin 5px 0
    font-size 10px
    color #444746
</style>

