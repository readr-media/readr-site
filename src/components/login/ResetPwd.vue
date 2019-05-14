<template>
  <div class="reset-pwd">
    <div class="reset-pwd__title">
      <div
        class="title"
        v-text="$t('login.WORDING_LOGIN_RESET_PWD')"
      />
      <div class="email" />
    </div>
    <TextItem
      v-if="!isDone"
      class="reset-pwd__pwd"
      type="password"
      :place-holder="$t('login.WORDING_PASSWORD')"
      :alert.sync="alert.pwd"
      :value.sync="formData.pwd"
    />
    <TextItem
      v-if="!isDone"
      class="reset-pwd__pwd-check"
      type="password"
      :place-holder="$t('login.WORDING_PASSWORD_CHECK')"
      :alert.sync="alert[ 'pwd-check' ]"
      :value.sync="formData[ 'pwd-check' ]"
    />
    <div
      v-if="!isDone"
      class="reset-pwd__btn"
      :class="{ disabled: shouldShowSpinner }"
      @click="save"
    >
      <span
        v-if="!shouldShowSpinner"
        v-text="$t('login.WORDING_BTN_SAVE')"
      />
      <Spinner :show="shouldShowSpinner" />
    </div>
    <div
      v-else
      class="reset-pwd__result"
    >
      <span v-text="result" />
    </div>
  </div>
</template>
<script>
import TextItem from 'src/components/form/TextItem.vue'
import Spinner from 'src/components/Spinner.vue'
import validator from 'validator'

const debug = require('debug')('CLIENT:SetPassword')
const resetpwd = (store, params) => (store.dispatch('RESET_PWD', {
  params
}))
export default {
  name: 'ResetPwd',
  components: {
    TextItem,
    Spinner
  },
  data () {
    return {
      alert: {},
      formData: {},
      isDone: false,
      result: '',
      shouldShowSpinner: false
    }
  },
  mounted () {

  },
  methods: {
    save () {
      if (this.validate()) {
        this.shouldShowSpinner = true
        debug('About to save password')
        resetpwd(this.$store, {
          password: this.formData.pwd
        }).then(res => {
          debug(res)
          this.isDone = true
          this.shouldShowSpinner = false
          if (res.status === 200) {
            this.result = this.$t('login.WORDING_LOGIN_RESET_PWD_COMPLETE')
          } else {
            this.result = this.$t('login.WORDING_LOGIN_RESET_PWD_INFAIL')
          }
        }).catch(err => {
          debug(err)
          this.isDone = true
          this.shouldShowSpinner = false
          this.result = this.$t('login.WORDING_LOGIN_RESET_PWD_INFAIL')
        })
      }
    },
    setInputValue (key, value) {
      switch (key) {
        case 'pwd':
          this.formData.pwd = value
          break
        case 'pwd-check':
          this.formData[ 'pwd-check' ] = value
          break
      }
    },
    validate () {
      let pass = true
      if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
        pass = false
        this.alert.pwd = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY')
        }
        debug('pwd empty', this.formData.pwd)
      }
      if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
        pass = false
        this.alert[ 'pwd-check' ] = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY')
        }
        debug('pwd-check empty,', this.formData[ 'pwd-check' ])
      }
      if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
        this.alert.pwd = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
        }
        this.alert[ 'pwd-check' ] = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
        }
        pass = false
        debug('pwd != pwd check,', this.formData.pwd, ',', this.formData[ 'pwd-check' ])
      }
      this.$forceUpdate()
      return pass
    }
  }
}
</script>
<style lang="stylus" scoped>
  .reset-pwd
    width 100%
    background-color #d8d8d8
    margin 30px auto 0
    padding 18px 75px
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
    &__btn
      display flex
      justify-content center
      align-items center
      background-color #444746
      color #ddcf21
      font-size 1.125rem
      // padding 5px
      height 35px
      cursor pointer
      &.disabled
        background-color #c5c5c5
        color #a5a5a5
      &:hover
        background-color #737373

  @media (min-width 750px)
    .reset-pwd
      width 750px
</style>
