<template>
  <div class="item">
    <div class="item__timestamp"><span v-text="datetime"></span></div>
    <div class="item__subject">
      <span class="prefix" v-text="$t('point.PAYMENT.PREFIX')"></span>
      <span class="points-original" :class="{ negative: isPointOriginNegative, }" v-text="pointOrigin"></span>
      <span class="infix" v-text="$t('point.PAYMENT.INFIX')"></span>
      <span class="points-deposit" v-text="pointDeposit"></span>
      <span class="postfix" v-text="$t('point.PAYMENT.POSTFIX')"></span>
    </div>
    <div class="item__points-deposit">
      <span class="value" v-text="balance"></span>
      <span class="unit" v-text="$t('point.unit')"></span>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { get, } from 'lodash'

  export default {
    name: 'PaymentRecordItem',
    computed: {
      balance () {
        return get(this.record, 'balance', 0)
      },
      datetime () {
        return moment(get(this.record, 'createdAt')).format('YYYY-MM-DD HH:mm:ss')
      },
      pointOrigin () {
        return this.balance - this.pointDeposit
      },
      pointDeposit () {
        return 0 - get(this.record, 'points', 0)
      },
      isPointOriginNegative () {
        return this.pointOrigin < 0
      },    
    },
    methods: {},
    mounted () {},
    props: {
      record: {
        type: Object,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .item
    width 100%
    display flex
    border-top 1px solid #d3d3d3
    padding 10px 0
    align-items center
    &:last-child
      border-bottom 1px solid #d3d3d3 
    > div
      margin-right 30px
      font-size 0.9375rem
      line-height normal
      &:last-child
        margin-right 0
    &__points-deposit
      width 110px
      text-align right
      .value
        font-size 1.5625rem
        font-weight 600
        color #11b8c9
        &.negative
          color #d0021b
      .unit
        margin-left 10px
    &__timestamp
      width 160px
    &__subject
      flex 1
      .points-original
        margin 0 5px
        font-size 1.5625rem
        font-weight 600
        color #11b8c9
        &.negative
          color #d0021b
      .points-deposit
        margin 0 5px
      .object-name
        font-weight 500
</style>