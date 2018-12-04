<template>
  <PollContainer :initialPoll="poll" />
</template>
<script>
import PollContainer from 'src/components/poll/PollContainer.vue'

const fetchPoll = (store, {
  id,
} = {}) => {
  return store.dispatch('FETCH_EMBED_POLL', {
    active: 1,
    ids: `in:[${id}]`,
    page: 1,
    embed: 'choices,created_by',
  })
}

export default {
  name: 'EmbedPoll',
  asyncData ({ store, route, router, }) {
    return fetchPoll(store, { id: route.params.id, })
      .then(res => {
        if (!res.items) {
          if (process.browser) {
            router.push('/404')
          } else {
            const err = new Error()
            err.massage = 'Page Not Found'
            err.code = 404
            throw err  
          }
        }
      })
  },
  components: {
    PollContainer,
  },
  metaInfo () {
    return {
      description: this.poll.description,
      ogTitle: this.poll.title,
      title: this.poll.title,
      metaUrl: this.$route.path,
    }
  },
  computed: {
    poll () {
      return this.$store.state.embedPoll
    },
  },
}
</script>
<style lang="stylus" scoped>
      
</style>
