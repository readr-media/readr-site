<template>
  <section class="tags-in-post">
    <TagItem
      v-for="tag in tags"
      :key="`tags-in-post-${tag.id}`"
      :tag="tag"
    />
  </section>
</template>
<script>
import TagItem from './TagItem.vue'

export default {
  name: 'TagsInPost',
  components: {
    TagItem
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags-in-post
  &::before
    content '#'
    margin 10px .2em 0 0
    color #11b8c9
    font-size 1.5rem
    font-weight 600
    line-height 30px
  >>> .tag-item
    display flex
    align-items center
    height 30px
    padding .2em .8em
    margin-top 10px
    background-color #fff
    border 2px solid #11b8c9
    border-radius 23.5px
    & + .tag-item
      margin-left .5em
</style>
