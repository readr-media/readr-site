<template>
  <div class="public-page">
    <Leading v-if="hasLeading">
      <TagNav
        v-if="tagsForNav && tagsForNav.length > 0"
        slot="tagNav"
        :tags="tagsForNav"
        class="public-page__tag-nav" />
    </Leading>
    <template v-else>
      <TagNav
        v-if="tagsForNav && tagsForNav.length > 0"
        slot="tagNav"
        :tags="tagsForNav"
        class="public-page__tag-nav" />
    </template>
    <div class="public-page__container">
      <div class="public-page__main">
        <PostList
          :fetchPostAndReportByTag="fetchPostAndReportByTag"
          :fetchPublicMemos="fetchPublicMemos"
          :fetchReportsList="fetchReportsList"></PostList>
      </div>
      <div class="public-page__aside" :class="asideType.toLowerCase()">
        <div class="public-page__aside-container aside-container">
          <CommentContainer :asset="commentAsset" :assetId="assetId" v-if="asideType === ASIDE_TYPE.COMMENTS" :isPublic="!get(me, 'id')"></CommentContainer>
          <TagNavAside class="aside-container__tag-nav-aside" v-else-if="asideType === ASIDE_TYPE.TAGS" />
        </div>
        <!--render else empty block for ss/cs mating-->
        <!--div v-else></div-->
        <!--render else empty block for ss/cs mating-->
      </div>
    </div>  
    <Donate></Donate>
  </div>
</template>
<script>
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import Donate from 'src/components/point/Donate.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostList from 'src/components/post/PostList.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import TagNavAside from 'src/components/tag/TagNavAside.vue'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate-html'
import { MEMO_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, } from 'api/config'
import { isClientSide, } from 'src/util/comm'
import { get, } from 'lodash'

const ASIDE_TYPE = {
  COMMENTS: 'COMMENTS',
  TAGS: 'TAGS',
}
const MAXRESULT_POSTS = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-memo_order,-updated_at'

const debug = require('debug')('CLIENT:PublicPageWithAside')

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


