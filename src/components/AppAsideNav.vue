<template>
  <nav class="app-aside-nav">
    <!-- <router-link to="/"><img class="app-aside-nav__logo" :src="[ isBackstage ? '/public/icons/readr-logo-backstage.svg' : '/public/icons/readr-logo-dark.svg' ]" alt=""></router-link> -->
    <router-link to="/"><img class="app-aside-nav__logo" src="/public/icons/readr-logo-dark.svg" alt=""></router-link>
    <ol class="aside-navigation">
      <div class="aside-navigation__section--white">
        <!-- <transition name="fade" mode="out-in"> -->
          <router-link
            :to="$route.path === '/hot' ? '/' : '/hot'"
            :class="`list-item aside-navigation__list-item-drawer`"
            v-show="isHoverFirstListItem"
            @mouseover.native="isHoverFirstListItem = true"
            @mouseout.native="isHoverFirstListItem = false">
            <span v-text="$t(`SECTIONS.${$route.path === '/hot' ? 'CHIEF_EDITOR_TALK' : 'HOT_TALK'}`)"></span>
          </router-link>
        <!-- </transition> -->
        <router-link
          :to="$route.path === '/hot' ? '/hot' : '/'"
          :class="`list-item aside-navigation__list-item${$route.path === '/' || $route.path === '/hot' ? '--highlight' : ''}`"
          @mouseover.native="isHoverFirstListItem = true"
          @mouseout.native="isHoverFirstListItem = false">
          <span v-text="$t(`SECTIONS.${$route.path === '/hot' ? 'HOT_TALK' : 'CHIEF_EDITOR_TALK'}`)"></span>
          <span class="option">
            <span class="option__dot"></span>
            <span class="option__dot"></span>
            <span class="option__dot"></span>
          </span>
        </router-link>
        <!-- <router-link :class="`list-item aside-navigation__list-item${isCurrentRoute('/videos') ? '--highlight' : ''}`" to="/videos"><span v-text="wording['celebrities-talk']"></span></router-link> -->
        <router-link :class="`list-item aside-navigation__list-item${isCurrentRoutePath('/editors') ? '--highlight' : ''}`" to="/editors"><span v-text="$t('SECTIONS.CHIEF_EDITOR_LIST')"></span></router-link>
        <router-link :class="`list-item aside-navigation__list-item${isCurrentRoutePath('/projects') ? '--highlight' : ''}`" to="/projects"><span v-text="$t('SECTIONS.PROJECTS')"></span></router-link>
      </div>
      <div class="aside-navigation__external--gray">
        <!-- <a class="list-item aside-navigation__list-item" href="/"><span><img src="/public/icons/fb.png" alt="fb"></span></a> -->
        <!-- <a class="list-item aside-navigation__list-item" href="/"><span><img src="/public/icons/github.png" alt="github"></span></a> -->
        <router-link class="list-item aside-navigation__list-item" to="/about"><span><img src="/public/icons/info.png" alt="info"></span></router-link>
        <a class="list-item aside-navigation__list-item" href="https://www.mirrormedia.mg/" target="_blank"><span><img src="/public/icons/mirrormedia.png" alt="info"></span></a>
      </div>
      <div class="aside-navigation__section--white">
        <router-link :to="`/profile/${ANNOUNCEMENT_ACCOUNT_ID}`" class="list-item aside-navigation__list-item"><span><img src="/public/icons/announcement.png" alt="info"></span></router-link>
        <InviteSwitcher class="list-item aside-navigation__list-item"><span slot="icon"><img src="/public/icons/invite.png" alt="info"></span></InviteSwitcher>
      </div>
    </ol>
  </nav>
</template>

<script>
import { ANNOUNCEMENT_ACCOUNT_ID, } from 'src/constants'
import { currEnv, isCurrentRoutePath, } from 'src/util/comm'
import { get, } from 'lodash'
import InviteSwitcher from 'src/components/invitation/InviteSwitcher.vue'

export default {
  name: 'AppAsideNav',
  components: {
    InviteSwitcher,
  },
  data () {
    return {
      isHoverFirstListItem: false,
      ANNOUNCEMENT_ACCOUNT_ID,
    }
  },
  computed: {
    currEnv,
    isBackstage () {
      return [ 'admin', 'editor', 'guesteditor', 'member', ].includes(this.$route.fullPath.split('/')[1])
    },
    isClientSide () {
      return get(this.$store, 'state.isClientSide', false)
    },
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
    width 75px
    height 69px
    // transform scale(.673)

$aside-navigation__section
  flex 4 4 auto
  display flex
  flex-direction column
$aside-navigation__external
  flex 4 4 auto
  display flex
  flex-direction column
$aside-navigation__list-item
  list-style-type none
  flex 1 1 auto
  font-size 18px
  -webkit-font-smoothing: antialiased
  width 50px
  height 50px
  padding 0 7px
  // Set section name and external image container
  & > span:not(.option)
    display inline-block
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    & > img
      width 30px
      height 30px
$aside-navigation__list-item-drawer
  @extends $aside-navigation__list-item
  position absolute !important
  top 0
  left 50px
  background-color white
.aside-navigation
  margin-top 9.5px
  width 50px
  display flex
  flex-direction column
  padding 0
  position relative
  &__section
    &--white
      @extends $aside-navigation__section
      background-color white
      border .5px solid #d3d3d3
      // Set different font color based on background-color
      & > .list-item
        & > span
          color black
        & + .list-item
          & > span:not(.option)
            border-top .5px solid #d3d3d3
  &__external
    &--gray
      @extends $aside-navigation__external
      background-color #d3d3d3
      border .5px solid #d3d3d3
      // Set different font color based on background-color
      & > .list-item
        & > span
          color white
        & + .list-item
          & > span
            border-top .5px solid white
  &__list-item
    @extends $aside-navigation__list-item
    &--highlight
      @extends $aside-navigation__list-item
      background-color #ddcf21
      .option__dot
        background-color white !important
      // Remove border-top of list-item which is under the highlighted list-item
      & + .list-item
        & > span
          border-top none !important
  &__list-item-drawer
    @extends $aside-navigation__list-item-drawer
    & + .list-item
      & > span
        border-top none !important
    
.list-item
  position relative
  // transition opacity .25s

.option
  position absolute
  bottom 6.5px
  width 36px
  height 6px
  display flex
  justify-content space-around
  &__dot
    r = 6px
    width r
    height r
    border-radius r
    background-color #d3d3d3
</style>

