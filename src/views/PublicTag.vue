<template>
  <PublicPageWithAside class="public-page">
    <TagNav class="public-page__tag-nav"
      v-if="tagsForNav && tagsForNav.length > 0"
      :tags="tagsForNav" />
    <div class="public-page__container">
      <div class="public-page__main">
        <PostList :fetchPostAndReportByTag="fetchPostAndReportByTag"></PostList>
      </div>
      <div class="public-page__aside tags">
        <div class="public-page__aside-container aside-container">
          <TagNavAside class="aside-container__tag-nav-aside" />
        </div>
      </div>
    </div>
  </PublicPageWithAside>
</template>
<script>
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import PublicPageWithAside from 'src/components/layout/PublicPageWithAside.vue'
import PostList from 'src/components/post/PostList.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import TagNavAside from 'src/components/tag/TagNavAside.vue'
import { get, } from 'lodash'

const MAXRESULT_POSTS = 10
const DEFAULT_PAGE = 1

const getUserFollowing = (store, { id = get(store, 'state.profile.id'), resource, resourceType = '', } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id: id,
    resource: resource,
    resource_type: resourceType,
  })
}

const fetchFollowing = (store, params) => {
  return store.dispatch('GET_FOLLOWING_BY_RESOURCE', params)
}

const fetchPostAndReportByTag = (store, {
  tagId,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
  sort = '-published_at',
  datetime,
  nextLink,
} = {}) => {
  const time = datetime ? datetime : new Date().toISOString()
  const sortClean = sort.replace('-', '')
  return store.dispatch('GET_POST_REPORT_BY_TAG', {
    tagId,
    params: {
      max_result,
      page,
      sort,
      filter: `pnr:${sortClean}<=${time}`,
    },
    nextLink,
  })
}

export default {
  name: 'PublicTag',
  asyncData ({ store, route, }) {
    return fetchPostAndReportByTag(store, {
      tagId: get(route, 'params.tagId'),
    })
  },
  metaInfo () {
    return {
      description: this.$i18n ? this.$t('OG.DESCRIPTION') : '',
      ogTitle: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
      title: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
      metaUrl: this.$route.path,         
    }
  },
  components: {
    CommentContainer,
    PostList,
    PublicPageWithAside,
    TagNav,
    TagNavAside,
  },
  watch: {
    projectSingleTagIds (ids) {
      fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
    },
  },
  computed: {
    assetId () {
      let assetId = 0
      switch (this.route) {
        case 'series':
          assetId = get(this.projectSingle, 'id') || assetId
          break
      }
      return assetId      
    },
    me () {
      return get(this.$store, 'state.profile', {})
    },
    projectSingle () {
      return get(this.$store, 'state.publicProjectSingle')
    },
    projectSingleTagIds () {
      const tags = this.projectSingle.tags || []
      return tags.map(tag => tag.id)
    },
    tagsForNav () {
      return get(this.$store, 'state.itemsByTag.items.0.tags', []).filter(tag => tag.id === Number(this.$route.params.tagId))
    },
  },
  methods: {
    get,
    fetchPostAndReportByTag,
  },
  beforeMount () {
    getUserFollowing(this.$store, { resource: 'post', })
    getUserFollowing(this.$store, { resource: 'memo', })
    getUserFollowing(this.$store, { resource: 'report', })
    getUserFollowing(this.$store, { resource: 'tag', })
    getUserFollowing(this.$store, { resource: 'project', })
  },
  mounted () {},
}
</script>