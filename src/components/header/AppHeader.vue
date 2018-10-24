<template>
  <header :class="{ 'header--backstage': isBackstage, home: isHome, }" class="header">
    <div class="header__wrapper">
      <router-link to="/" class="header__logo"><img src="/public/icons/readr-logo-backstage.svg" alt=""></router-link>
      <div v-if="isBackstage" class="header__item header--edit" @click="openControlBar">
        <img src="/public/icons/pen-white.png" alt="">
      </div>
      <SearchTool v-if="!isBackstage" class="header__item header--search"></SearchTool>
      <div class="header__item hamburger" @click="toggleMenu">
        <div class="hamburger__bar"></div>
        <div class="hamburger__bar"></div>
        <div class="hamburger__bar"></div>
      </div>
      
      <Notification class="header__item"></Notification>
      <div v-if="isClientSide && isLoggedIn" class="header__item header--account" v-click-outside="closeDropdown">
        <div @click="toggleDropdown">
          <span v-show="userNickname" v-text="userNickname"></span>
        </div>
        <div :class="{ active: openDropdown }" class="dropdown account">
          <div class="dropdown__item logout" @click="logout" v-text="$t('HEADER.LOGOUT')"></div>
          <div class="dropdown__item" @click="goMemberCenter('profile-edit')" v-text="$t('HEADER.SETTING')"></div>
          <div class="dropdown__item" @click="goMemberCenter('following')" v-text="$t('HEADER.POINT_RECOED')"></div>
          <div class="dropdown__item" @click="goMemberCenter('point-manager')" v-text="$t('HEADER.FOLLOWING_RECORD')"></div>
        </div>
      </div>
      <div v-if="isClientSide && !isLoggedIn" class="header__item header--status">
        <!--router-link to="/login" v-text="$t('HEADER.LOGIN')"></router-link-->
        <!--Use Alink for loading facebook/google sdk-->
        <a  href="/login" v-text="$t('HEADER.LOGIN')"></a>
      </div>
      <a href="https://www.mirrormedia.mg/" class="header__item" target="_blank">
        <img src="/public/icons/mirrormedia.png" alt="">
      </a>
      <section :class="{ open: openMenu }" class="header__menu">
        <ul>
          <li><router-link to="/about"><img src="/public/icons/info.png" alt=""></router-link></li>
          <li><a href="https://www.mirrormedia.mg/" target="_blank"><img src="/public/icons/mirrormedia.png" alt=""></a></li>
        </ul>
        <div class="header__menu-curtain" @click="toggleMenu"></div>
      </section>
    </div>
  </header>
