<template>
  <div class="facebook-login" @click="login">
    <div class="facebook-login__container">
      <i class="icon"></i>
      <span class="wording" v-text="labelWording"></span>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:FacebookLogin')
  const login = (store, profile, token) => {
    return store.dispatch('LOGIN', {
      params: profile,
      token,
    })
  }
  const register = (store, profile, token) => {
    return store.dispatch('REGISTER', {
      params: profile,
      token,
    })
  }

  export default {
    computed: {
      labelWording () {
        switch (this.type) {
          case 'register':
            return this.$t('login.WORDING_FACEBOOK_REGISTER')
          case 'login':
            return this.$t('login.WORDING_FACEBOOK_LOGIN')
          default:
            return ''
        }
      },
    },
    name: 'FacebookLogin',
    methods: {
      login () {
        const readyToLogin = (params) => {
          login(this.$store, params, get(this.$store, [ 'state', 'register-token', ]))
            .then((res) => {
              if (res.status === 200) {
                /**
                 * use location.replace instead of router.push to server-side render page
                 */
                location.replace('/')
              } else {
                debug('res', res)
              }
            })
        }
        debug('Checking fb status before login...', window.fbStatus)
        if (window && !window.fbStatus) {
          debug('Never Authorized.')
          FB.login(() => {
            FB.api('/me', { fields: 'id,name,gender,email', }, (res) => {
              register(this.$store, {
                nickname: get(res, 'name'),
                email: res.email,
                gender: get(res, 'genders', '').toUpperCase().substr(0, 1),
                register_mode: 'oauth-fb',
                social_id: res.id,
              }, get(this.$store, [ 'state', 'register-token', ])).then(({ status, }) => {
                if (status === 200) {
                  debug('Registered successfully')
                  readyToLogin({
                    id: res.id,
                    login_mode: 'facebook',
                  })
                }
              }).catch(({ err, }) => {
                if (err === 'User Already Existed' || err === 'User Duplicated') {
                  debug('User Already Existed')
                  readyToLogin({
                    id: res.id,
                    login_mode: 'facebook',
                  })
                } else {
                  console.log(err)
                }
              })
            })
          }, { scope: 'public_profile,email', })
        } else {
          debug('Already authorized.')
          readyToLogin({
            id: window.fbStatus.uid,
            login_mode: 'facebook',
          })
        }
      },
    },
    props: [ 'type', ],
  }
</script>
<style lang="stylus" scoped>
  .facebook-login
    cursor pointer


    width 100%
    height 35px
    padding 5px 34px
    background-color #ffffff

    font-size 1.125rem
    color #808080

    margin-bottom 15px
    &__container
      width 240px
      height 100%
      display flex
      justify-content flex-start
      align-items center
      margin 0 auto
      > .icon
        display inline-block
        width 18px
        height 18px
        background-image url(/public/icons/facebook-logo-58x58.png)
        background-position center center
        background-size contain
        background-repeat no-repeat
        border-radius 3px
      > .wording
        margin-left 11px

    
</style>