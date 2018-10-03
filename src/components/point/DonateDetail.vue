<template>
  <div class="donation-detail">
    <div class="donation-detail__title"><span v-text="$t('point.DONATE.DETAIL.POINT')"></span></div>
    <div class="donation-detail__item">
      <div class="left">
        <span v-text="$t('point.DONATE.DETAIL.REST')"></span>
      </div>
      <div class="right"><span v-text="rest"></span></div>      
    </div>
    <div class="donation-detail__item">
      <div class="left">
        <span v-text="$t('point.DONATE.DETAIL.CURRENT_DONATION')"></span>
      </div>
      <div class="right"><span v-text="0 - amount"></span></div>      
    </div>
    <div class="donation-detail__item sum">
      <div class="left">
        <span v-text="$t('point.DONATE.DETAIL.TOTAL')"></span>
      </div>
      <div class="right"><span v-text="sum"></span></div>      
    </div>
  </div>
</template>
<script>
  export default {
    name: 'DonateDetail',
    computed: {
      sum () {
        return this.rest + this.amount
      },
    },
    props: {
      rest: {
        type: Number,
        default: 0,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .donation-detail
    margin 35px auto
    background-color #ccbf26
    padding 10px 15px
    > div
      padding 0 5px
      line-height normal
    &__title
      text-align center
      font-size 0.9375rem
      font-weight bold
      margin-bottom 10px
      border-bottom 1px solid rgba(0, 0, 0, 0.2)
      padding-bottom 5px!important
    &__item
      font-size 0.875rem
      font-weight 300
      display flex
      .left, .right
        display flex
        justify-content center
        span
          display block
          width 80px
      .left
        flex 1
        span
          text-align left
      .right
        text-align center
        width 50%
        span
          text-align right
      &.sum
        margin-top 5px
        border-top 1px solid rgba(0, 0, 0, 0.2)
        padding-top 5px
</style>