</template>
<script>
  import { filter, get, } from 'lodash'
  import { ROLE_MAP, } from 'src/constants'
  import { removeToken, redirectToLogin, } from 'src/util/services'
  import { getFullUrl, isClientSide, } from 'src/util/comm'
  import Notification from 'src/components/header/Notification.vue'
  import SearchTool from 'src/components/search/SearchTool.vue'

  const logout = (store) => {
    return store.dispatch('LOGOUT', {})
  }

  export default {
    name: 'AppHeader',
    components: {
      Notification,
      SearchTool,
    },
    directives: {
      'click-outside': {
        bind (el, binding, vnode) {
          el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
              vnode.context[binding.expression](event)
            }
          }
          document.body.addEventListener('click', el.clickOutsideEvent)
        },
        unbind (el) {
          document.body.removeEventListener('click', el.clickOutsideEvent)
        },
      },
    },
    data () {
      return {
        openDropdown: false,
        openMenu: false,
      }
    },
    computed: {
      currentUser () {
        return get(this.$store.state, 'profile', {})
      },
      isBackstage () {
        const route = this.$route.fullPath.split('/')[1] || ''
        const regex = /^(admin|editor|guesteditor|member)$/
        return route.match(regex)
      },
      isClientSide,
      isLoggedIn () {
        return get(this.$store, 'state.isLoggedIn',)
      },
      isHome () {
        return this.$route.path === '/' || this.$route.path.indexOf('/post/') === 0 || this.$route.path === '/hot'
      },      
      profileImage () {
        return getFullUrl(get(this.currentUser, 'profileImage', '/public/icons/exclamation.png') || '/public/icons/exclamation.png')
      },
      userNickname () {
        return this.isLoggedIn && get(this.currentUser, 'nickname', get(this.currentUser, 'name', this.$t('HEADER.MEMBER_CENTRE')))
      },
    },
    methods: {
      closeDropdown () {
        this.openDropdown = false
      },
      goMemberCenter (name) {
        const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role',), }), [ 0, 'route', ], 'member')
        // /**
        //  * use location.replace instead of router.push to server-side render page
        //  */
        // location && location.replace(`/${memberCenter}`)
        this.$router.push(`/${memberCenter}/${name}`)
        this.openDropdown = false
      },
      logout () {
        this.openDropdown = false
        logout(this.$store).then(() => {
          const domain = get(this.$store, 'state.setting.DOMAIN')
          return removeToken(domain).then(() => {
            redirectToLogin(this.$route.fullPath)
          })
        })
      },
      openControlBar () {
        this.$emit('openControlBar')
      },
      toggleDropdown () {
        this.openDropdown = !this.openDropdown
      },
      toggleMenu () {
        this.openMenu = !this.openMenu
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .header
    position fixed
    left 0
    top 0
    z-index 999
    width 100%
    height 40px
    color #fff
    background-color #444746
    display flex
    justify-content center

    &__wrapper
      padding 0 15px 0 75px
      width 100%
      height 100%
      max-width 1200px
      display flex
      justify-content flex-end
      align-items center
      position relative
      // margin 0 240 0 0

    a
      color #fff
      cursor pointer
    .header__item
      height 25px
      padding 0 10px
      > img
        height 25px
    &__logo
      position absolute
      top 8px
      left 15px
      width 50px
      height auto
      z-index 2
    &__menu
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      z-index 10
      width 100%
      height 100vh
      margin 0
      opacity 0
      visibility hidden
      transition opacity 0.35s ease-out
      &.open
        visibility visible
        opacity 1
        ul
          right 0
      ul
        position relative
        right -100%
        z-index 10
        width 60%
        height 100%
        margin 0 0 0 40%
        padding 0
        background-color #ddcf21
        transition right 0.35s ease-out
        li
          position relative
          width 100%
          height 50%
          border-bottom 1px solid #fff
          list-style-type none
          &:last-of-type
            border-bottom none
          img
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            width 50px
            height 50px
      &-curtain
        position absolute
        top 0
        left 0
        bottom 0
        right 0
        width 100%
        height 100%
        background-color rgba(0, 0, 0, .6)
    &--edit
      img
        width 20px
        height 20px
    &--account
      position relative
      > div
        height 20px
        cursor pointer
      span
        display none
        margin-right 10px
        color #fff
        font-size .875rem
        line-height 25px
        vertical-align top
      img
        width 20px
        height 20px
        font-size .75rem
        object-fit cover
        object-position center center
        border-radius 50%
    &--status
      > a
        font-size 1rem
        font-weight 300
        line-height 25px
        letter-spacing 1px
        user-select none
  .hamburger
    display flex
    flex-direction column
    justify-content space-around
    outline none
    &__bar
      width 20px
      height 2px
      background-color #fff
  .dropdown
    position absolute
    top calc(100% + 7px)
    right 0
    min-width 100px
    height auto !important
    color #444746
    background-color: #fff
    box-shadow 0 0 2px rgba(0,0,0,.3)
    visibility hidden
    opacity 0
    transition opacity .5s, visibility 0s .5s
    &.active
      visibility visible
      opacity 1
      transition opacity .5s, visibility 0s .0s
    &__item
      padding 5px 10px
      text-align center
      font-size .75rem
      &:hover
        background-color #ddcf21
      & + .dropdown__item
        border-top 1px solid #d3d3d3

  @media (min-width 1440px)
    .home
      &.header
        padding-right 240px

  @media (min-width 769px)
    .header
      > div:first-of-type
        border-left none
      &.header--backstage
        .header--account
          border none
      .header__item
        padding 0 5px
        margin 0 5px
      .header__item.header--edit
        display none
      .header__item.hamburger
        display none
      .header__menu
        display none
      &--account
        span
          display inline
    .dropdown
      left 0
      right 0
      width calc(100% - 20px)
          
</style>