<template>
  <div class="post-list">
    <ListItem
      v-for="item in items"
      :key="item.id"
      :class="itemStyle"
      :date="dayjs(item.publishedAt).format('YYYY/MM/DD')"
      :description="truncate(item.description || item.ogDescription)"
      :href="`/post/${item.id}`"
      :image="item.heroImage || item.ogImage || ' '"
      :target="'_blank'"
      :title="item.title || item.ogTitle"
    />
  </div>
</template>
<script>
import ListItem from '../listItem/ListItem.vue'
import dayjs from 'dayjs'
import { truncate } from 'lodash'

export default {
  name: 'PostList',
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
