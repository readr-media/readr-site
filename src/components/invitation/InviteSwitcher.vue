<template>
  <div class="switcher" :class="{ hide: quota <= 0 }"@click="toggleInvitation">
    <slot name="icon"></slot>
    <div class="switcher__quota" v-text="quota"></div>
  </div>
</template>
<script>
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:InviteSwitcher')
  const toggleInvitation = (store, { params, }) => {
    return store.dispatch('INVITATION_SWITCH_ON', {
      params,
    })
  }
  const fetchQuota = (store) => {
    return store.dispatch('FETCH_INVITATIONO_QUOTA')
  }

  export default {
    name: 'InviteSwitcher',
    computed: {
      curr_user () {
        return get(this.$store, 'state.profile.id')
      },
      quota () {
        return get(this.$store, 'state.invitation_quota')
      },
    },
    methods: {
      toggleInvitation () {
        toggleInvitation(this.$store, {})
      },
    },
    beforeMount () {
      debug('curr_user beforeMount.')
      this.curr_user && Promise.all([
        fetchQuota(this.$store),
      ])
    },
    watch: {
      curr_user: function () {
        debug('curr_user change detected.')
        this.curr_user && Promise.all([
          fetchQuota(this.$store),
        ])
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .switcher
    cursor pointer
    &.hide
      display none
    &__quota
      height 18px
      width 28px
      position absolute
      top 50%
      left 50%
      overflow hidden
      margin-left -14px
      margin-top -9px
      font-size 18px
      color #d0021b
      display flex
      align-items center
      justify-content center
</style>