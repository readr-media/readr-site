<template>
  <div class="google-plus-login" @click="login">Google Login</div>
</template>
<script>
  import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../api/config' 
  import { consoleLogOnDev } from '../../util/comm'

  export default {
    name: 'google-plus-login',
    methods: {
      login () {
        consoleLogOnDev({ msg: 'trying to login by gPlus...' })
        gapi && gapi.auth2.getAuthInstance().signIn()
      },
      gapiLoadedHandler () {
        consoleLogOnDev({ msg: 'gapi onloaded...' })
        gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: [ 'https://people.googleapis.com/$discovery/rest?version=v1' ],
          clientId: GOOGLE_CLIENT_ID,
          scope: 'profile'
        }).then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
          this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        })
      },
      updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          this.makeApiCall()
        }
      },
      makeApiCall() {
        gapi.client.people.people.get({
          'resourceName': 'people/me',
          'requestMask.includeField': 'person.names'
        }).then(function(response) {
          consoleLogOnDev({ msg: 'Hello, ' + response.result.names[0].givenName })
        }, function(reason) {
          consoleLogOnDev({ msg: 'Error: ' + reason.result.error.message })
        })
      }
    },
    mounted () {
      window.gapi && window.gapi.load('client', this.gapiLoadedHandler)
    },
  }
</script>
<style lang="stylus" scoped>
  .google-plus-login
    width 200px
    height 80px
    background-color red
    cursor pointer
    color #fff
</style>