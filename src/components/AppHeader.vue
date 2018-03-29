<template>
  <div class="header">
    <div class="header__container">
      <div class="header__container__wrapper">
        <template v-if="!isLoginPage">
          <SearchTool></SearchTool>
          <div class="login-status" v-if="isClientSide">
            <div class="login-status__nickname login-status__item" v-text="userNickname" v-if="isLoggedIn" @click="goMemberCenter"></div>
            <a class="login-status__login-btn login-status__item" href="/login" v-text="$t('header.WORDING_HEADER_LOGIN')" v-if="!isLoggedIn"></a>
            <div class="login-status__logout-btn login-status__item" v-text="$t('header.WORDING_HEADER_LOGOUT')" v-else-if="isLoggedIn" @click="logout"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import { filter, get, } from 'lodash'
  import { ROLE_MAP, } from '../constants'
  import { removeToken, } from '../util/services'
  import SearchTool from 'src/components/search/SearchTool.vue'

  const debug = require('debug')('CLIENT:AppHeader')
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
    components: {
      SearchTool,
    },
    computed: {
      currentUser () {
        return get(this.$store, [ 'state', 'profile', ], {})
      },
      isLoggedIn () {
        return get(this.$store, [ 'state', 'isLoggedIn', ])
      },
      isLoginPage () {
        return /\/login/.test(get(this.$route, 'fullPath'))
      },
      userNickname () {
        return this.isLoggedIn && get(this.currentUser, [ 'nickname', ], get(this.currentUser, [ 'name', ], this.$t('header.WORIDNG_HEADER_MEMBER_CENTRE')))
      },
    },
    data () {
      return {
        isClientSide: false,
      }
    },
    name: 'AppHeader',
    methods: {
      goMemberCenter () {
        const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, [ 'state', 'profile', 'role', ]), }), [ 0, 'route', ], 'member')
        /**
         * use location.replace instead of router.push to server-side render page
         */
        location && location.replace(`/${memberCenter}`)
      },
      logout () {
        logout(this.$store).then(() => {
          return removeToken().then(() => {
            /**
              * use location.replace instead of router.push to server-side render page
              */
            location && location.replace('/login')
          })
        })
      },
    },
    mounted () {
      this.isClientSide = true
      debug('isLoginPage', this.isLoginPage)
    },
    beforeMount () {
      checkLoginStatus(this.$store).then(() => {
        if (this.isLoggedIn) {
          return getProfile(this.$store)
        }
        return
      })
    },
    props: [ 'sections', ],
  }
</script>
<style lang="stylus" scoped>
  .header
    position fixed
    left 0
    top 0
    width 100%
    z-index 999
    > div
      width 100%
      > div
        width 100%
        margin 0 auto
    &__container
      height 35px
      background-color #444746
      color #fff
      &__wrapper
        height 100%
        display flex
        align-items center
        // justify-content space-between
        justify-content flex-end
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
          // margin-left auto
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
      &__container
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