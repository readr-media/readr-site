<template>
  <div class="facebook-login" @click="login">
    <div class="facebook-login__container">
      <i class="icon"></i>
      <span class="wording" v-text="labelWording"></span>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { consoleLogOnDev } from '../../util/comm'

  const login = (store, profile, token) => {
    return store.dispatch('LOGIN', {
      params: profile,
      token
    })
  }
  
  const register = (store, profile, token) => {
    return store.dispatch('REGISTER', {
      params: profile,
      token
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
      }
    },
    name: 'facebook-login',
    methods: {
      login () {
        const readyToLogin = (params) => {
          login(this.$store, params, _.get(this.$store, [ 'state', 'register-token' ]))
            .then((res) => {
              if (res.status === 200) {
                location.replace('/')
              }
            })
        }
        if (window && !window.fbStatus) {
          FB.login(() => {
            FB.api('/me', { fields: 'id,name,gender,email' }, (res) => {
              register(this.$store, {
                // nickname: '-',
                email: res.email,
                // gender: res.gender,
                register_mode: 'oauth-fb',
                social_id: res.id
              }, _.get(this.$store, [ 'state', 'register-token' ])).then(({ status }) => {
                this.isRegistered = true
                if (status === 200) {
                  consoleLogOnDev({ msg: 'successfully' })
                  readyToLogin({
                    id: res.id,
                    email: res.email,
                    login_mode: 'facebook'
                  })
                }
              }).catch(({ err }) => {
                if (err === 'User Already Existed') {
                  consoleLogOnDev({ msg: 'User Already Existed' })
                  readyToLogin({
                    id: res.id,
                    email: res.email,
                    login_mode: 'facebook'
                  })
                } else {
                  console.log(err)
                }
              })
            })
          }, { scope: 'public_profile,email' })
        } else {
          readyToLogin({
            id: window.fbStatus.uid,
            login_mode: 'facebook'
          })
        }
      }
    },
    mounted () {},
    props: [ 'type' ]
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