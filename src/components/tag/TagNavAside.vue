<template>
  <nav class="tag-nav-aside">
    <!-- TODO: add sorting radio buttons -->
    <h1 class="tag-nav-aside__sort-title" v-text="$t('TAG_NAV_ASIDE.TITLE.LATEST')"></h1>
    <ol class="tag-nav-aside__list">
      <TagItem
        v-for="tag in tags"
        :key="tag.id"
        class="tag-nav-aside__tag-item"
        :tag="tag"
        :showTrendingRank="true"
        :showRelatedsList="true"
      />
    </ol>
  </nav>
</template>

<script>
import { isEmpty, } from 'lodash'
import { mapState, } from 'vuex'
import TagItem from './TagItem.vue'

const MAXRESULT = 40
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const getTags = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
  keyword = '',
  stats = false,
} = {}) => {
  return store.dispatch('GET_TAGS', {
    params: {
      max_result: max_result,
      page: page,
      sorting: sort,
      keyword: keyword,
      stats: stats,
    },
  })
}

export default {
  components: {
    TagItem,
  },
  watch: {
    tags (newValue, oldValue) {
      if (newValue.length === oldValue.length) {
        this.shouldTagsLoadMore = false
      }
    },
  },
  data () {
    return {
      tagsCurrentPage: DEFAULT_PAGE,
      shouldTagsLoadMore: true,
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tags,
    }),
  },
  beforeMount () {
    if (isEmpty(this.tags)) {
      getTags(this.$store, { stats: false, })
    }

    this.$el.onscroll = () => {
      const isScrollbarReachEnd = this.$el.scrollTop + this.$el.offsetHeight === this.$el.scrollHeight
      if (isScrollbarReachEnd) {
        getTags(this.$store, { page: this.tagsCurrentPage + 1, stats: false, })
        .then(() => {
          if (this.shouldTagsLoadMore) this.tagsCurrentPage += 1
        })
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav-aside
  width 275px
  height calc(100vh - 57.5px)
  padding 5.5px 0 28px 0
  overflow-y scroll
  &::-webkit-scrollbar
    display none
    background-color transparent
  &::-webkit-scrollbar-track
    background-color transparent
  &::-webkit-scrollbar-thumb
    background-color transparent
  &__sort-title
    font-size 18px
    font-weight 600
    margin 0 0 20px 0
  &__list
    list-style none
    margin 0
    padding 0
  &__tag-item
    display flex !important
    & + &
      margin 10px 0 0 0
    & >>> .tag-item__tag
      max-width 215px
      min-width 215px
</style>

