<template>
  <div class="facebook-login" @click="login">
    <i class="facebook-login__icon"></i>
    <span class="facebook-login__wording" v-text="labelWording"></span>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_FACEBOOK_LOGIN, WORDING_FACEBOOK_REGISTER } from '../../constants'
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
    data () {
      return {
        wording: {
          WORDING_FACEBOOK_LOGIN,
          WORDING_FACEBOOK_REGISTER
        }
      }
    },
    computed: {
      labelWording () {
        switch (this.type) {
          case 'register':
            return this.wording.WORDING_FACEBOOK_REGISTER
          case 'login':
            return this.wording.WORDING_FACEBOOK_LOGIN
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
          FB.login((response) => {
            FB.api('/me', { fields: 'id,name,gender,email' }, (res) => {
              register(this.$store, {
                // nickname: '-',
                email: res.email,
                // gender: res.gender,
                register_mode: 'facebook',
                social_id: res.id
              }, _.get(this.$store, [ 'state', 'register-token' ])).then(({ status, err }) => {
                this.isRegistered = true
                if (status === 200) {
                  consoleLogOnDev({ msg: 'successfully' })
                  readyToLogin({
                    id: res.id,
                    email: res.email,
                    login_mode: 'facebook'
                  })
                }
              }).catch(({ status, err }) => {
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
    display flex
    justify-content flex-start
    align-items center

    width 300px
    height 35px
    padding 5px 34px
    background-color #ffffff

    font-size 1.125rem
    color #808080

    margin-bottom 15px

    &__icon
      display inline-block
      width 18px
      height 18px
      background-image url(/public/icons/facebook-logo-58x58.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      border-radius 3px
    &__wording
      margin-left 11px

    
</style>