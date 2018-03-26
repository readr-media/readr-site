<template>
  <div class="init-basic-profile">
    <div class="profile">
      <div class="profile__title">
        <div class="title" v-text="$t('login.WORDING_CREATE_PWD')"></div>
        <div class="email"></div>
      </div>
      <TextItem class="profile__nickname" type="text"
        :placeHolder="$t('login.WORDING_NICKNAME')"
        :alert.sync="alert.nickname"
        :value.sync="formData.nickname"></TextItem>
      <TextItem class="profile__pwd" type="password"
        :placeHolder="$t('login.WORDING_PASSWORD')"
        :alert.sync="alert.pwd"
        :value.sync="formData.pwd"></TextItem>
      <TextItem class="profile__pwd-check" type="password"
        :placeHolder="$t('login.WORDING_PASSWORD_CHECK')"
        :alert.sync="alert[ 'pwd-check' ]"
        :value.sync="formData[ 'pwd-check' ]"></TextItem>
      <div class="profile__save" @click="setPwd">
        <span v-text="$t('login.WORDING_BTN_SAVE')"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import TextItem from 'src/components/form/TextItem.vue'
  import validator from 'validator'

  const debug = require('debug')('CLIENT:TextItem')
  const setupBasicProfile = (store, params) => {
    return store.dispatch('SETUP_BASIC_PROFILE', { params, })
  }

  export default {
    components: {
      TextItem,
    },
    data () {
      return {
        alert: {},
        formData: {},
      }
    },
    name: 'InitBasicProfile',
    methods: {
      setPwd () {
        if (this.validate()) {
          setupBasicProfile(this.$store, {
            nickname: this.formData.nickname,
            password: this.formData.pwd,
          }).then((res) => {
            if (res.status === 200) {
              location.replace('/login')
            } else {
              console.log(res)
            }
          })
        }
      },
      validate () {
        let pass = true
        if (!this.formData.nickname || validator.isEmpty(this.formData.nickname)) {
          pass = false
          this.alert.nickname = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_NICKNAME_EMPTY'),
          }
          debug('Empty nickname', this.formData.nickname)
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alert.pwd = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
          }
          debug('Empty password', this.formData[ 'pwd' ])
        }
        if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
          pass = false
          this.alert[ 'pwd-check' ] = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY'),
          }
          debug('Empty password check', this.formData[ 'pwd-check' ])
        }
        if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
          this.alert.pwd = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL'),
          }  
          this.alert[ 'pwd-check' ] = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL'),
          }  
          debug('Password is not the same as password-check', this.formData.pwd, this.formData[ 'pwd-check' ])
          pass = false
        }
        this.$forceUpdate()
        return pass
      },
    },
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