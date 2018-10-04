<template>
  <div class="list-container">
    <h1 class="list-container__date" v-text="date"></h1>
    <ol class="list-container__list list">
      <FollowingListItem
        :class="[ 'list__list-item',  { 'list__list-item--less-padding': item.resource === 'tag' } ]"
        v-for="item in data"
        :key="`${item.resource}-${item.id}`"
        :resource="item.resource"
        :id="item.id"
      >
        <!-- slot template in FollowingListItem for tag -->
        <router-link
          v-if="item.resource === 'tag'"
          class="tag"
          v-text="item.text"
          :to="`/tag/${item.id}`"
        >
        </router-link>
        <!-- slot template in FollowingListItem for project -->
        <div
          v-else-if="item.resource === 'project'"
          class="report"
        >
          <router-link class="report__hero-img" :to="`/series/${item.slug}`">
            <img :src="item.heroImage" alt="">
          </router-link>
          <div class="report__info">
            <div>
              <p class="report__category" v-text="$t('FOLLOWING.PROJECT')"></p>
              <router-link class="report__title" :to="`/series/${item.slug}`" v-text="item.title"></router-link>
            </div>
            <p class="report__tags" v-text="getTags(item)"></p>
          </div>
        </div>
      </FollowingListItem>
    </ol>
  </div>
</template>

<script>
import FollowingListItem from './FollowingListItem.vue'

export default {
  props: {
    date: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  components: {
    FollowingListItem,
  },
  methods: {
    getTags (item) {
      const tags = item.tags || []
      return tags.length === 0 ? '' : `# ${ tags.join('、') }`
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-container
  &__date
    font-size 12px
    color #808080

.list
  margin 11px 0 0 0
  padding 0
  &__list-item
    border-bottom 1px solid #d3d3d3
    &:nth-child(1)
      border-top 1px solid #d3d3d3
    &--less-padding
      padding 6px 0 6px 13px !important

.tag
  font-size 12px
  font-weight 500
  color black
  margin 0

.report
  display flex
  &__hero-img
    d = 75px
    width d
    height d
    & > img
      width 100%
      height 100%
      object-fit cover
  &__info
    display flex
    flex-direction column
    justify-content space-between
    height 75px
    margin 0 0 0 10px
  &__category, &__title, &__tags
    margin 0
  &__category
    margin 0 0 8px 0
    font-size 12px
    color #808080
  &__title
    font-size 18px
    font-weight 600
    color black
  &__tags
    font-size 12px
</style>

