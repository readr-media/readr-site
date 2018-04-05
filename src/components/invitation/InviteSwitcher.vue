<template>
  <div class="switcher" @click="toggleInvitation">
    <slot name="icon"></slot>
  </div>
</template>
<script>
  // const debug = require('debug')('CLIENT:InviteSwitcher')
  const toggleInvitation = (store, { params, }) => {
    return store.dispatch('INVITATION_SWITCH_ON', {
      params,
    })
  }
  export default {
    name: 'InviteSwitcher',
    methods: {
      toggleInvitation () {
        toggleInvitation(this.$store, {})
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .switcher
    cursor pointer
</style>