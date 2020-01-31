<template>
  <div
    class="facebook-login"
    :class="{ light: theme === 'light' }"
    @click="login"
  >
    <div class="facebook-login__container">
      <i class="icon" />
      <span
        class="wording"
        v-text="labelWording"
      />
    </div>
  </div>
</template>
<script>
import { get } from 'lodash'
import VueCookie from 'vue-cookie'

const debug = require('debug')('CLIENT:FacebookLogin')
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
const switchConversation = (store, message) => store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: true, message })
const switchOffLoginAsk = store => store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: false, message: '' })

export default {
  name: 'FacebookLogin',
  /* eslint-disable */
  props: {
    type: {},
    isDoingLogin: {
      type: Boolean,
      default: false
    },
    theme: {},
    panelType: {}
  },
  /* eslint-enable */
  computed: {
    labelWording () {
      return this.$t('login.WORDING_FACEBOOK_LOGIN')
    }
  },
  methods: {
    login () {
      const readyToLogin = (params) => {
        login(this.$store, params, get(this.$store, 'state.register-token'))
          .then((res) => {
            this.$emit('update:isDoingLogin', false)
            if (res.status === 200) {
              const from = VueCookie.get('location-replace-from')
              const isFromPathExist = from !== null
              if (this.panelType === 'WINDOW') {
                window.opener.location.reload()
                window.close()
              } else if (isFromPathExist) {
                VueCookie.delete('location-replace-from')
                this.$router.push(from)
              } else {
                this.$router.push('/')
              }
              // revolke switchOffLoginAsk for LoginLight
              switchOffLoginAsk(this.$store)
            } else {
              debug('res', res)
            }
          })
      }
      debug('Checking fb status before login...', window.fbStatus)
      if (window && !window.fbStatus) {
        debug('Never Authorized.')
        FB.login(response => {
          if (response.authResponse) {
            this.$emit('update:isDoingLogin', true)
            FB.api('/me', { fields: 'id,name,gender,email' }, res => {
              if (!res || res.error) {
                console.log(`Err occurred when fetch user's info from facebook`)
                this.$emit('update:isDoingLogin', false)
              } else {
                register(
                  this.$store,
                  {
                    nickname: get(res, 'name'),
                    email: res.email,
                    gender: get(res, 'genders', '').toUpperCase().substr(0, 1),
                    register_mode: 'oauth-fb',
                    social_id: res.id
                  },
                  get(this.$store, [ 'state', 'register-token' ])
                ).then(({ status }) => {
                  if (status === 200) {
                    debug('Registered successfully')
                    readyToLogin({
                      id: res.id,
                      login_mode: 'facebook'
                    })
                  }
                }).catch(err => {
                  const error = err.response.body.Error
                  const mode = err.response.body.Mode

                  if (error === 'User Already Existed' || error === 'User Duplicated') {
                    const signOutFromApp = () => {
                      this.$emit('update:isDoingLogin', false)
                      FB.logout()
                    }
                    switch (mode) {
                      case 'oauth-fb': {
                        readyToLogin({
                          id: res.id,
                          login_mode: 'facebook'
                        })
                        break
                      }
                      case 'oauth-goo': {
                        switchConversation(this.$store, this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_G_PLUS'))
                          .then(signOutFromApp)
                        break
                      }
                      case 'ordinary': {
                        switchConversation(
                          this.$store,
                          `${this.$t('login.REGISTER_FACEBOOK_EMAIL')} ${this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_ORDINARY')}`
                        ).then(signOutFromApp)
                        break
                      }
                    }
                  } else {
                    console.log(error)
                    this.$emit('update:isDoingLogin', false)
                  }
                })
              }
            })
          } else {
            console.log('User cancelled login or did not fully authorize.')
          }
        }, { scope: 'public_profile,email' })
      } else {
        debug('Already authorized.')
        this.$emit('update:isDoingLogin', true)
        readyToLogin({
          id: window.fbStatus.uid,
          login_mode: 'facebook'
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .facebook-login
    cursor pointer

    width 100%
    height 35px
    padding 5px 34px
    background-color transparent
    border 1px solid #9b9b9b
    font-size 1.125rem
    color #9b9b9b

    &.light
      background-color #3c5a99
      border none
      color #fff
      .facebook-login__container
        > .icon
          background-image url(/public/icons/fb-white-square.png)

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
