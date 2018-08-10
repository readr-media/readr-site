<template>
  <tr class="item">
    <td colspan="7">
      <span class="item__type" v-text="typeName"></span>
      <span class="item__title" v-text="item.title"></span>
    </td>
  </tr>
</template>
<script>
export default {
  name: 'TagListManageItemRelated',
  props: {
    item: {
      type: Object,
      default: {},
    },
    type: {
      type: Number,
    },
  },
  computed: {
    typeName () {
      switch(this.type) {
        case 1:
          return this.$t('TAG_LIST.NEWS')
        case 7:
          return this.$t('TAG_LIST.PROJECT')
        default:
          return this.$t('TAG_LIST.REVIEW')
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.item
  font-size .875rem
  &__type
    color #4280a2
  &__title
    margin-left 1em
</style>
