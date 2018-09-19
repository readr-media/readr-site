<template>
  <div class="item">
    <div class="item__timestamp"><span v-text="datetime"></span></div>
    <div class="item__subject">
      <template v-if="objectType === 'ENCOURAGE'">
        <span class="object-type" v-text="$t(`point.${objectType}`)"></span>
        <span class="object-name" v-text="objectName"></span>
      </template>
      <template v-else-if="objectType === 'PARTICIPATE'">
        <span class="object-type" v-text="$t(`point.${objectType}`)"></span>
        <span class="object-name" v-text="objectName"></span>
        <span class="object-type" v-text="' ' + $t(`point.EDITOR_ROOM`)"></span>
      </template>
      <template v-else-if="objectType === 'CLEARUP' || objectType ==='GIFT'">
        <span class="object-type" v-text="$t(`point.${objectType}`)"></span>
      </template>
    </div>
    <div class="item__deduction">
      <span class="value" v-text="0 - deduction > 0 ? `+${0 - deduction}` : 0 - deduction"></span>
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
        // return this.balance < 0
        return false
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
          case 3:
            return 'CLEARUP'
          case 4:
            return 'GIFT'            
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
