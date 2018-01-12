<template>
  <div class="header">
    <div class="header__top">
      <div class="header__top__wrapper">
        <div class="logo">
          <div class="logo__container"></div>
        </div>
        <div class="sharebar">
          <span></span>
          <i class="sharebar__search"></i>
          <i class="sharebar__fb-page"></i>
          <i class="sharebar__github"></i>
          <i class="sharebar__about"></i>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="header__bottom__wrapper">
        <div class="nav">
          <a v-for="(section, name) in sections" class="nav__item" :class="name" v-text="section" href="/"></a>
        </div>
        <div class="login-status" v-if="isClientSide">
          <div class="login-status__nickname login-status__item" v-text="userNickname" v-if="isLoggedIn" @click="goMemberCenter"></div>
          <a class="login-status__login-btn login-status__item" href="/login" v-text="wording.WORDING_HEADER_LOGIN" v-if="!isLoggedIn"></a>
          <div class="login-status__logout-btn login-status__item" v-text="wording.WORDING_HEADER_LOGOUT" v-else-if="isLoggedIn" @click="logout"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_HEADER_LOGIN, WORDING_HEADER_LOGOUT, WORIDNG_HEADER_MEMBER_CENTRE } from '../constants'
  import { ROLE_MAP } from '../constants'
  import { removeToken } from '../util/services'

  const checkLoginStatus = (store) => {
    return store.dispatch('CHECK_LOGIN_STATUS', {})
  }
  const getProfile = (store) => {
    return store.dispatch('GET_PROFILE', {})
  }
  const logout = (store) => {
    return store.dispatch('LOGOUT', {})
  }

  export default {
    computed: {
      currUrl () {
        return _.get(this.$router, [ 'fullpath' ])
      },
      currentUser () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      isLoggedIn () {
        return _.get(this.$store, [ 'state', 'isLoggedIn' ])
      },
      userNickname () {
        return this.isLoggedIn && _.get(this.currentUser, [ 'nickname' ], _.get(this.currentUser, [ 'name' ], this.wording.WORIDNG_HEADER_MEMBER_CENTRE))
      }
    },
    data () {
      return {
        isClientSide: false,
        wording: {
          WORDING_HEADER_LOGIN,
          WORDING_HEADER_LOGOUT,
          WORIDNG_HEADER_MEMBER_CENTRE
        }
      }
    },
    name: 'AppHeader',
    methods: {
      goMemberCenter () {
        const memberCenter = _.get(_.filter(ROLE_MAP, { key: _.get(this.$store, [ 'state', 'profile', 'role' ]) }), [ 0, 'route' ], 'member')
        location && location.replace(`/${memberCenter}`)
      },
      logout () {
        logout(this.$store).then(() => {
          return removeToken().then(() => {
            location && location.replace('/')
          })
        })
      }
    },
    mounted () {
      this.isClientSide = true
    },
    beforeMount () {
      checkLoginStatus(this.$store).then(() => {
        if (this.isLoggedIn) {
          return getProfile(this.$store)
        }
        return
      })
    },
    props: [ 'sections' ]
  }
</script>
<style lang="stylus" scoped>
  .header
    > div
      width 100%
      > div
        width 100%
        margin 0 auto
    &__top
      height 75px
      background-color #444746
      &__wrapper
        padding 15px 0
        height 100%
        display flex
        justify-content space-between
        align-items flex-start
        // > div
          // display inline-block
        .logo
          position relative
          width 93.6px
          height 100%
          &__container
            background-image url(/public/icons/readr-logo.png)
            background-position center center
            background-repeat no-repeat
            background-size contain          
            width 93.6px
            height 86.5px
            position absolute
            left 0
            top 0
        .sharebar
          > i
            background-position center center
            background-repeat no-repeat
            background-size contain
            width 30px
            height 30px
            display inline-block
            margin-left 10px
            vertical-align top
            cursor pointer
          &__search
            background-image url(/public/icons/search.png)
          &__fb-page
            background-image url(/public/icons/fb.png)
          &__github
            background-image url(/public/icons/github.png)
          &__about
            background-image url(/public/icons/info.png)

    &__bottom
      height 35px
      background-color #000
      color #fff
      &__wrapper
        height 100%
        display flex
        align-items center
        justify-content space-between
        .nav
          display flex
          align-items center
          padding-left 110px
          &__item
            color #fff
            display inline-block
            font-size 1.125rem
            font-weight 100
            // margin-right 26.5px
            // border-right 1px solid #fff
            padding 0 8px
            position relative
            &::after
              content ''
              position absolute
              right 0
              top 50%
              margin-top -7px
              width 1px
              height 14px
              background-color #fff
              display block
          &__item:first-child
            // border-left 1px solid #fff
            &::before
              content ''
              position absolute
              left 0
              top 50%
              margin-top -7px
              width 1px
              height 14px
              background-color #fff
              display block
        .login-status
          min-width 74px
          padding 0 7.5px 0 13px
          // border-right 1px solid #fff
          // border-left 1px solid #fff
          font-size 0.875rem
          height 100%
          display flex
          justify-content center
          align-items center
          a, a:hover, a:link, a:visited
            color #fff
          &__logout-btn
            cursor pointer
          &__item
            position relative
            padding 0 16.5px
            height 100%
            display flex
            justify-content center
            align-items center
            &:last-child
              padding-right 0
            &::after
              content ''
              position absolute
              left 0
              top 50%
              margin-top -7px
              width 1px
              height 14px
              background-color #fff
              display block
            
          &__nickname
            padding-right 38px
            color #ddcf21
            &::before
              content ''
              width 28px
              height 30px
              display block
              position absolute
              background-color transparent
              background-image url(/public/icons/account.png)
              background-position center center
              background-repeat no-repeat
              background-size contain
              bottom 0
              right 10px
            cursor pointer
  
  @media (max-width 768px)
    .header
      &__top
        height 25px
        &__wrapper
          padding 5px 0 5px 17px
          .sharebar
            display none
          .logo
            width 33px
            height 30px
            &__container
              width 100%
              height 100%

      &__bottom
        height 15px
        &__wrapper
          .nav, .login-status
            display none



  @media (min-width 950px)
    .header
      > div
        > div
          max-width 950px
</style>