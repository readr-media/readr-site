<template>
  <section class="account-setting">
    <div>
      <h2>個人設定</h2>
      <ChangeProfile :profile="profile" />
    </div>
    <div>
      <h2>帳號設定</h2>
      <ChangePassword :profile="profile" />
    </div>
  </section>
</template>
<script>
import ChangePassword from 'src/components/member/ChangePassword.vue'
import ChangeProfile from 'src/components/member/ChangeProfile.vue'

export default {
  name: 'AccountSetting',
  components: {
    ChangePassword,
    ChangeProfile
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.account-setting
  div
    & + div
      margin-top 25px
  h2
    position relative
    padding 0 0 0 25px
    &::before
      content ''
      position absolute
      top 50%
      left 0
      transform translateY(-50%)
      width 15px
      height 15px
      background-color #11b8c9
    & + div
      margin-top 1em
</style>
