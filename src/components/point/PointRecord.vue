<template>
  <div class="point-record">
    <div class="item title">
      <div class="item__timestamp"><span v-text="$t('point.RECORD_TITLE.DATETIME')"></span></div>
      <div class="item__subject">
        <span class="object-type" v-text="$t('point.RECORD_TITLE.ITEM')"></span>
      </div>
      <div class="item__deduction">
        <span class="unit" v-text="$t('point.RECORD_TITLE.MUTATION')"></span>
      </div>
      <div class="item__rest">
        <span class="unit" v-text="$t('point.RECORD_TITLE.REST')"></span>
      </div>
    </div>
    <template v-for="item in records">
      <PointRecordItem class="point-record-item" :record="item"></PointRecordItem>
    </template>
  </div>
</template>
<script>
  import PointRecordItem from 'src/components/point/PointRecordItem.vue'
  import { get, } from 'lodash'

  const fetchPointRecords = (store) => store.dispatch('GET_POINT_HISTORIES', {
    params: {
      // pay_type: 'consumption',
    },
  })

  export default {
    name: 'PointRecord',
    components: {
      PointRecordItem,
    },
    computed: {
      records () {
        return get(this.$store, 'state.pointHistories')
      },
    },
    methods: {},
    mounted () {
      fetchPointRecords(this.$store)
    },
  }
</script>
<style lang="stylus" scoped>
  .point-record
    & >>> .item
      width 100%
      display flex
      border-top 1px solid #d3d3d3
      padding 10px 0
      align-items center
      &.title
        > div
          font-size 1rem
          font-weight 600
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
