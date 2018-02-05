<template>
  <div class="commentManagement">
    <div class="commentManagement__container"></div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:CommentManagement')
  const getmeComments = (store) => {
    return store.dispatch('FETCH_COMMENTS_ME')
  }
  export default {
    name: 'CommentManagement',
    methods: {},
    mounted () {
      debug('mounted')
      getmeComments(this.$store)
    },
  }
</script>
<style lang="stylus" scoped>
</style>