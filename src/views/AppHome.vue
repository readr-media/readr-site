<template>
  <section class="home">
    <!-- <div v-if="publicProjectsRecommends.length > 0">
      <h2>
        為您推薦
      </h2>
      <SeriesList
        :items="publicProjectsRecommends"
        class="home__list recommend"
      />
    </div> -->
    <div v-if="publicProjectsTrends.length > 0">
      <h2 class="decorated">
        最熱門專題
      </h2>
      <SeriesList
        :items="publicProjectsTrends"
        ga-event-label="popular"
        class="home__list highlight"
      />
    </div>
    <div class="home__series-posts">
      <div class="home__posts">
        <h2 class="decorated">
          文章
        </h2>
        <PostsSlideshow
          :has-more="hasMorePosts"
          :posts="publicPosts"
          :chunk-size="5"
          class="home__posts-slideshow"
          @toFinalChunk="loadMorePosts"
        />
      </div>
      <div class="home__series">
        <h2 class="decorated">
          專題
        </h2>
        <SeriesList
          :item-style="'comm-narrow'"
          :items="publicProjectsNormal"
          ga-event-label="series"
          class="home__list"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '../constants'
import { get } from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { isScrollBarReachBottom } from '../util/comm'

import PostsSlideshow from 'src/components/post/PostsSlideshow.vue'
import SeriesList from 'src/components/series/SeriesList.vue'

export default {
  name: 'AppHome',
  components: {
    PostsSlideshow,
    SeriesList
  },
  metaInfo: {
    title: SITE_NAME,
    titleTemplate: null
  },
  data () {
    return {
      currentPostsPage: 1,
      currentSeriesPage: 1,
      hasMorePosts: true,
      hasMoreSeries: true,
      loading: false
    }
  },
  computed: {
    ...mapState({
      publicPosts: state => state.DataPost.posts,
      publicProjects: state => state.DataSeries.publicProjects
    }),
    // publicProjectsRecommends () {
    //   // return this.publicProjects.recommends
    //   return this.publicProjects.normal.slice(0, 3)
    // },
    publicProjectsTrends () {
      // return this.publicProjects.trends
      return this.publicProjects.normal.slice(0, 1)
    },
    publicProjectsNormal () {
      return this.publicProjects.normal
    }
  },
  asyncData ({ store }) {
    return Promise.all([
      store.dispatch('DataSeries/FETCH'),
      store.dispatch('DataPost/GET_POSTS', { maxResult: 15, projectId: 0 })
    ])
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
  },
  beforeMount () {
    if (this.$route.name === 'donate') {
      this.SET_CURRENT_SIDEBAR_SLOT('donate')
      this.SET_SHOW_SIDEBAR(true)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.loadMoreSeries)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.loadMoreSeries)
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR',
      SET_CURRENT_SIDEBAR_SLOT: 'UIAppHeader/SET_CURRENT_SIDEBAR_SLOT'
    }),
    loadMorePosts () {
      if (this.hasMorePosts && !this.loading) {
        this.loading = true
        this.$store.dispatch('DataPost/GET_POSTS', { maxResult: 15, projectId: 0, page: this.currentPostsPage + 1 })
          .then(res => {
            if (res.length === 0) {
              this.hasMorePosts = false
            }
            this.currentPostsPage += 1
            this.loading = false
          })
      }
    },
    loadMoreSeries () {
      if (this.hasMoreSeries && !this.loading && isScrollBarReachBottom(1 / 3)) {
        const origCount = get(this.publicProjectsNormal, [ 'length' ], 0)
        this.loading = true
        this.$store.dispatch('DataSeries/FETCH', { page: this.currentSeriesPage + 1 })
          .then(() => {
            this.currentSeriesPage += 1
            this.hasMoreSeries = !(get(this.publicProjectsNormal, [ 'length' ], 0) <= origCount)
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.home
  width 80%
  max-width 1040px
  margin 0 auto
  padding 100px 0
  > div
    & + div
      margin 35px 0 0
  h2
    text-align center
    &.decorated
      display flex
      justify-content center
      align-items center
      padding 0 20px
      &:before
        content ''
        display block
        flex 1 1 auto
        height 1px
        background-color #979797
        margin 0 25px 0 0
      &:after
        content ''
        display block
        flex 1 1 auto
        height 1px
        background-color #979797
        margin 0 0 0 25px
  &__list
    display flex
    flex-wrap wrap
    margin-top 1em

    >>> .list-item.comm-narrow
      width calc((100% - 120px) / 3)
      margin 30px 20px 0
      &:nth-child(1), &:nth-child(2), &:nth-child(3)
        margin-top 0
    &.recommend
      >>> .list-item
        width calc((100% - 120px) / 3)
        margin 0 20px
    &.highlight
      justify-content center
      >>> .list-item
        width 80%
        max-width 900px
        margin 0
        background-color transparent
        h2, p
          text-align center
  &__series-posts
    > div
      & + div
        margin-top 35px
  &__posts-slideshow
    width calc(100% - 40px)
    margin 0 auto
    >>> .list-item
      display block
      padding 0 0 .5em 0
      border-bottom 1px solid #979797
      figure
        display none
      .title, .description
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
      .title
        height calc(1em * 1.15 * 2)
      .description
        height calc(1em * 1.3 * 2)
@media (min-width: 1200px)
  .home
    > div
      & + div
        margin 70px 0 0
    &__list
      >>> .list-item.comm-narrow
        &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
          margin-top 14px
    &__series-posts
      display flex
      > div
        & + div
          margin-top 0
    &__series
      flex 3
      order 0
    &__posts
      flex 1
      order 1
    &__posts-slideshow
      margin-top calc(1em + 14px)

</style>
