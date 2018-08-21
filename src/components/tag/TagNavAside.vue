<template>
  <nav class="tag-nav-aside">
    <TagNavAsideDropdownOptions class="tag-nav-aside__sort" :picked.sync="currentRadioPicked"/>
    <ol class="tag-nav-aside__list">
      <TagItem
        v-for="(tag, i) in tags"
        :key="`${currentRadioPicked}-${tag.id}-${i}`"
        class="tag-nav-aside__tag-item"
        :tag="tag"
        :showTrendingRank="true"
        :showRelatedsList="true"
      />
    </ol>
  </nav>
</template>

<script>
import { get, } from 'lodash'
import { mapState, } from 'vuex'
import TagNavAsideDropdownOptions from './TagNavAsideDropdownOptions.vue'
import TagItem from './TagItem.vue'

const MAXRESULT = 40
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const DEFAULT_URL_PARAM = '' // empty for getting latest tags
const TYPE_TAGGED_PROJECTS = 2
const RESOURCE_TAGGED_PROJECTS = 1
const getTags = (store, {
  urlParam = DEFAULT_URL_PARAM,
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sorting = DEFAULT_SORT,
  keyword = '',
  stats = false,
  tagging_type = '',
  tagged_resources = RESOURCE_TAGGED_PROJECTS,
} = {}) => {
  return store.dispatch('GET_PUBLIC_TAGS', {
    urlParam,
    params: {
      max_result,
      page,
      sorting,
      keyword,
      stats,
      tagging_type,
      tagged_resources,
    },
  })
}

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

export default {
  components: {
    TagNavAsideDropdownOptions,
    TagItem,
  },
  watch: {
    tags (newValue, oldValue) {
      if (newValue.length === oldValue.length) {
        this.shouldTagsLoadMore = false
      }
    },
    currentRadioPicked () {
      this.resetLoadmore()
      this.fetchTags()
    },
  },
  data () {
    return {
      tagsCurrentPage: DEFAULT_PAGE,
      shouldTagsLoadMore: true,
      currentRadioPicked: 'latest',
    }
  },
  computed: {
    ...mapState({
      tagsPublic: state => state.publicTags,
      tagsFollowed: state => get(state.followingByUser, [ state.profile.id, 'tag', ], [],),
    }),
    tags () {
      return this.currentRadioPicked === 'followed' ? this.tagsFollowed : this.tagsPublic
    },
  },
  methods: {
    resetLoadmore () {
      this.tagsCurrentPage = DEFAULT_PAGE
      this.shouldTagsLoadMore = true
    },
    fetchTags () {
      switch (this.currentRadioPicked) {
        case 'latest':
          getTags(this.$store, { stats: false, })
          break
        case 'hot':
          getTags(this.$store, { stats: false, urlParam: '/hot', })
          break
        case 'taggedProjects':
          getTags(this.$store, { stats: false, tagging_type: TYPE_TAGGED_PROJECTS, })
          break
        case 'followed':
          getUserFollowing(this.$store, { resource: 'tag', })
          break
        default:
          getTags(this.$store, { stats: false, })
      }
    },
  },
  beforeMount () {
    this.fetchTags()
    getUserFollowing(this.$store, { resource: 'tag', })
  },
  mounted () {
    this.$el.onscroll = () => {
      const isScrollbarReachEnd = this.$el.scrollTop + this.$el.offsetHeight === this.$el.scrollHeight
      if (isScrollbarReachEnd && this.shouldTagsLoadMore && this.currentRadioPicked === 'latest') {
        getTags(this.$store, { page: this.tagsCurrentPage + 1, stats: false, })
        .then(() => { this.tagsCurrentPage += 1 })
        .catch(() => { this.shouldTagsLoadMore = false })
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav-aside
  height calc(100vh - 57.5px)
  padding 5.5px 0 28px 20px
  overflow-y scroll
  &::-webkit-scrollbar
    display none
    background-color transparent
  &::-webkit-scrollbar-track
    background-color transparent
  &::-webkit-scrollbar-thumb
    background-color transparent
  &__sort
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

