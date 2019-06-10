<template>
  <div class="notification-list">
    <ListItemNotification
      v-for="(item, index) in items"
      :key="item.id"
      :index="index"
      :item="item"
    />
  </div>
</template>
<script>
import ListItemNotification from 'src/components/listItem/ListItemNotification.vue'

export default {
  name: 'NotificationList',
  components: {
    ListItemNotification
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
