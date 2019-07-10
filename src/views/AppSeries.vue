<template>
  <section class="series">
    <main>
      <div
        v-if="singleSeries.heroImage || singleSeries.ogImage"
        class="series__image app-content-area"
      >
        <figure>
          <img
            :src="singleSeries.heroImage || singleSeries.ogImage"
            :alt="singleSeries.title || singleSeries.ogTitle"
          >
        </figure>
      </div>
      <h1
        class="app-content-area"
        v-text="singleSeries.title || singleSeries.ogTitle"
      />
      <p
        class="app-content-area"
        v-text="singleSeries.description || singleSeries.ogDescription"
      />
      <!-- <a
        v-if="latestSeriesPosts.id"
        :href="latestSeriesPosts.processed.fullUrl"
        target="_blank"
      >
        前往閱讀
      </a> -->
    </main>
    <div class="series__contents-list-wrapper">
      <p>目錄</p>
      <ol class="series-contents-list">
        <li
          v-for="(post, i) in seriesPosts"
          :key="i"
          class="series-contents-list__list-item series-contents-list-item"
        >
          <router-link
            class="series-contents-list-item__link"
            :to="createPost(post).processed.url"
          >
            <div
              class="series-contents-list-item__order"
              v-text="i + 1"
            />
            <div
              class="series-contents-list-item__title"
              v-text="post.title"
            />
          </router-link>
        </li>
      </ol>
    </div>
    <lazy-component
      class="series-bottom"
      @show="fetchSeries"
    >
      <div class="app-content-area series__more-series">
        <h2>更多專題</h2>
        <SeriesList
          :item-style="'comm-series-more'"
          :items="seriesFilterSelf"
          class="series__more-series-list"
        />
      </div>
    </lazy-component>
  </section>
</template>
<script>
import { SITE_FULL } from 'src/constants'
import { createPost } from 'src/util/post'
import { getFullUrl } from 'src/util/comm'
import { mapState } from 'vuex'

import SeriesList from 'src/components/series/SeriesList.vue'

export default {
  name: 'AppSeries',
  components: {
    SeriesList
  },
  metaInfo () {
    const title = this.singleSeries.ogTitle || this.singleSeries.title
    const description = this.singleSeries.ogDescription || this.singleSeries.description
    const image = this.singleSeries.ogImage || this.singleSeries.heroImage || `${SITE_FULL}/public/og-image.jpg`
    return {
      title: title,
      meta: [
        { name: 'description', content: description },
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: getFullUrl(this.$route.path) },
        { vmid: 'og:image', property: 'og:image', content: image }
      ]
    }
  },
  computed: {
    ...mapState({
      series: state => state.DataSeries.publicProjects.normal,
      singleSeries: state => state.DataSeries.singleSeries,
      seriesPosts: state => state.DataSeriesContents.publicProjectContents
    }),
    latestSeriesPosts () {
      return this.seriesPosts.length > 0 ? createPost(this.seriesPosts[0]) : {}
    },
    seriesFilterSelf () {
      return this.series.filter(series => series.slug !== this.$route.params.slug).slice(0, 3)
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataSeries/FETCH_SINGLE_SERIES', { slug: route.params.slug })
      .then(res => {
        if (res.body.items.length === 0) {
          const err = new Error()
          err.status = 404
          return Promise.reject(err)
        }
      })
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
  },
  methods: {
    createPost,
    fetchSeries () {
      this.$store.dispatch('DataSeries/FETCH', { maxResult: 4 })
    }
  }
}
</script>
<style lang="stylus" scoped>
.series
  main
    h1, div
      & + *
        margin-top 1.5rem
    a
      display block
      width 300px
      height 50px
      margin-left auto
      margin-right auto
      font-weight 500
      line-height 50px
      text-align center
      background-color #ddcf21
      border-radius 8px
  h1
    & + p
      margin-top 17px
  h2
    & + div
      margin-top 1.5rem
  p
    text-align justify
    line-height 1.86
    & + *
      margin-top 17px
  &__image
    figure
      position relative
      width 100%
      padding-top 56.25%
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__contents-list-wrapper
    width 60%
    max-width 800px
    margin 50px auto
    p
      font-size 14px
      font-weight 500
  &__more-series
    margin-top 2em
    padding-bottom 2em
    &-list
      display flex
      justify-content space-between
      >>> .list-item
        figure
          border 1px solid #979797
        h1
          margin-top .2em

.series-contents-list
  margin 0
  padding 0
  list-style none
  &__list-item
    & + &
      border-top 1px solid #979797

.series-contents-list-item
  height 40px
  display flex
  align-items center
  transition background-color .25s ease-out
  &:hover
    background-color white
  &__link
    display flex
    width 100%
    height 100%
  &__order
    min-width 50px
    max-width 50px
    display flex
    justify-content center
    align-items center
    font-size 18px
    color #11b8c9
  &__title
    font-size 14px
    line-height 40px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
</style>
