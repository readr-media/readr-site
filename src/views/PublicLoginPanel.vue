<template>
  <div></div>
</template>
<script>
  const switchOn = (store, message) => store.dispatch('LOGIN_ASK_TOGGLE', { active: true, message, type: 'WINDOW', })
  export default {
    name: 'PublicLoginPanel',
    methods: {},
    mounted () {
      switchOn(this.$store)
    },
  }
</script>
<style lang="stylus" scoped></style>