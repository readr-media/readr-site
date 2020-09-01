<template>
  <div class="donate-result">
    <div
      v-if="isResultSuccess"
      class="donate-result__success success"
    >
      <p>贊助成功！</p>
      <p>謝謝贊助，以下是本次的贊助明細，發票會寄送到電子信箱</p>
      <p v-if="isSubscription">
        下個月同一日期會再次進行扣款，並寄送發票明細於電子信箱
      </p>
      <p>如果有任何問題，歡迎聯繫我們：<a href="mailto:readr@readr.tw">readr@readr.tw</a> ／ 02-6633-3805</p>
      <div class="success__result-table-wrapper result-table-wrapper">
        <table class="result-table-wrapper__table table">
          <tr>
            <td>{{ isSubscription ? '定期' : '' }}贊助金額：</td>
            <td>{{ formData.donateAmount }} 元</td>
          </tr>
          <tr>
            <td>本次贊助時間：</td>
            <td>{{ formData.date }}</td>
          </tr>
          <tr>
            <td>付款方式：</td>
            <td>信用卡</td>
          </tr>
        </table>
      </div>
      <button
        class="button button--white"
        @click="$emit('backToForm')"
      >
        再次贊助
      </button>
    </div>
    <div
      v-else
      class="donate-result__fail fail"
    >
      <p>付款失敗，是否再次嘗試？</p>
      <div class="fail__buttons buttons">
        <button
          class="buttons__button button button--yellow"
          @click="$emit('backToForm')"
        >
          確認
        </button>
        <button
          class="buttons__button button button--white"
          @click="SET_SHOW_SIDEBAR(false)"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'DonateResult',
  props: {
    isResultSuccess: {
      type: Boolean,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  computed: {
    isSubscription () {
      return this.formData.isSubscription
    }
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR'
    })
  }
}
</script>

<style lang="stylus" scoped>
.donate-result
  display flex
  justify-content center
  align-items center
  min-height calc(100vh - 50px - 177px)

.success
  width 500px
  margin 0 auto
  p
    line-height 1.6
    &:nth-child(1)
      text-align center
      font-size 24px
      font-weight 500
    &:nth-child(2)
      margin 22px 0 0 0
    &:last-of-type
      margin-top 22px
  &__result-table-wrapper
    margin 30px 0 0 0
    + button
      margin-top 80px

.table
  border-collapse collapse
  font-size 16px
  width 100%
  td
    padding 10px 3px
    &:nth-child(1)
      font-weight 500
  tr + tr
    border-top 1px dashed black

.fail
  width auto
  display flex
  flex-direction column
  justify-content center
  align-items center
  p
    font-size 24px
    font-weight 500
  &__buttons
    margin 60px 0 0 0

.buttons
  width 500px
  &__button
    & + &
      margin 20px 0 0 0

.button
  width 100%
  height 50px
  border-radius 8px
  background-color gray
  font-size 24px
  font-weight 500
  display flex
  justify-content center
  align-items center
  border 1px solid black
  &--yellow
    background-color #ddcf21
  &--white
    background-color white
  &--small
    font-weight 400
    height 30px
</style>
