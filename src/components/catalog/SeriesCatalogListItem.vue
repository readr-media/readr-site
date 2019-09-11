<template>
  <li class="series-contents-list-item">
    <SideBadge
      v-if="shouldShowSideBadge"
      class="series-contents-list-item__side-badge"
      :show-wrapper="false"
    />
    <LinkItem
      class="series-contents-list-item__link"
      :href="href"
    >
      <h2
        class="series-contents-list-item__title"
        v-text="title"
      />
      <p
        class="series-contents-list-item__date"
        v-text="date"
      />
      <p
        v-if="description !== ''"
        class="series-contents-list-item__description"
        v-text="description"
      />
    </LinkItem>
  </li>
</template>

<script>
import { createPost } from 'src/util/post'
import _ from 'lodash'
import dayjs from 'dayjs'

import LinkItem from 'src/components/common/LinkItem.vue'
import SideBadge from '@readr-ui/side-badge/src/readr-ui-side-badge.vue'

export default {
  components: {
    LinkItem,
    SideBadge
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    href () {
      return _.get(createPost(this.post), [ 'processed', 'url' ], '')
    },
    title () {
      const title = this.post.ogTitle || this.post.title
      return _.truncate(title, { length: 60 })
    },
    date () {
      const date = _.get(this.post, 'publishedAt', '')
      return dayjs(date).format('YYYY/MM/DD')
    },
    description () {
      const description = _.get(this.post, 'ogDescription', '')
      return _.truncate(description, { length: 120 })
    },
    shouldShowSideBadge () {
      const date = _.get(this.post, 'publishedAt', '')
      if (date) {
        const today = dayjs()
        const currentDate = dayjs(date)
        return today.diff(currentDate, 'day') <= 7
      }
      return false
    }
  }
}
</script>

<style lang="stylus" scoped>
.series-contents-list-item
  display flex
  align-items center
  transition background-color .25s ease-out
  cursor pointer
  position relative
  &__side-badge
    position absolute
    top 0
    left 0
  &:hover
    background-color white
  &__link
    padding 20px 50px
  &__title
    line-height 1.25
    font-size $size-m
    font-weight 400
  &__date
    margin 10px 0 0 0
    color #4a4a4a
    font-size $size-xs
  &__description
    margin 10px 0 0 0
    line-height 1.38
    font-size $size-s
</style>
