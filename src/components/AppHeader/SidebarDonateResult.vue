<template>
  <div class="donate-result">
    <div
      v-if="isResultSuccess"
      class="donate-result__success success"
    >
      <p>贊助成功！</p>
      <p>謝謝贊助，以下是贊助明細，發票會寄送到電子信箱</p>
      <div class="success__result-table-wrapper result-table-wrapper">
        <table class="result-table-wrapper__table table">
          <tr>
            <td>贊助金額：</td>
            <td>{{ formData.donateAmount }} 元</td>
          </tr>
          <tr>
            <td>贊助時間：</td>
            <td>{{ formData.date }}</td>
          </tr>
          <tr>
            <td>付款方式：</td>
            <td>信用卡</td>
          </tr>
        </table>
      </div>
      <button
        class="success__back-to-form-button button button--white"
        @click="$emit('backToForm')"
      >
        再次贊助
      </button>
      <footer class="success__footer">
        <img
          v-lazy="'/public/2.0/decorations/flower.png'"
        >
      </footer>
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
  align-items center
  height calc(100vh - 80px * 2 - 58.8px)

.success
  width 440px
  margin 0 auto
  p:nth-child(1)
    text-align center
    font-size 24px
    font-weight 500
  p:nth-child(2)
    margin 22px 0 0 0
    font-size 16px
    line-height 1.25
  &__result-table-wrapper
    margin 30px 0 0 0
  &__back-to-form-button
    position absolute
    bottom 100px
    width 440px !important
  &__footer
    width 100%
    height 60px
    background-color #ddcf21
    position absolute
    bottom 0
    left 0
    img
      height 150px
      position absolute
      bottom 50px
      right 30px

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
  width 100%
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
  width 440px
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
