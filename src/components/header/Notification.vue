<template>
  <div class="notification" tabIndex="0" @focusout="closeBox" @focus="openBox">
    <div class="notification__light" v-show="notReadYetCount !== 0"><span v-text="notReadYetCount"></span></div>
    <NotificationDropbox class="notification__dropbox"
      @updateNotification="updateNotification"
      :class="{ show: isBoxActive }"
      :notificationItems="notificationItems"
      :notReadYetCount="notReadYetCount"
      :isBoxActive.sync="isBoxActive"></NotificationDropbox>
  </div>
</template>
<script>
  import { filter, get, map, } from 'lodash'
  import NotificationDropbox from 'src/components/header/NotificationDropbox.vue'
  const debug = require('debug')('CLIENT:Notification')
  const fetchNotification = (store, { id, }) => {
    store.dispatch('GET_NOTIFICATION', { id, })
  }
  export default {
    name: 'Notification',
    components: {
      NotificationDropbox,
    },
    computed: {
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      notificationItems () {
        return map(get(this.$store, 'state.notification', []), n => (JSON.parse(n)))
      },
      notReadYetCount () {
        return filter(this.notificationItems, { read: false, }).length
      },
    },
    data () {
      return {
        isBoxActive: false,
      }
    },
    methods: {
      closeBox () {
        this.isBoxActive = false
      },
      openBox () {
        this.isBoxActive = true
      },
      updateNotification () {
        debug('Got event updateNotification.')
        Promise.all([
          fetchNotification(this.$store, { id: this.currUser, }),
        ])        
      },
    },
    beforeMount () {
      Promise.all([
        fetchNotification(this.$store, { id: this.currUser, }),
      ])
    },
    mounted () {
      this.$el.ondragstart = function () { return false }
      this.$el.onselectstart = function () { return false }
    },
  }
</script>
<style lang="stylus" scoped>
  .notification
    position relative
    width 28px
    // height 30px
    height 100%
    display block
    // position absolute
    background-color transparent
    background-image url(/public/icons/account.png)
    background-position bottom center
    background-repeat no-repeat
    background-size contain
    // bottom 0
    // right 10px    
    margin-right 10px
    cursor pointer
    outline none
    &__light
      border-radius 50%
      width 18px
      height 18px
      background-color #d0021b
      font-size 0.625rem
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align left
      color #ffffff
      position absolute
      right -4px
      bottom -9px
      display flex
      justify-content center
      align-items center
      z-index 3
    > .notification__dropbox
      top calc(100% + 17px)
      margin-right -50px
      z-index 2
      cursor default
      display none
      &.show
        display block
      &:before
        content ''
        background-color #d0021b
        width 2px
        position absolute
        top -18px
        right 54px
        height 18px
        z-index 1
</style>