<template>
  <div class="videos">
    <div class="videos__container">
      <aside class="videos__aside">
        <aside-nav></aside-nav>
      </aside>
      <main class="videos__main">
        <section class="videos__highlight">
          <div class="videos__highlight-video">
            <!-- <iframe v-if="get(highlightVideo, [ 'link' ])" :src="get(highlightVideo, [ 'link' ])"></iframe> -->
            <!-- <iframe width="560" height="315" src="https://livehouse.in/embed/channel/nctaiwan/record/4kgsqmPNML" frameborder="0" allowfullscreen></iframe> -->
          </div>
        </section>
        <section>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
  import { get } from 'lodash'
  import _ from 'lodash'
  import AppAsideNav from '../components/AppAsideNav.vue'

  const MAXRESULT = 20
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

  export default {
    name: 'AppVideos',
    components: {
      'aside-nav': AppAsideNav,
    },
    data () {
      return {
        highlightID: undefined
      }
    },
    computed: {
      test () {
        return get(this.highlightVideo, [ 'link' ])
      },
      highlightVideo () {
        return _.find(this.videos, { id: this.highlightID }) || _.get(this.videos, [ 0 ])
      },
      videos () {
        return _.get(this.$store, [ 'state', 'publicVideos' ], [])
      }
    },
    beforeMount () {
      getVideos(this.$store)
    },
    methods: {
      get
    }
  }
</script>

<style lang="stylus" scoped>
  .videos
    width 100%
    height 100vh
    max-height 100vh
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
        width 100%
        margin-left 40px
      &__highlight
        width 650px
      &__highlight-video
        iframe
          width 100%
    
</style>


