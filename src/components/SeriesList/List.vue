<template>
  <ol class="list">
    <ListItem
      v-for="(item, i) in items"
      :key="i"
      :item="item"
      :theme="theme"
      class="list__list-item"
    />
  </ol>
</template>

<script>
import ListItem from './ListItem.vue'

export default {
  components: {
    ListItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style lang="stylus" scoped>
.list
  list-style none
  margin 0
  padding 0
  display flex
  flex-wrap wrap
  position relative
  top -60px
  left -40px
  width calc(100% + 40px)
  &__list-item
    margin 60px 0 0 40px
</style>
