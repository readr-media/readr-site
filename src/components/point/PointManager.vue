<template>
  <div class="point-manager">
    <div class="point-manager__infobar">
      <div class="point-manager__infobar--current">
        <span class="prefix" v-text="$t('point.WORDING_POINTS_AVAILABLE') + '：'"></span>
        <span class="value" :class="{ negative: isPointsNegative, }" v-text="currentPoints"></span>
        <span class="postfix" v-text="$t('point.UNIT')"></span>
      </div>
      <div class="point-manager__infobar--switcher">
        <div class="point-record" :class="isActive(0)" @click="check(0)"><span class="radio"></span><span v-text="'點數明細'"></span></div>
        <div class="pay-record" :class="isActive(1)" @click="check(1)"><span class="radio"></span><span v-text="'付款明細'"></span></div>
      </div>
    </div>
    <div class="point-manager__point-records">
      <PointRecord v-if="activeIndex === 0"></PointRecord>
      <PaymentRecord v-if="activeIndex === 1"></PaymentRecord>
    </div>
  </div>
</template>
<script>
  import PointRecord from 'src/components/point/PointRecord.vue'
  import PaymentRecord from 'src/components/point/PaymentRecord.vue'
  import { get, } from 'lodash'
  // const debug = require('debug')('CLIENT:PointManager')
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })

  export default {
    name: 'PointManager',
    components: {
      PointRecord,
      PaymentRecord,
    },
    computed: {
      isPointsNegative () {
        return this.currentPoints < 0
      },
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },
    },
    data () {
      return {
        activeIndex: 0,
      }
    },
    methods: {
      check (index) {
        this.activeIndex = index
      },
      isActive (index) {
        return [ this.activeIndex === index ? 'active' : '', ]
      },
    },
    mounted () {
      fetchCurrPoints(this.$store)
    },
  }
</script>
<style lang="stylus" scoped>
  .point-manager
    padding 10px 45px
    &__infobar
      display flex
      justify-content space-between
      margin 0 0 25px
      &--current
        font-size 0.9375rem
        .value
          font-size 1.5625rem
          font-weight 600
          color #11b8c9
          margin 0 10px
          &.negative
            color #d0021b
      &--switcher
        display flex
        justify-content space-between
        font-size 0.9475rem
        color #808080
        > div
          cursor pointer
          margin-left 15px
          display flex
          align-items center
          .radio
            content ''
            width 18px
            height 18px
            border-radius 50%
            border 1px solid #808080
            margin-right 5px
            display flex
            justify-content center
            align-items center
          &.active
            .radio
              &::before
                content ''
                width 10px
                height 10px
                border-radius 50%
                background-color #808080
                display block


</style>