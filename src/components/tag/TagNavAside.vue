<template>
  <nav class="tag-nav-aside">
    <AppDropdownOptions
      class="tag-nav-aside__sort"
      :picked.sync="currentRadioPicked"
      :options="radioOptions"
    />
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
import { isElementReachInView, isElementScrollable, } from 'src/util/comm'
import AppDropdownOptions from '../AppDropdownOptions.vue'
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
    AppDropdownOptions,
    TagItem,
  },
  watch: {
    tags (newValue, oldValue) {
      if (newValue.length === oldValue.length) {
        this.hasNextPage = false
      }
    },
    currentRadioPicked () {
      this.resetLoadmore()
      this.fetchTags()
    },
    me () {
      getUserFollowing(this.$store, { resource: 'tag', })
    },
  },
  data () {
    return {
      tagsCurrentPage: DEFAULT_PAGE,
      hasNextPage: true,
      isLoadingTags: false,
      currentRadioPicked: 'hot',
      radioOptions: [
        {
          text: this.$t('TAG_NAV_ASIDE.TITLE.hot'),
          key: 'hot',
        },
        {
          text: this.$t('TAG_NAV_ASIDE.TITLE.latest'),
          key: 'latest',
        },
        {
          text: this.$t('TAG_NAV_ASIDE.TITLE.taggedProjects'),
          key: 'taggedProjects',
        },
        {
          text: this.$t('TAG_NAV_ASIDE.TITLE.followed'),
          key: 'followed',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      me: state => get(state, 'profile', {}),
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
      this.hasNextPage = true
    },
    createLoadmoreBehavior (shouldLoadmoreAt) {
      if (shouldLoadmoreAt && this.hasNextPage && !this.isLoadingTags && this.currentRadioPicked === 'latest') {
        this.isLoadingTags = true
        getTags(this.$store, { page: this.tagsCurrentPage + 1, stats: false, })
        .then(() => {
          this.tagsCurrentPage += 1
          this.isLoadingTags = false
        })
        .catch(() => {
          this.hasNextPage = false
          this.isLoadingTags = false
        })
      }
    },
    loadmoreTags () {
      const shouldLoadmore = isElementReachInView(document.querySelector('body'), '.tag-nav-aside', 0.5)
      this.createLoadmoreBehavior(shouldLoadmore)
    },
    fetchTags () {
      switch (this.currentRadioPicked) {
        case 'latest':
          return getTags(this.$store, { stats: false, })
        case 'hot':
          return getTags(this.$store, { stats: false, urlParam: '/hot', })
        case 'taggedProjects':
          return getTags(this.$store, { stats: false, tagging_type: TYPE_TAGGED_PROJECTS, })
        case 'followed':
          return getUserFollowing(this.$store, { resource: 'tag', })
        default:
          return getTags(this.$store, { stats: false, })
      }
    },
  },
  beforeMount () {
    this.fetchTags()
    .then(() => {
      if (!isElementScrollable(this.$el)) {
        document.addEventListener('scroll', this.loadmoreTags)
      } else {
        this.$el.onscroll = () => {
          const shouldLoadmore = this.$el.scrollTop + this.$el.offsetHeight === this.$el.scrollHeight
          this.createLoadmoreBehavior(shouldLoadmore)
        }
      }
    })
    getUserFollowing(this.$store, { resource: 'tag', })
  },
  destroyed () {
    if (!isElementScrollable(this.$el)) {
      document.removeEventListener('scroll', this.loadmoreTags)
    }
  },
}
</script>

<style lang="stylus" scoped>
.tag-nav-aside
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

