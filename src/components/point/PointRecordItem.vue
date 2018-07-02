<template>
  <div class="item">
    <div class="item__timestamp"><span v-text="datetime"></span></div>
    <div class="item__subject">
      <span class="object-type" v-text="objectType && ( `${$t(`point.${objectType}`)}${$t(`point.PROJECT`)}` )"></span>
      <span class="object-name" v-text="objectName"></span>
    </div>
    <div class="item__deduction">
      <span class="value" v-text="0 - deduction"></span>
      <span class="unit" v-text="$t('point.UNIT')"></span>
    </div>
    <div class="item__rest">
      <span class="value" :class="{ negative: isBalanceNegative, }" v-text="balance"></span>
      <span class="unit" v-text="$t('point.UNIT')"></span>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { get, } from 'lodash'
  export default {
    name: 'PointRecordItem',
    computed: {
      balance () {
        return get(this.record, 'balance', 0)
      },
      datetime () {
        return moment(get(this.record, 'createdAt')).format('YYYY-MM-DD HH:mm:ss')
      },
      deduction () {
        return get(this.record, 'points', 0)
      },
      isBalanceNegative () {
        return this.balance < 0
      },
      objectName () {
        return get(this.record, 'objectName', '--')
      },
      objectType () {
        switch (get(this.record, 'objectType', )) {
          case 1:
            return 'ENCOURAGE'
          case 2:
            return 'PARTICIPATE'
          default:
            return
        }
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
      font-weight normal
      line-height normal
      &:last-child
        margin-right 0
    &__deduction, &__rest
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
      .object-type
        margin-right 5px
        // font-weight 200
      .object-name
        font-weight 800
</style>