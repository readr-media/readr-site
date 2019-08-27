<template>
  <li class="list-item-wrapper">
    <SideBadge
      v-if="shouldShowSideBadge"
      class="list-item-wrapper__side-badge"
    />
    <LinkItem
      :href="url"
      class="list-item"
      @click.native="SET_SHOW_SIDEBAR(false)"
    >
      <div class="list-item__img-wrapper img-wrapper">
        <img
          :key="image"
          v-lazy="image"
          alt=""
        >
      </div>
      <div class="list-item__content-wrapper content-wrapper">
        <h1>
          {{ title }}
        </h1>
        <p>
          {{ description }}
        </p>
      </div>
    </LinkItem>
  </li>
</template>

<script>
import _ from 'lodash'
import { mapMutations } from 'vuex'

import { createPost } from 'src/util/post'

import LinkItem from 'src/components/common/LinkItem.vue'
import SideBadge from '@readr-ui/side-badge/src/readr-ui-side-badge.vue'
import dayjs from 'dayjs'

export default {
  components: {
    LinkItem,
    SideBadge
  },
  props: {
    item: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    post () {
      return createPost(this.item)
    },
    id () {
      return _.get(this.post, 'id', '')
    },
    image () {
      return _.get(this.post, [ 'processed', 'ogImgUrl' ], '')
    },
    title () {
      return _.get(this.item, 'ogTitle', '') || _.get(this.item, 'title', '')
    },
    description () {
      return _.get(this.post, 'ogDescription', '')
    },
    url () {
      return _.get(this.post, 'processed.url', '')
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
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR'
    })
  }
}
</script>

<style lang="stylus" scoped>
.list-item-wrapper
  position relative
  &__side-badge
    position absolute
    left -15px
    top 0

.list-item
  display flex

.img-wrapper
  img
    width 200px
    height 112px
    object-fit cover
    background-color black

.content-wrapper
  margin 0 0 0 20px
  h1
    margin 0
    font-size 24px
    font-weight 400
    line-height 1.3
    color black
  p
    margin 14px 0 0 0
    font-size 16px
    line-height 1.3
    color black
</style>
