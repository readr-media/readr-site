<template>
  <div class="series-list">
    <ListItem
      v-for="item in items"
      :key="item.id"
      :class="itemStyle"
      :date="dayjs(item.publishedAt).format('YYYY/MM/DD')"
      :description="truncate(item.ogDescription || item.description)"
      :href="`/series/${item.slug}`"
      :image="item.ogImage ||item.heroImage || ' '"
      :target="'_blank'"
      :title="item.title"
    />
  </div>
</template>
<script>
import ListItem from '../listItem/ListItem.vue'
import dayjs from 'dayjs'
import { truncate } from 'lodash'

export default {
  name: 'SeriesList',
  components: {
    ListItem
  },
  props: {
    descriptionLength: {
      type: Number,
      default: 50
    },
    itemStyle: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    dayjs,
    truncate (description) {
      return description ? truncate(description, { length: this.descriptionLength }) : description
    }
  }
}
</script>
