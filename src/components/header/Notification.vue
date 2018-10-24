<template>
  <div class="notification" tabIndex="0" @focusout="closeBox" @focus="openBox">
    <span v-show="notReadYetCount > 0" v-text="notReadYetCount > 99 ? 99 : notReadYetCount"></span>
    <!-- <div class="notification__light" :class="{ off: !isBoxActive }" v-if="notReadYetCount !== 0"><span v-text="notReadYetCount"></span></div> -->
    <!-- <div class="notification__light bell" v-else></div> -->
    <NotificationDropbox class="notification__dropbox"
      @updateNotification="updateNotification"
      :class="{ show: isBoxActive }"
      :notificationItems="notificationItems"
      :notReadYetCount="notReadYetCount"
      :isBoxActive.sync="isBoxActive"></NotificationDropbox>
  </div>
</template>
<script>
  import { NOTIFICATION_TYPE, } from 'src/constants'
  import { filter, get, map, throttle, } from 'lodash'
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
      currPath () {
        return get(this.$route, 'fullPath')
      },
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      notificationItems () {
        return map(get(this.$store, 'state.notification', []), n => (JSON.parse(n)))
      },
      notReadYetCount () {
        // return filter(this.notificationItems, { read: false, }).length
        return filter(this.notificationItems, item => {
          return item.read === false && get(NOTIFICATION_TYPE, get(item, 'event_type', '').toUpperCase())
        }).length
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
        if (this.$store.state.isLoggedIn) {
          this.isBoxActive = true
        }
      },
      updateNotification () {
        debug('Got event updateNotification.')
        throttle(() => Promise.all([
          fetchNotification(this.$store, { id: this.currUser, }),
        ]), 100, { leading: false, })()      
      },
    },
    beforeMount () {
      this.currUser && Promise.all([
        fetchNotification(this.$store, { id: this.currUser, }),
      ])
    },
    mounted () {
      this.$el.ondragstart = function () { return false }
      this.$el.onselectstart = function () { return false }
    },
    watch: {
      currPath () {
        this.currUser && this.updateNotification()
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .notification
    position relative
    width 40px
    // height 30px
    height 100%
    display block
    // position absolute
    background-color transparent
    background-image url(/public/icons/bell-white.png)
    background-position bottom center
    background-repeat no-repeat
    background-size contain
    // bottom 0
    // right 10px    
    // margin-right 10px
    cursor pointer
    outline none
    &:hover
      animation shake 0.82s cubic-bezier(.36,.07,.19,.97) both
      transform translate3d(0, 0, 0)
      backface-visibility hidden
      perspective 1000px
    > span
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      color #d0021b
      font-size .625rem
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
      &.bell
        background-color transparent
        background-image url(/public/icons/bellwithshadow.png)
        background-position center center
        background-size contain
        background-repeat no-repeat
        &:after
          content none
      &.off
        &:after
          content none       
      &:after
        content ''
        background-color #d0021b
        width 2px
        position absolute
        top 18px
        height 15px
        z-index 1
    > .notification__dropbox
      top calc(100% + 24px)
      // margin-right -50px
      z-index 2
      cursor default
      display none
      &.show
        display block

  @keyframes shake {
    10%, 90% {
      transform translate3d(-1px, 0, 0)
    }
    
    20%, 80% {
      transform translate3d(2px, 0, 0)
    }

    30%, 50%, 70% {
      transform translate3d(-4px, 0, 0)
    }

    40%, 60% {
      transform translate3d(4px, 0, 0)
    }
  }

</style>
