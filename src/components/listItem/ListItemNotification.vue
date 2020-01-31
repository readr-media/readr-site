<template>
  <div
    :class="{ read: item.read }"
    class="list-item notification"
    @click="read"
  >
    <figure>
      <img
        v-if="item.profile_image"
        :src="getFullUrl(item.profile_image)"
      >
    </figure>
    <div class="notification__info">
      <NotificationMessage :item="item" />
      <p
        v-if="item.timestamp"
        class="datetime small"
        v-text="dateDiffFromNow(item.timestamp)"
      />
    </div>
  </div>
</template>
<script>
import NotificationMessage from 'src/components/notification/NotificationMessage.vue'
import dayjs from 'dayjs'
import { dateDiffFromNow, getFullUrl } from 'src/util/comm'

export default {
  name: 'ListItemNotification',
  components: {
    NotificationMessage
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    dateDiffFromNow (date) {
      const Y = date.substr(0, 4)
      const M = date.substr(4, 2)
      const D = date.substr(6, 2)
      const h = date.substr(8, 2)
      const m = date.substr(10, 2)
      const s = date.substr(12, 2)
      return dateDiffFromNow(dayjs(`${Y}-${M}-${D} ${h}:${m}:${s}`).unix())
    },
    getFullUrl,
    read () {
      if (this.item.read) {
        this.redirectTo()
      } else {
        this.$store.dispatch('DataNotification/UPDATE_NOTIFICATION_STATUS', {
          params: {
            ids: [ `${this.item.order}` ]
          }
        })
          .then(() => {
            this.redirectTo()
          })
      }
    },
    redirectTo () {
      const mapping = {
        project: `/series/${this.item.object_slug}`,
        memo: `/series/${this.item.object_slug}/${this.item.object_id}`,
        report: `/project/${this.item.object_slug}`,
        default: `/${this.item.object_type}/${this.item.object_id}`
      }
      const route = mapping[this.item.object_type] || mapping.default
      this.$router.push(route)
    }
  }
}
</script>
<style lang="stylus" scoped>
.list-item
  &.notification
    display flex
    align-items center
    height 100px
    padding 10px 0 10px 20px
    cursor pointer
    &.read
      background-color #fff
    figure
      position relative
      width 80px
      height 80px
      border 1px solid #979797
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        object-fit cover
        object-position center center
  .notification__info
    flex 1
    align-self flex-start
    position relative
    top -10px
    height 100px
    padding 10px 0
    margin-left 25px
    font-size 1.125rem
    border-bottom 1px solid #979797
    .datetime
      margin-top .5em
</style>
