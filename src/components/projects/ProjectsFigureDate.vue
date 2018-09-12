<template>
  <div class="date">
    <div class="date__field field field--gray">
      <img class="field__icon" src="/public/icons/time.png" alt="">
      <p class="field__date-display" v-text="createdAtFormatted"></p>
    </div>
    <div :class="[ 'date__field', 'field', { 'field--gray': isUpdatedAtMonthAgo } ]">
      <img class="field__icon" :src="`/public/icons/refresh${isUpdatedAtMonthAgo ? '' : '-blue'}.png`" alt="">
      <p class="field__date-display" v-text="updatedAtFormatted"></p>
    </div>
  </div>
</template>

<script>
import { isISO8601, } from 'validator'
import moment from 'moment'

export default {
  props: {
    createdAt: {
      type: String,
      required: true,
      validator (value) {
        return isISO8601(value)
      },
    },
    updatedAt: {
      type: String,
      required: true,
      validator (value) {
        return isISO8601(value)
      },
    },
  },
  computed: {
    createdAtFormatted () {
      if (!this.createdAt) return ''
      return this.formatDate(this.createdAt)
    },
    updatedAtFormatted () {
      if (!this.updatedAt) return ''
      return this.formatDate(this.updatedAt)
    },
    isUpdatedAtMonthAgo () {
      if (!this.updatedAt) return false
      const now = moment()
      const updateAt = moment(this.updatedAt)
      return now.diff(updateAt, 'months', true) > 1
    },
  },
  methods: {
    formatDate (date) {
      return moment(date).format('YYYY/MM/DD')
    },
  },
}
</script>

<style lang="stylus" scoped>
.date
  display flex
  align-items center
  &__field
    & + &
      border-left 1px solid #d3d3d3

.field
  padding 0 5px
  font-size 12px
  color #11b8c9
  display flex
  align-items center
  &:nth-child(1)
    padding 0 5px 0 0
  &--gray
    color #808080
  &__icon
    d = 10px
    width d
    height d
    margin 0 5px 0 0
  &__date-display
    margin 0
</style>


