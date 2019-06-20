<template>
  <div class="change-password">
    <p><strong>修改密碼</strong></p>
    <div>
      <div class="change-password__row">
        <p>目前密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="originPassword"
          :show-error-message="errorOfOriginPassword"
          :error-message="'請提供正確密碼'"
          class="change-password__input"
        />
      </div>
      <div class="change-password__row">
        <p>新密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="newPassword"
          :show-error-message="errorOfNewPassword"
          :error-message="errorMessageOfNewPassword"
          class="change-password__input"
        />
      </div>
      <div class="change-password__row">
        <p>確認密碼</p>
        <InputWithErrorMessage
          :type="'password'"
          :init-value.sync="confirmPassword"
          :show-error-message="errorOfConfirmPassword"
          :error-message="'「新密碼」與「確認密碼」不同，請輸入相同之密碼'"
          class="change-password__input"
        />
      </div>
    </div>
    <button
      :disabled="disableSubmitBtn"
      @click="validate"
    >
      更改密碼
    </button>
    <p
      v-if="isSuccess"
      class="msg small"
    >
      更改成功，稍後將導向至首頁
    </p>
    <p
      v-if="isFailure"
      class="msg msg-failure small"
    >
      系統發生異常，請稍候再試
    </p>
  </div>
</template>
<script>
import InputWithErrorMessage from '../form/InputWithErrorMessage.vue'

import { get } from 'lodash'
import { mapActions } from 'vuex'
import { removeToken } from 'src/util/services'
import { setTimeout } from 'timers'

const debug = require('debug')('CLIENT:ChangePassword')

export default {
  name: 'ChangePassword',
  components: {
    InputWithErrorMessage
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      confirmPassword: '',
      errors: [],
      isFailure: false,
      isSuccess: false,
      newPassword: '',
      originPassword: ''
    }
  },
  computed: {
    disableSubmitBtn () {
      return !this.originPassword && !this.newPassword && !this.confirmPassword
    },
    errorOfConfirmPassword () {
      return this.errors.filter(error => error.match(/confirm/)).length > 0
    },
    errorOfNewPassword () {
      return this.errors.filter(error => error.match(/new/)).length > 0
    },
    errorOfOriginPassword () {
      return this.errors.filter(error => error.match(/origin/)).length > 0
    },
    errorMessageOfNewPassword () {
      const error = this.errors.find(error => error.match(/new/))
      const message = {
        'new-empty': '請輸入新密碼',
        'new-not-change': '新密碼與目前密碼相同'
      }
      return message[error]
    }
  },
  methods: {
    ...mapActions({
      CHECK_PASSWORD: 'DataUser/CHECK_PASSWORD',
      LOGOUT: 'DataUser/LOGOUT',
      UPDATE_PASSWORD: 'DataUser/UPDATE_PASSWORD'
    }),
    validate () {
      this.errors = []
      if (!this.originPassword) {
        this.errors.push('origin')
      }
      if (!this.newPassword) {
        this.errors.push('new-empty')
      }

      if (this.newPassword === this.originPassword) {
        this.errors.push('new-not-change')
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errors.push('confirm')
      }

      if (this.errors.length === 0) {
        this.CHECK_PASSWORD({
          email: this.profile.mail,
          password: this.originPassword
        })
          .then(res => {
            this.updatePassword()
          })
          .catch(err => {
            this.errors.push('origin')
            debug('check password failed', err)
          })
      }
    },
    updatePassword () {
      this.UPDATE_PASSWORD({ password: this.newPassword })
        .then(() => {
          this.isSuccess = true
          setTimeout(() => {
            const domain = get(this.$store, 'state.setting.DOMAIN')
            removeToken(domain)
            this.LOGOUT()
            this.$router.push('/')
          }, 3000)
        })
        .catch(err => {
          this.isFailure = true
          debug('update password failed', err)
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
.change-password
  display flex
  flex-direction column
  button
    align-self flex-end
    width calc(100% - 125px)
    height 30px
    color #fff
    background-color #11b8c9
  > div
    margin-top 1em
    & + button
      margin-top 1em
  &__row
    display flex
    & + .change-password__row
      margin-top 1em
    p
      min-width 75px
      height 30px
      line-height 30px
  &__input
    flex 1
    margin-left 50px
    >>> input
      height 30px
      border 1px solid #979797
  .msg
    margin-top .5em
    text-align right
    &-failure
      color red
</style>
