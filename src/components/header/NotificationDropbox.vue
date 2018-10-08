<template>
  <div class="dropbox">
    <div class="dropbox__header">
      <div class="dropbox__header__title"><span v-text="$t('NOTIFICATION.TITLE')"></span></div>
      <div class="dropbox__header__btn">
        <span v-text="$t('NOTIFICATION.READ_ALL')" @click="read(map(notificationItems, (n, i) => `${i}`))"></span>
      </div>      
    </div>
    <div class="dropbox__items">
      <template v-for="(item, index) in notificationItems">
        <div class="dropbox__item" :class="{ never: !get(item, 'read') }" @click="read(`${index}`)" v-if="isNotificationDefined(item)">
          <div class="dropbox__item__avatar-img">
            <img :src="getFullUrl(get(item, 'profile_image'), 'mobile')" v-if="isClientSide">
          </div>
          <div class="dropbox__item__content">
            <div class="message">
              <NotificationMessage :item="item"></NotificationMessage>
            </div>
            <div class="datetime"><span v-text="dateDiffFromNow(get(item, 'timestamp'))"></span></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import { NOTIFICATION_TYPE, } from 'src/constants'
  import { dateDiffFromNow, isClientSide, isDescendant, getFullUrl, } from 'src/util/comm'
  import { get, map, } from 'lodash'
  import NotificationMessage from 'src/components/header/NotificationMessage.vue'
  const debug = require('debug')('CLIENT:NotificationDropbox')
  const updatePubSub = (store, params) => {
    return store.dispatch('UPDATE_NOTIFICATION_STATUS', { params, })
  }
  export default {
    name: 'NotificationDropbox',
    components: {
      NotificationMessage,
    },
    computed: {
      isClientSide,
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
    },
    methods: {
      dateDiffFromNow (date) {
        const Y = date.substr(0, 4)
        const M = date.substr(4, 2)
        const D = date.substr(6, 2)
        const h = date.substr(8, 2)
        const m = date.substr(10, 2)
        const s = date.substr(12, 2)
        return dateDiffFromNow(`${Y}-${M}-${D} ${h}:${m}:${s}`)
      },
      get,
      getFullUrl,
      isNotificationDefined (item) {
        debug(`get(NOTIFICATION_TYPE, get(item, 'event_type', '')`, get(NOTIFICATION_TYPE, get(item, 'event_type', '').toUpperCase()), get(item, 'event_type', ''))
        return get(NOTIFICATION_TYPE, get(item, 'event_type', '').toUpperCase()) ? true : false
      },      
      map,
      read (ids) {
        debug('Go into send ack to puc/sub center.')
        updatePubSub(this.$store, {
          ids: [ ...ids, ],
        }).then((res) => {
          debug(res)
          if ([ ...ids, ].length === 1) {
            debug(`/${get(this.notificationItems, [ ids, 'object_type', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
            this.$emit('update:isBoxActive', false)
            this.$emit('updateNotification')
            switch (get(this.notificationItems, [ ids, 'object_type', ])) {
              case 'project':
                this.$router.push(`/series/${get(this.notificationItems, [ ids, 'object_slug', ])}`)
                break
              case 'memo':
                this.$router.push(`/series/${get(this.notificationItems, [ ids, 'object_slug', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
                break
              case 'report':
                this.$router.push(`/project/${get(this.notificationItems, [ ids, 'object_slug', ])}`)
                break
              case '':
                this.$router.push(get(this.notificationItems, [ ids, 'object_name', ]))
                break
              default:
                this.$router.push(`/${get(this.notificationItems, [ ids, 'object_type', ])}/${get(this.notificationItems, [ ids, 'object_id', ])}`)
            }
          } else {
           this.$emit('updateNotification') 
          }
        })
      },
    },
    mounted () {
      window.addEventListener('wheel', (event) => {
        const targ = event.target
        const is_descendant = isDescendant(targ, { parent: this.$el, })
        if (is_descendant && this.isBoxActive) {
          document.body.classList.add('locked')
        } else {
          document.body.classList.remove('locked')    
        }
      })
    },
    props: {
      isBoxActive: {
        type: Boolean,
        default: false,
      },
      notificationItems: {
        type: Array,
        default: [],
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .dropbox
    position absolute
    top 0
    right 0
    width 355px
    // height 457px
    background-color #fff
    box-shadow 0 0 2px 0 rgba(0, 0, 0, 0.3)
    padding-bottom 10px
    &__header
      height 26px
      border-bottom 1px solid #d3d3d3
      display flex
      justify-content space-between
      font-size 0.75rem
      > div
        display flex
        align-items center
        padding 0 10px
      &__title
        color #808080
      &__btn
        color #11b8c9
        span:not(:last-child)
          padding 0 10px 0 0
          position relative
          display block
          &:after
            content '﹒'
            width 10px
            height 100%
            position absolute
            right 0
            top 0
            font-weight bold
        span
          cursor pointer
          &:hover
            text-decoration underline
    &__items
      max-height 433px
      overflow auto
    &__item
      cursor pointer
      padding 5px 0
      min-height 50px
      width 100%
      display flex
      &.never
        background-color #e6e6e6
      &:not(:last-child)
        border-bottom 1px solid #d3d3d3
      &__avatar-img
        width 40px
        min-height 50px
        margin 0 10px
        img
          width 100%
          height 100%
          object-fit contain
          object-position center
      &__content
        flex 1
        display flex
        flex-direction column
        justify-content center
        line-height 1.125rem
        .message
          color #444746
          font-weight 300
          font-size 0.75rem
        .datetime
          color #808080
          font-size 0.75rem

</style>