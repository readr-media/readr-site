<template>
  <div class="series-list">
    <ListItem
      v-for="item in items"
      :key="item.id"
      :date="dayjs(item.publishedAt).format('YYYY/MM/DD')"
      :description="item.ogDescription || item.description"
      :href="`/series/${item.slug}`"
      :image="item.ogImage ||item.heroImage || ' '"
      :target="'_blank'"
      :title="item.title"
    />
  </div>
</template>
<script>
import ListItem from '../ListItem/ListItem.vue'
import dayjs from 'dayjs'

export default {
  name: 'SeriesList',
  components: {
    ListItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    dayjs
  }
}
</script>
