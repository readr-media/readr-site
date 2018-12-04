<template>
  <div class="article-nav-login-alert" v-if="active">
    <div class="container">
      <div class="message"><span v-text="message"></span></div>
      <div class="wrapper">
        <div class="confirm" @click="closeAlert"><span v-text="$t('POST_CONTENT.CONFIRM')"></span></div>
        <div class="login" @click="goLogin" v-if="type === TYPE.GO_LOGIN"><span v-text="$t('POST_CONTENT.GO_LOGIN')"></span></div>
      </div>    
    </div>
  </div>
</template>
<script>
  import { redirectToLogin, } from 'src/util/services'
  import { get, } from 'lodash'

  const TYPE = {
    CONFIRM: 'CONFIRM',
    GO_LOGIN: 'GO_LOGIN',
  }
  const switchOff = store => store.dispatch('CONVERSATION_TOGGLE', { active: false, message: '', })

  export default {
    name: 'Conversation',
    computed: {
      active () {
        return get(this.$store, 'state.conversationFlag.active', false)
      },
      message () {
        return get(this.$store, 'state.conversationFlag.message', '')
      },
      type () {
        return get(this.$store, 'state.conversationFlag.type', 'confirm')
      },
    },
    data () {
      return {
        TYPE,
      }
    },
    methods: {
      closeAlert () {
        switchOff(this.$store)
      },
      goLogin () {
        redirectToLogin(this.$route.fullPath, this.$router)
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .article-nav-login-alert
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgba(0,0,0,0.5)
    display flex
    justify-content center
    align-items center
    z-index 9999999
    .container
      padding 30px 40px
      background-color #f3f3f3
      border-radius 5px
      min-width 300px
      display flex
      justify-content center
      align-items center
      flex-direction column
      .wrapper
        display flex
        width 100%
        height 40px
        margin-top 20px
        justify-content center
        align-items center
        > div
          padding 5px 20px
          cursor pointer
          display flex
          justify-content center
          align-items center
          font-size 0.9375rem
          box-shadow 0 0 10px rgba(0,0,0,0.1)
          &:not(:first-child)
            margin-left 20px
        .confirm
          border-radius 3px
          background-color #d3d3d3
          &:hover
            background-color #b7b7b7
        .login
          &:hover
            background-color #c5b81d
          background-color #ddcf21
</style>