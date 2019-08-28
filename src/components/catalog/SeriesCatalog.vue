<template>
  <div class="series-catalog-wrapper">
    <div
      v-if="seriesPosts.length > 0"
      class="series-catalog-list-wrapper"
    >
      <h2>目錄</h2>
      <ol class="series-contents-list">
        <li
          v-for="(post, i) in seriesPosts"
          :key="i"
          class="series-contents-list__list-item series-contents-list-item"
        >
          <LinkItem
            class="series-contents-list-item__link"
            :href="createPost(post).processed.url"
          >
            <div
              class="series-contents-list-item__order"
              v-text="i + 1"
            />
            <div
              class="series-contents-list-item__title"
              v-text="post.ogTitle || post.title"
            />
          </LinkItem>
        </li>
      </ol>
    </div>
    <NoSSR>
      <infinite-loading @infinite="infiniteHandler" />
    </NoSSR>
  </div>
</template>

<script>
import { createPost } from 'src/util/post'
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

import LinkItem from 'src/components/common/LinkItem.vue'
import NoSSR from 'vue-no-ssr'

export default {
  components: {
    LinkItem,
    NoSSR
  },
  computed: {
    ...mapState({
      seriesPosts: state => state.DataSeriesContents.publicProjectContents,
      singleSeries: state => state.DataSeries.singleSeries,
      currentPage: state => state.DataSeriesContents.currentPage
    }),
    seriesId () {
      return _.get(this.singleSeries, 'id', '')
    }
  },
  methods: {
    createPost,
    ...mapMutations({
      SET_CURRENT_PAGE: 'DataSeriesContents/SET_CURRENT_PAGE'
    }),
    infiniteHandler ($state) {
      if (this.currentPage === 0) {
        this.SET_CURRENT_PAGE(1)
      }

      this.$store.dispatch(
        'DataSeriesContents/FETCH',
        {
          params: {
            project_id: this.seriesId,
            page: this.currentPage,
            max_result: 10,
            sort: 'post_order,-published_at'
          }
        }
      ).then(res => {
        if (res && res.body.items.length) {
          this.SET_CURRENT_PAGE(this.currentPage + 1)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.series-catalog-list-wrapper
  width 60%
  max-width 800px
  margin 50px auto

.series-contents-list
  margin 1.5rem 0 0 0
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
