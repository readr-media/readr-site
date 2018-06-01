<template>
  <nav class="app-aside-nav">
    <router-link to="/"><img class="app-aside-nav__logo" src="/public/icons/readr-logo-backstage.svg" alt=""></router-link>
    <ol class="nav-list">
      <router-link class="nav-list__link" to="/">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.CHIEF_EDITOR_TALK')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/hot">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.HOT_TALK')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/editors">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.CHIEF_EDITOR_LIST')"></p>
        </li>
      </router-link>
      <router-link class="nav-list__link" to="/projects">
        <li class="nav-list__list-item">
          <p v-text="$t('SECTIONS.PROJECTS')"></p>
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
  margin 5px 0 0 0
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
    height 50px
    display flex
    justify-content center
    align-items center
    p
      font-size 18px
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      color #000000
      margin 0
    img
      width 30px
      height 30px
</style>

