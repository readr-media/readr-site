<template>
  <div class="init-basic-profile">
    <div class="profile">
      <div class="profile__title">
        <div class="title" v-text="wording.WORDING_CREATE_PWD"></div>
        <div class="email"></div>
      </div>
      <InputItem class="profile__nickname" type="text" :placeHolder="wording.WORDING_NICKNAME"></InputItem>
      <InputItem class="profile__pwd" type="password" :placeHolder="wording.WORDING_PASSWORD"></InputItem>
      <InputItem class="profile__pwd-check" type="password" :placeHolder="wording.WORDING_PASSWORD_CHECK"></InputItem>
      <div class="profile__save">
        <span v-text="wording.WORDING_BTN_SAVE"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from '../form/InputItem.vue'
  import { WORDING_NICKNAME, WORDING_PASSWORD, WORDING_PASSWORD_CHECK, WORDING_REGISTER } from '../../constants'
  import { WORDING_BTN_SAVE, WORDING_CREATE_PWD } from '../../constants'

  export default {
    components: {
      InputItem
    },
    data () {
      return {
        wording: {
          WORDING_NICKNAME,
          WORDING_PASSWORD,
          WORDING_PASSWORD_CHECK,
          WORDING_BTN_SAVE,
          WORDING_CREATE_PWD
        }
      }
    },
    name: 'InitBasicProfile',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .init-basic-profile
    width 100%
    background-color #d8d8d8
    margin 30px auto 0
    padding 18px 75px
    .profile
      > div
        margin 15px auto
        &.profile__nickname
          margin-top 40px
        &.profile__save
          margin-top 60px
      &__title
        .title
          font-size 1.125rem
          font-weight 600
          color #000
      &__save
        display flex
        justify-content center
        align-items center
        background-color #444746
        color #ddcf21
        font-size 1.125rem
        padding 5px
        cursor pointer

  @media (min-width 750px)
    .init-basic-profile
      width 750px
</style>