<template>
  <div>
    <p>{{ post.title }}</p>
    <p v-html="post.content"></p>
  </div>
</template>

<script>
import _ from 'lodash'

const DEFAULT_MODE = 'set'
const DEFAULT_CATEGORY = 'latest'
const fetchPosts = (store, { mode, }) => {
  return store.dispatch('GET_PUBLIC_POSTS', {
    params: {
      mode: mode || DEFAULT_MODE,
      category: DEFAULT_CATEGORY,
    },
  })
}

export default {
  asyncData ({ store, }) {
    return fetchPosts(store, {})
  },
  computed: {
    post () {
      return _.find(this.$store.state.publicPosts.items, { id: Number(this.$route.params.id), })
    },
  },
  metaInfo () {
    return {
      title: this.post.ogTitle,
      description: this.post.ogDescription,
      metaUrl: this.$route.path,
      metaImage: this.post.ogImage,
    }
  },
}
</script>

<style lang="stylus" scoped>
p
  padding-top 100px
</style>


