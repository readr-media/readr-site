<template>
  <div class="point-record">
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
      pay_type: 'consumption',
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
