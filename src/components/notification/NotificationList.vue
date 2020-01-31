<template>
  <div class="notification-list">
    <ListItemNotification
      v-for="item in items"
      :key="item.id"
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
