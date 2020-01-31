<template>
  <section class="section">
    <iframe
      :src="`/project/${slug}`"
      class="section__iframe iframe"
      frameborder="0"
    />
  </section>
</template>

<script>
import _ from 'lodash'
import { SITE_FULL, SITE_NAME } from 'src/constants'
import { createPost } from 'src/util/post'
import { getPostFullUrl } from 'src/util/post/index'
import { mapState } from 'vuex'

export default {
  name: 'AppReport',
  metaInfo () {
    const title = this.report.ogTitle || this.report.title
    const description = this.report.ogDescription || this.report.contentTruncateWithoutHtml
    const image = this.report.ogImage || this.report.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { vmid: 'og:type', property: 'og:type', content: 'article' },
        { vmid: 'og:title', property: 'og:title', content: `${title} - ${SITE_NAME}` },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: getPostFullUrl(this.report) },
        { vmid: 'og:image', property: 'og:image', content: image }
      ]
    }
  },
  computed: {
    ...mapState({
      report: state => createPost(state.DataPost.post)
    }),
    slug () {
      return this.$route.params.slug
    }
  },
  asyncData ({ store, route }) {
    const slug = _.get(route, 'params.slug')
    return slug &&
      slug !== 'null' &&
      store.dispatch('DataPost/GET_POST_REPORT', { slug: slug })
        .catch(err => {
          const error = { code: err.status }
          throw error
        })
  }
}
</script>

<style lang="stylus" scoped>
.iframe
  width 100%
  height 100vh
  background-color white
</style>
