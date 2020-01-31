<template>
  <section
    :class="{ empty: notification.length < 1 }"
    class="account-notice"
  >
    <div>
      <template v-if="notification.length > 0">
        <button
          class="btn-read-all"
          @click="readAll"
        >
          全部標為已讀
        </button>
        <NotificationList
          :items="notification"
          class="account-notice__list"
        />
      </template>
      <template v-else>
        <p>尚未有任何通知</p>
      </template>
    </div>
  </section>
</template>
<script>
import NotificationList from 'src/components/notification/NotificationList.vue'

export default {
  name: 'AccountNotice',
  components: {
    NotificationList
  },
  props: {
    notification: {
      type: Array,
      default: () => []
    },
    profile: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    readAll () {
      const ids = this.notification.map((item, index) => `${index}`)
      this.$store.dispatch('DataNotification/UPDATE_NOTIFICATION_STATUS', {
        params: {
          ids
        }
      })
        .then(() => this.$store.dispatch('DataNotification/GET_NOTIFICATION', this.profile.id))
    }
  }
}
</script>
<style lang="stylus" scoped>
.account-notice
  &.empty
    > div
      margin-top 40px
  > div
    display flex
    flex-direction column
  &__list
    margin-top 1em
  .btn-read-all
    align-self flex-end
    margin-right 5%
    padding 0
    color #12b8c8
    text-align right
</style>
