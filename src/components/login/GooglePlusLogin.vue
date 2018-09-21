<template>
  <div class="google-plus-login" @click="login">
    <div class="google-plus-login__container">
      <i class="icon"></i>
      <span class="wording" v-text="labelWording"></span>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:GooglePlusLogin')
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
            return this.$t('login.WORDING_GOOGLE_REGISTER')
          case 'login':
            return this.$t('login.WORDING_GOOGLE_LOGIN')
          default:
            return ''
        }
      },
    },
    name: 'GooglePlusLogin',
    methods: {
      login () {
        this.$emit('update:isDoingLogin', true)
        const readyToLogin = (idToken) => {
          login(this.$store, { idToken, login_mode: 'google', }, get(this.$store, [ 'state', 'register-token', ]))
            .then((res) => {
              this.$emit('update:isDoingLogin', false)
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
        if (window && !window.googleStatus) {
          gapi && gapi.auth2.getAuthInstance().signIn({ scope: 'profile email', }).then((currUser) => {
            const idToken = currUser.getAuthResponse().id_token
            gapi.client.people.people.get({
              'resourceName': 'people/me',
              'requestMask.includeField': 'person.nicknames,person.genders,person.birthdays,person.occupations',
            }).then((response) => {
              debug('Never Authorized.')
              register(this.$store, {
                idToken,
                nickname: get(response, [ 'result', 'nicknames', 0, 'value', ], null),
                gender: get(response, [ 'result', 'genders', 0, 'value', ], '').toUpperCase().substr(0, 1),
                register_mode: 'oauth-goo',
              }, get(this.$store, [ 'state', 'register-token', ])).then(({ status, }) => {
                if (status === 200) {
                  debug('Register successfully.')
                  readyToLogin(idToken)
                }
              }).catch(({ err, }) => {
                if (err === 'User Already Existed' || err === 'User Duplicated') {
                  debug('User Already Existed')
                  readyToLogin(idToken)
                } else {
                  console.log(err)
                }
              })
            }, function (reason) {
              debug({ msg: 'Error: ' + reason.result.error.message, })
            })
          })
        } else {
          debug('Already authorized.')
          readyToLogin(window.googleStatus.idToken)
        }
      },
    },
    mounted () {},
    props: {
      type: {},
      isDoingLogin: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .google-plus-login
    cursor pointer

    width 100%
    height 35px
    padding 5px 34px
    background-color #ffffff

    font-size 1.125rem
    color #808080

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