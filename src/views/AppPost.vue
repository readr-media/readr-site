<template>
  <section class="post">
    <figure v-if="postImage" />
    <main class="app-content-area">
      <p
        class="small"
        v-text="dayjs(post.publishedAt).format('YYYY/MM/DD')"
      />
      <h1 v-text="post.title || post.ogTitle" />
      <article>{{ postContentProcessed }}</article>
    </main>
    <lazy-component class="post-bottom">
      <DonateWithShare :url="getPostFullUrl(post)" />
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL } from 'src/constants'
import { createPost } from 'src/util/post'
import { getPostFullUrl } from 'src/util/post/index'
import { mapState } from 'vuex'

import DonateWithShare from 'src/components/DonateWithShare.vue'
import dayjs from 'dayjs'

export default {
  name: 'AppPost',
  components: {
    DonateWithShare
  },
  metaInfo () {
    const title = this.post.title
    const description = this.post.ogDescription || this.postProcessed.contentTruncateWithoutHtml
    const image = this.post.ogImage || this.post.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:url', content: getPostFullUrl(this.post) },
        { name: 'og:image', content: image }
      ]
    }
  },
  serverPrefetch () {
    return this.$store.dispatch('DataPost/GET_POST', { id: this.$route.params.postId })
  },
  computed: {
    ...mapState({
      post: state => state.DataPost.post
    }),
    postImage () {
      return this.post.heroImage || this.post.ogImage
    },
    postContentProcessed () {
      return this.postProcessed.contentProcessed.join('')
    },
    postProcessed () {
      return createPost(this.post)
    }
  },
  methods: {
    dayjs,
    getPostFullUrl
  }
}
</script>
<style lang="stylus" scoped>
  .post
    main
      padding 1em 0 5em
    article
      margin .5em 0 0
      >>> *
        & + *
          margin-top .5em
      >>> p
        line-height 1.86
        text-align justify
      >>> img
        position relative
        top 0
        left -12.5%
        width 125%
      >>> iframe
        width 100%
      >>> .readme-embed
        > div
          display none
    h2
      & + div
        margin-top .5em
    p
      &.small
        color #4a4a4a
      & + h1
        margin-top .5em

    .post-bottom
      margin 0
      padding 30px 0 60px
      background-color #fff
</style>
