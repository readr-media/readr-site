<template>
  <li class="series-contents-list-item">
    <LinkItem
      class="series-contents-list-item__link"
      :href="createPost(post).processed.url"
    >
      <div
        class="series-contents-list-item__order"
        v-text="order + 1"
      />
      <div
        class="series-contents-list-item__title"
        v-text="post.ogTitle || post.title"
      />
    </LinkItem>
  </li>
</template>

<script>
import { createPost } from 'src/util/post'

import LinkItem from 'src/components/common/LinkItem.vue'

export default {
  components: {
    LinkItem
  },
  props: {
    order: {
      type: Number,
      required: true
    },
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    createPost
  }
}
</script>

<style lang="stylus" scoped>
.series-contents-list-item
  height 40px
  display flex
  align-items center
  transition background-color .25s ease-out
  &:hover
    background-color white
  &__link
    display flex
    width 100%
    height 100%
  &__order
    min-width 50px
    max-width 50px
    display flex
    justify-content center
    align-items center
    font-size 18px
    color #11b8c9
  &__title
    font-size 14px
    line-height 40px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
</style>
