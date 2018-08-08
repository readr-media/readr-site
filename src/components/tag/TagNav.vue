<template>
  <section class="tag-nav">
    <span class="tag-nav__hashtag">#</span>
    <TagItem class="tag-nav__tag-item" v-for="tag in tags" :key="tag.id" :tag="tag"/>
  </section>
</template>

<script>
import TagItem from './TagItem.vue'

export default {
  name: 'TagNav',
  props: {
    tags: {
      default: () => [],
    },
  },
  components: {
    TagItem,
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav
  display flex
  align-items center
  flex-wrap wrap
  &__hashtag
    color #11b8c9
    font-size 1.5rem
    font-weight 600
    line-height 1
    margin 5px 10px 0 0
  &__tag-item
    margin 5px 0 0 0
    & + &
      margin 5px 0 0 5px
</style>

