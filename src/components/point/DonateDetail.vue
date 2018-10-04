<template>
  <div class="donation-detail">
    <div class="donation-detail__switcher" @click="toggle">
      (<span class="fold" v-text="$t('point.DONATE.DETAIL.UNFOLD')" v-if="!isActive"></span>
      <span class="fold" v-text="$t('point.DONATE.DETAIL.FOLD_UP')" v-else></span>
      <span class="sheet" v-text="$t('point.DONATE.DETAIL.POINT')" v-if="type === 1"></span>
      <span class="sheet" v-text="$t('point.DONATE.DETAIL.PAYMENT')" v-else></span>)
    </div>
    <div class="donation-detail__content" :class="{ join: theme === 'join', active: isActive, }">
      <template v-if="type === 1">
        <!--div class="donation-detail__title">
          <span v-text="$t('point.DONATE.DETAIL.POINT')"></span>
        </div-->
        <div class="donation-detail__item">
          <div class="left">
            <span v-text="$t('point.DONATE.DETAIL.REST')"></span>
          </div>
          <div class="right"><span v-text="rest"></span></div>      
        </div>
        <div class="donation-detail__item">
          <div class="left">
            <span v-text="$t('point.DONATE.DETAIL.JOIN_PROJECT')" v-if="theme === 'join'"></span>
            <span v-text="$t('point.DONATE.DETAIL.CURRENT_DONATION')" v-else></span>
          </div>
          <div class="right"><span v-text="0 - amount"></span></div>      
        </div>
        <div class="donation-detail__item sum">
          <div class="left">
            <span v-text="$t('point.DONATE.DETAIL.TOTAL')"></span>
          </div>
          <div class="right"><span v-text="sum"></span></div>      
        </div>
      </template>
      <template v-else-if="type === 0">
        <!--div class="donation-detail__title">
          <span v-text="$t('point.DONATE.DETAIL.PAYMENT')"></span>
        </div-->
        <div class="donation-detail__item">
          <div class="left single">
            <span v-text="$t('point.DONATE.DETAIL.CLEAR_UP_POINT_PREFIX')"></span>
            <span v-text="Math.abs(sum)" class="value"></span>
            <span v-text="$t('point.DONATE.DETAIL.CLEAR_UP_POINT_POSTFIX')"></span>
          </div>     
        </div>
        <div class="donation-detail__item">
          <div class="left single">
            <span v-text="$t('point.DONATE.DETAIL.CLEAR_UP_AMOUNT_PREFIX')"></span>
            <span v-text="Math.abs(sum)" class="value"></span>
            <span v-text="$t('point.DONATE.DETAIL.CLEAR_UP_AMOUNT_POSTFIX')"></span>
          </div>     
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'DonateDetail',
    computed: {
      sum () {
        return this.rest - this.amount
      },
    },
    data () {
      return {
        isActive: false,
      }
    },
    methods: {
      toggle () {
        this.isActive = !this.isActive
        setTimeout(() => {
          this.$emit('resize')
        }, 750)
      },
    },
    props: {
      amount: {
        type: Number,
        default: 0,
      },
      rest: {
        type: Number,
        default: 0,
      },
      theme: {
        type: String,
        default: 'donation',
      },
      type: {
        type: Number,
        default: 1,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .donation-detail
    // margin 35px auto
    &__switcher
      font-size 0.75rem
      font-weight 300
      cursor pointer
      .sheet
        margin-left 2px
    &__content
      background-color #ccbf26
      margin-top 5px
      height 0
      transition padding 0.5s
      overflow hidden
      padding 0 15px
      &.active
        padding 20px 15px
        height auto
      &.join
        background-color rgba(17, 162, 174, 0.6)
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
        &.single
          span
            display inline
            width auto
            &.value
              margin 0 5px
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