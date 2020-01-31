<template>
  <div
    class="google-plus-login"
    :class="{ light: theme === 'light' }"
    @click="login"
  >
    <div class="google-plus-login__container">
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

const debug = require('debug')('CLIENT:GooglePlusLogin')
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
  name: 'GooglePlusLogin',
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
      return this.$t('login.WORDING_GOOGLE_LOGIN')
    }
  },
  mounted () {},
  methods: {
    login () {
      const readyToLogin = (idToken) => {
        login(this.$store, { idToken, login_mode: 'google' }, get(this.$store, [ 'state', 'register-token' ]))
          .then((res) => {
            this.$emit('update:isDoingLogin', false)
            if (res.status === 200) {
              /**
                 * use location.replace instead of router.push to server-side render page
                 */
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

      // if not signed in google already
      if (window && !window.googleStatus) {
        const auth = gapi && gapi.auth2.getAuthInstance()
        if (!auth) { return }
        auth.signIn({ scope: 'profile email' }).then((currUser) => {
          this.$emit('update:isDoingLogin', true)
          const idToken = currUser.getAuthResponse().id_token
          gapi.client.people.people.get({
            'resourceName': 'people/me',
            'requestMask.includeField': 'person.nicknames,person.genders,person.birthdays,person.occupations'
          }).then((response) => {
            debug('Never Authorized.')
            register(
              this.$store,
              {
                idToken,
                nickname: get(response, [ 'result', 'nicknames', 0, 'value' ], null),
                gender: get(response, [ 'result', 'genders', 0, 'value' ], '').toUpperCase().substr(0, 1),
                register_mode: 'oauth-goo'
              },
              get(this.$store, [ 'state', 'register-token' ])
            ).then(({ status }) => {
              if (status === 200) {
                debug('Register successfully.')
                readyToLogin(idToken)
              }
            }).catch(err => {
              const error = err.response.body.Error
              const mode = err.response.body.Mode

              if (error === 'User Already Existed' || error === 'User Duplicated') {
                const signOutFromApp = () => {
                  this.$emit('update:isDoingLogin', false)
                  auth.disconnect()
                }
                switch (mode) {
                  case 'oauth-goo': {
                    readyToLogin(idToken)
                    break
                  }
                  case 'oauth-fb': {
                    switchConversation(this.$store, this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_FACEBOOK'))
                      .then(signOutFromApp)
                    break
                  }
                  case 'ordinary': {
                    this.$emit('update:isDoingLogin', false)
                    switchConversation(
                      this.$store,
                      `${this.$t('login.REGISTER_G_PLUS_EMAIL')} ${this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_ORDINARY')}`
                    ).then(signOutFromApp)
                    break
                  }
                }
              } else {
                console.log(error)
              }
            })
          }, function (reason) {
            debug({ msg: 'Error: ' + reason.result.error.message })
          })
        })
      } else {
        debug('Already authorized.')
        this.$emit('update:isDoingLogin', true)
        readyToLogin(window.googleStatus.idToken)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .google-plus-login
    cursor pointer

    width 100%
    height 35px
    padding 5px 34px
    background-color transparent
    border 1px solid #9b9b9b
    font-size 1.125rem
    color #9b9b9b

    &.light
      background-color #fff
      border none
      color #000

    margin-bottom 15px

    &__container
      display flex
      justify-content flex-start
      align-items center
      margin 0 auto
      width 240px
      height 100%
      > .icon
        display inline-block
        width 18px
        height 18px
        background-image url(/public/icons/google-logo-58x58.png)
        background-position center center
        background-size contain
        background-repeat no-repeat
        border-radius 3px
      > .wording
        margin-left 11px

</style>
