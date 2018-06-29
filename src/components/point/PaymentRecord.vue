<template>
  <div class="payment-record">
    <template v-for="item in records">
      <PaymentRecordItem class="payment-record-item" :record="item"></PaymentRecordItem>
    </template>    
  </div>
</template>
<script>
  import PaymentRecordItem from 'src/components/point/PaymentRecordItem.vue'
  import { get, } from 'lodash'

  const fetchPointRecords = (store) => store.dispatch('GET_POINT_HISTORIES', { params: {}, })

  export default {
    name: 'PaymentRecord',
    components: {
      PaymentRecordItem,
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
