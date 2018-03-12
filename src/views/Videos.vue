<template>
  <div class="videos">
    <div class="videos__container">
      <aside class="videos__aside">
        <app-aside-nav></app-aside-nav>
      </aside>
      <main class="videos__main">
        <videos-highlight :video="highlightVideo"></videos-highlight>
        <videos-list ref="videosList" :videos="videoList"></videos-list>
      </main>
    </div>
  </div>
</template>

<script>
  import { currentYPosition, elmYPosition } from 'kc-scroll'
  import { get, xor } from 'lodash'
  import _ from 'lodash'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import VideosHighlight from '../components/videos/VideosHighlight.vue'
  import VideosList from '../components/videos/VideosList.vue'

  const MAXRESULT = 6
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const getVideos = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_PUBLIC_VIDEOS', {
      params: {
        max_result: max_result,
        page: page,
        sort: sort,
      }
    })
  }

  const getVideosCount = (store) => {
    return store.dispatch('GET_PUBLIC_VIDEOS_COUNT')
  }

  export default {
    name: 'AppVideos',
    // asyncData ({ store, route }) {
    // },
    components: {
      AppAsideNav,
      VideosHighlight,
      VideosList
    },
    data () {
      return {
        loading: false,
        page: DEFAULT_PAGE
      }
    },
    computed: {
      hasMore () {
        return get(this.$store, [ 'state', 'publicVideos', 'length' ], 0) < get(this.$store, [ 'state', 'publicVideosCount' ], 0)
      },
      highlightVideo () {
        return get(this.videos, [ 0 ])
      },
      videoList () {
        return xor(this.videos, [ this.highlightVideo ])
      },
      videos () {
        return get(this.$store, [ 'state', 'publicVideos' ], [])
      }
    },
    beforeMount () {
      Promise.all([
        getVideos(this.$store),
        getVideosCount(this.$store)
      ])
      
    },
    mounted () {
      window.addEventListener('scroll', this.$_videos_scrollHandler)
    },
    methods: {
      $_videos_scrollHandler (e) {
        const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        const currentBtm = currentYPosition() + vh
        const currentListBtm = elmYPosition('.videosList') + this.$refs.videosList.$el.offsetHeight
        if (this.hasMore && !this.loading && currentBtm > currentListBtm - 100) {
          this.loading = true
          this.page += 1
          getVideos(this.$store, { page: this.page })
          .then(() => {
            this.loading = false
          })
        }
      },
      get
    }
  }
</script>

<style lang="stylus" scoped>
  .videos
    width 100%
    min-height 100vh
    &__container
      padding-top 37px
    &__aside
      display none
      position sticky
      top 60px
      width 75px
      height 100%
  @media (min-width 950px)
    .videos
      &__container
        max-width 1200px
        height 100%
        margin auto
        padding 60px 0
        display flex
      &__aside
        display block
      &__main
        display flex
        justify-content space-between
        align-items flex-start
        width 100%
        margin-left 40px
      
    
</style>


