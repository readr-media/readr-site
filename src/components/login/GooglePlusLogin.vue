<template>
  <div class="google-plus-login" @click="login">
    <i class="google-plus-login__icon"></i>
    <span class="google-plus-login__wording" v-text="labelWording"></span>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_GOOGLE_LOGIN, WORDING_GOOGLE_REGISTER } from '../../constants'
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
            return this.wording.WORDING_GOOGLE_REGISTER
          case 'login':
            return this.wording.WORDING_GOOGLE_LOGIN
          default:
            return ''
        }
      }
    },
    data () {
      return {
        wording: {
          WORDING_GOOGLE_LOGIN,
          WORDING_GOOGLE_REGISTER
        }
      }
    },
    name: 'google-plus-login',
    methods: {
      login () {
        const readyToLogin = (idToken) => {
          login(this.$store, { idToken, login_mode: 'google' }, _.get(this.$store, [ 'state', 'register-token' ]))
            .then((res) => {
              if (res.status === 200) {
                location.replace('/')
              }
            })
        }
        if (window && !window.googleStatus) {
          gapi && gapi.auth2.getAuthInstance().signIn({ scope: 'profile email' }).then((currUser) => {
            const idToken = currUser.getAuthResponse().id_token
            gapi.client.people.people.get({
              'resourceName': 'people/me',
              'requestMask.includeField': 'person.nicknames,person.genders,person.birthdays,person.occupations'
            }).then((response) => {
              register(this.$store, {
                idToken,
                nickname: _.get(response, [ 'nicknames', 0, 'value' ], '-'),
                // gender:  _.get(response, [ 'nicknames', 0, 'value' ], '-'),
                // occupation: _.get(response, [ 'occupations', 0, 'value' ], '-'),
                register_mode: 'google'
              }, _.get(this.$store, [ 'state', 'register-token' ])).then(({ status, err }) => {
                this.isRegistered = true
                if (status === 200) {
                  consoleLogOnDev({ msg: 'successfully' })
                  readyToLogin(idToken)
                }
              }).catch(({ status, err }) => {
                if (err === 'User Already Existed') {
                  consoleLogOnDev({ msg: 'User Already Existed' })
                  readyToLogin(idToken)
                } else {
                  console.log(err)
                }
              })
            }, function (reason) {
              consoleLogOnDev({ msg: 'Error: ' + reason.result.error.message })
            })
          })
        } else {
          readyToLogin(window.googleStatus.idToken)
        }
      }
    },
    mounted () {},
    props: [ 'type' ]
  }
</script>
<style lang="stylus" scoped>
  .google-plus-login
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
      background-image url(/public/icons/google-logo-58x58.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      border-radius 3px
    &__wording
      margin-left 11px

</style>