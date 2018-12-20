<template>
  <div class="list-wrapper">
    <h1 class="list-wrapper__title" v-text="title"></h1>
    <ul class="list-wrapper__list list">
      <PluginLatestListItem
        class="list__list-item"
        v-for="(item, i) in listItems"
        :key="i"
        :item="item"
        :listItemType="listItemType"
        @click.native="sendMessage(i)"
      />
    </ul>
  </div>
</template>

<script>
import PluginLatestListItem from 'src/components/plugins/PluginLatestListItem.vue'
import { sendGAMessageToMM, } from 'src/util/plugins'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    listItems: {
      type: Array,
      default () {
        return []
      },
    },
    listItemType: {
      type: String,
      default: 'editor',
    },
  },
  components: {
    PluginLatestListItem,
  },
  methods: {
    sendMessage (index) {
      const label = `${this.listItemType}${index + 1}`
      sendGAMessageToMM({ category: 'article', action: 'click', label, })
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-wrapper
  &__title
    font-size 14.4px
    line-height 1.8
    font-weight 400
    text-align center
    color #ffffff
    background-color #444746
    margin 0
  &__list
    margin 10px 0 0 0

.list
  list-style none
  padding 0
  display flex
  justify-content space-between
  &__list-item
    width calc((100% - 10px) / 2)
</style>