const fetchProjectSingle = (store, proj_slug) => {
  return store.dispatch('GET_PUBLIC_PROJECT', {
    params: {
      where: {
        status: [ PROJECT_STATUS.WIP, PROJECT_STATUS.DONE, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
      slugs: [ proj_slug, ],
    },
  })
}

const fetchPublicMemos = (store, { 
  max_result = MAXRESULT_POSTS, 
  mode = 'set',
  proj_ids = [],
  sort = DEFAULT_SORT, 
  page = DEFAULT_PAGE,
} = {}) => { 
  return store.dispatch('GET_PUBLIC_MEMOS', { 
    params: { 
      member_id: get(store, 'state.profile.id', -1), 
      project_id: proj_ids,
      max_result: max_result, 
      page,
      where: { 
        memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED, 
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED, 
      }, 
      sort: sort, 
    },
    mode,
  })
}

const fetchReportsList = (store, {
  max_result = 10,
  proj_ids = [],
  sort = '-updated_at',
} = {}) => {
  return store.dispatch('GET_PUBLIC_REPORTS', {
    params: {
      max_result: max_result,
      project_id: proj_ids,
      where: {
        report_publish_status: REPORT_PUBLISH_STATUS.PUBLISHED,
      },
      sort: sort,
    },
  })
}

const switchOn = (store, item) => store.dispatch('SWITCH_ON_DONATE_PANEL', { item, })
 
export default {
  name: 'PublicPageWithAside',
  asyncData ({ store, route, }) {
    const processes = []
    // if (get(route, 'params.subItem') && get(route, 'params.subItem') !== 'donate') {
    //   processes.push(fetchMemoSingle(store, get(route, 'params.subItem')))
    // }
    if (route.fullPath.split('/')[ 1 ] === 'series' && get(route, 'params.slug')) {
      processes.push(fetchProjectSingle(store, get(route, 'params.slug')).then(proj => {
        const projId = get(proj, 'id')
        return Promise.all([
          fetchPublicMemos(store, {
            mode: 'set',
            proj_ids: [ projId, ],
            page: 1,
          }),
          fetchReportsList(store, {
            proj_ids: [ projId, ],
            page: 1,  
          }),
        ])
      }))
    } else if (route.fullPath.split('/')[ 1 ] === 'tag' && get(route, 'params.tagId')) {
      processes.push(fetchPostAndReportByTag(store, {
        tagId: get(route, 'params.tagId'),
      }))
    }
    return processes.length > 0 ? Promise.all(processes) : Promise.resolve()
  },
  metaInfo () {
    switch (this.route) {
      case 'series':
        if (this.$route.params.subItem) {
          debug(truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100))
          debug(truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100))
          return {
            title: get(this.postSingle, 'title'),
            ogTitle: get(this.postSingle, 'title'),
            description: truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100),
            metaUrl: this.$route.path,
            metaImage: get(this.postSingle, 'ogImage'),              
          }
        } else {
          return {
            title: get(this.projectSingle, 'title'),
            ogTitle: get(this.projectSingle, 'ogTitle') || get(this.projectSingle, 'title'),
            description: get(this.postSingle, 'ogDescription') || get(this.projectSingle, 'description'),
            metaUrl: this.$route.path,
            metaImage: get(this.projectSingle, 'ogImage') || get(this.projectSingle, 'heroImage'),            
          }
        }
      case 'tag':
       return {
        description: this.$i18n ? this.$t('OG.DESCRIPTION') : '',
        ogTitle: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
        title: this.$i18n ? get(this.tagsForNav, '0.text', this.$t('OG.TITLE')) : '',
        metaUrl: this.$route.path,         
       }
    }
  },  
  props: {
    hasLeading: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CommentContainer,
    Donate,
    Leading,
    PostList,
    TagNav,
    TagNavAside,
  },
  watch: {
    isSeriesDonate () {
      debug('Mutation detected: isSeriesDonate', this.isSeriesDonate)
      this.donateCheck()
    },
    postSingle () {
      this.$forceUpdate()
    },
    projectSingle () {
      this.donateCheck()
    },
    projectSingleTagIds (ids) {
      fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
    },
  },
  data () {
    return {
      ASIDE_TYPE,
      isReachBottom: false,
    }
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
    asideType () {
      return this.route === 'series' ? ASIDE_TYPE.COMMENTS : ASIDE_TYPE.TAGS
    },
    commentAsset () {
      let asset
      switch (this.route) {
        case 'series':
          asset = `${get(this.$store, 'state.setting.HOST')}/series/${get(this.$route, 'params.slug')}`
      }
      return asset
    },
    isClientSide,
    isSeriesDonate () {
      return this.route === 'series' && get(this.$route, 'params.subItem') === 'donate'
    },
    me () {
      return get(this.$store, 'state.profile', {})
    },
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
    },  
    postSingle () {
      switch (this.route) {
        case 'series':
          return get(this.$store, 'state.memoSingle', {})
        default:
          return
      }
    },      
    projectSingle () {
      return get(this.$store, 'state.publicProjectSingle')
    },
    projectSingleTagIds () {
      const tags = this.projectSingle.tags || []
      return tags.map(tag => tag.id)
    },
    tagsForNav () {
      switch (this.route) {
        case 'series':
          return this.projectSingle.tags || []
        case 'tag':
          return get(this.$store, 'state.itemsByTag.items.0.tags', []).filter(tag => tag.id === Number(this.$route.params.tagId))
        default:
          return []
      }
    },
  },
  methods: {
    get,
    fetchPublicMemos,
    fetchReportsList,
    fetchPostAndReportByTag,
    donateCheck () {
      this.isSeriesDonate && this.projectSingle && switchOn(this.$store, this.projectSingle)
    },
  },
  beforeMount () {
    getUserFollowing(this.$store, { resource: 'post', })
    getUserFollowing(this.$store, { resource: 'memo', })
    getUserFollowing(this.$store, { resource: 'report', })
    getUserFollowing(this.$store, { resource: 'tag', })
    getUserFollowing(this.$store, { resource: 'project', })
    debug('isSeriesDonate', this.isSeriesDonate)
  },
  mounted () {
    this.donateCheck()
  },
}
</script>
<style lang="stylus" scoped>
.public-page
  width 100%
  position static
  padding-left 20px
  &__container
    display flex
  &__main
    width 650px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
  &__aside
    margin-left 40px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    flex 1
    &-container
      width 100%
      background-color #fff
      padding 10px 15px
      margin-bottom 20px
    &.tags
      // width 250px
      height calc(100% - 40px)
      position absolute
      right 0
      top 0
      padding-top 25px

  &__main
    &-container
      width 650px
  &__tag-nav
    margin-bottom 20px
    >>> .tag
      background-color #fff

.aside-container
  position sticky
  top 65px
  background-color transparent
  &__tag-nav-aside
    height calc(100vh - 65px)
    padding 5.5px 0 28px 20px
    overflow-y scroll
    &::-webkit-scrollbar
      display none
      background-color transparent
    &::-webkit-scrollbar-track
      background-color transparent
    &::-webkit-scrollbar-thumb
      background-color transparent
</style>