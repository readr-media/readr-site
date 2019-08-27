<template>
  <LinkItem
    :href="href"
    :target="target"
    class="list-item app-list"
  >
    <figure v-if="image">
      <img
        :src="image"
        :alt="title"
      >
    </figure>
    <div class="list-item__content">
      <SideBadge
        v-if="shouldShowSideBadge"
        class="side-badge"
      />
      <h2
        v-if="title"
        class="title"
        v-text="title"
      />
      <p
        v-if="date"
        class="date small"
        v-text="date"
      />
      <p
        v-if="description"
        class="description"
        v-text="description"
      />
    </div>
  </LinkItem>
</template>
<script>
import LinkItem from 'src/components/common/LinkItem.vue'
import SideBadge from '@readr-ui/side-badge/src/readr-ui-side-badge.vue'
import dayjs from 'dayjs'

export default {
  name: 'ListItem',
  components: {
    LinkItem,
    SideBadge
  },
  props: {
    date: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    shouldShowSideBadge () {
      if (this.date) {
        const today = dayjs()
        const currentDate = dayjs(this.date)
        return today.diff(currentDate, 'day') <= 7
      }
      return false
    }
  }
}
</script>
<style lang="stylus" scoped>
  .list-item
    figure
      position relative
      width 100%
      padding-top 56.25%
      img
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        height 100%
        object-fit cover
        object-position center center
    .side-badge
      display none
    h2, p
      word-break break-all
      overflow hidden
    h2
      font-weight normal
    .description
      text-align justify

  .list-item.comm-narrow
    padding-bottom 1em
    background-color #fff
    h2, p
      width 90%
      margin-left auto
      margin-right auto
    .list-item__content
      position relative
      .side-badge
        display initial
        transform scale(.7)
        position absolute
        top -25px
        left -15px

  .list-item.comm-series-more
    width calc((100% - 60px) / 3)
</style>
