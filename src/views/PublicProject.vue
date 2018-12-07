<template>
  <PublicPageWithAside class="public-page">
    <Leading>
      <TagNav slot="tagNav" class="public-page__tag-nav"
        v-if="tagsForNav && tagsForNav.length > 0"
        :tags="tagsForNav" />
    </Leading>
    <div class="public-page__container">
      <div class="public-page__main">
        <PostList
          :fetchMemos="fetchMemos"
          :fetchMemoSingle="fetchMemoSingle"
          :fetchPublicMemos="fetchPublicMemos"
          :fetchReportsList="fetchReportsList"
          :fetchProjectContents="fetchProjectContents"
          :fetchPublicProjectContents="fetchPublicProjectContents"
        />
      </div>
      <div class="public-page__aside comments">
        <div class="public-page__aside-container aside-container">
          <CommentContainer :asset="commentAsset" :assetId="assetId" :isPublic="!get(me, 'id')"></CommentContainer>
        </div>
      </div>
    </div>  
    <Donate></Donate>
  </PublicPageWithAside>
</template>
<script>
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import Donate from 'src/components/point/Donate.vue'
import Leading from 'src/components/leading/Leading.vue'
import PostList from 'src/components/post/PostList.vue'
import PublicPageWithAside from 'src/components/layout/PublicPageWithAside.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate-html'
import { SITE_FULL, } from 'src/constants'
import { MEMO_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, PROJECT_STATUS, REPORT_PUBLISH_STATUS, } from 'api/config'
import { isClientSide, } from 'src/util/comm'
import { get, } from 'lodash'

const MAXRESULT_POSTS = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-memo_order,-updated_at'

const debug = require('debug')('CLIENT:PublicProject')

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

const fetchMemos = (store, {
  mode = 'set',
  proj_ids = [],
  page = DEFAULT_PAGE,
}) => {
  return store.dispatch('GET_MEMOS', {
    params: {
      project_id: proj_ids,
      max_result: MAXRESULT_POSTS,
      page,
      sort: DEFAULT_SORT,
      where: {
        memo_publish_status: [ 2, ],
      },
    },
    mode,
  })
}

const fetchMemoSingle = (store, memoId) => {
  return store.dispatch('GET_MEMO', {
    params: {
      memoId,
    },
  })
}

const fetchPublicMemoSingle = (store, memoId) => {
  return store.dispatch('GET_PUBLIC_MEMO', {
    params: {
      memoId,
      where: { 
        memo_publish_status: MEMO_PUBLISH_STATUS.PUBLISHED, 
        project_publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED, 
      }, 
    },
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

const fetchProjectContents = (store, {
  mode = 'set',
  project_id,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
} = {}) => {
  return store.dispatch('GET_PROJECT_CONTENTS', {
    mode,
    project_id,
    params: {
      max_result,
      page,
    },
  })
}

const fetchPublicProjectContents = (store, {
  mode = 'set',
  project_id,
  max_result = MAXRESULT_POSTS,
  page = DEFAULT_PAGE,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECT_CONTENTS', {
    mode,
    project_id,
    params: {
      max_result,
      page,
    },
  })
}

const fetchEmotion = (store, params) => {
  return store.dispatch('FETCH_EMOTION_BY_RESOURCE', params)
}

const switchOn = (store, item) => store.dispatch('SWITCH_ON_DONATE_PANEL', { item, })
const switchOff = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})
const loadTappaySDK = store => store.dispatch('LOAD_TAPPAY_SDK')
 
export default {
  name: 'PublicProject',
  asyncData ({ store, route, }) {
    const processes = []
    if (get(route, 'params.subItem') && get(route, 'params.subItem') !== 'donate') {
      processes.push(fetchPublicMemoSingle(store, get(route, 'params.subItem')).then(memo => {
        const memoIds = [ get(memo, 'id'), ]
        fetchEmotion(store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'like', })
        fetchEmotion(store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'dislike', })
      }))
    }
    if (get(route, 'params.slug')) {
      processes.push(fetchProjectSingle(store, get(route, 'params.slug')).then(proj => {
        const projId = get(proj, 'id')
        return fetchPublicProjectContents(store, { project_id: projId, })
      }))
    }
    return processes.length > 0 ? Promise.all(processes) : Promise.resolve()
  },
  metaInfo () {
    if (this.$route.params.subItem) {
      const isPaid = get(this.postSingle, 'project.paid')
      const isProjectDone = get(this.postSingle, 'project.status') === PROJECT_STATUS.DONE
      const desc = isPaid || isProjectDone
        ? truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100)
        : truncate(sanitizeHtml(get(this.postSingle, 'content', ''), { allowedTags: [], }), 100) + '...'
      return {
        title: get(this.postSingle, 'title'),
        ogTitle: get(this.postSingle, 'title'),
        description: desc,
        metaUrl: this.$route.path,
        metaImage: get(this.projectSingle, 'heroImage') || `${SITE_FULL}/public/og-image-memo.jpg`,
        isTappayNeeded: this.isTappayRequired,
      }
    } else {
      return {
        title: get(this.projectSingle, 'title'),
        ogTitle: get(this.projectSingle, 'ogTitle') || get(this.projectSingle, 'title'),
        description: get(this.projectSingle, 'ogDescription') || get(this.projectSingle, 'description'),
        metaUrl: this.$route.path,
        metaImage: get(this.projectSingle, 'ogImage') || get(this.projectSingle, 'heroImage'),
        isTappayNeeded: this.isTappayRequired,        
      }
    }    
  },  
  components: {
    CommentContainer,
    Donate,
    Leading,
    PostList,
    PublicPageWithAside,
    TagNav,
  },
  watch: {
    isSeriesDonate () {
      this.donateCheck()
    },
    isTappayRequired () {
      debug('Mutation detected: isTappayRequired', this.isTappayRequired)
      this.$forceUpdate()
    }, 
    me () {
      this.runJobs()
    },    
    postSingle () {
      this.$forceUpdate()
    },
    projectSingle () {
      debug('Mutation detected: projectSingle')
    },
    projectSingleTagIds (ids) {
      fetchFollowing(this.$store, { resource: 'tag', ids: ids, })
    },
    '$route.params.subItem' () {
      debug('Mutation detected: $route.params.subItem')
      this.isSeriesDonate = get(this.$route, 'params.subItem') === 'donate'
    },
  },
  computed: {
    assetId () {
      return get(this.projectSingle, 'id') || 0      
    },
    commentAsset () {
      return `${get(this.$store, 'state.setting.HOST')}/series/${get(this.$route, 'params.slug')}`
    },
    isClientSide,
    isTappayRequired () {
      return get(this.$store, 'state.isTappayRequired', false)
    },    
    me () {
      return get(this.$store, 'state.profile', {})
    }, 
    postSingle () {
      return get(this.$store, 'state.publicMemoSingle', {})
    },      
    projectSingle () {
      return get(this.$store, 'state.publicProjectSingle')
    },
    projectSingleTagIds () {
      const tags = this.projectSingle.tags || []
      return tags.map(tag => tag.id)
    },
    tagsForNav () {
      return this.projectSingle.tags || []
    },
  },
  data () {
    return {
      isSeriesDonate: false,
    }
  },
  methods: {
    get,
    fetchMemos,
    fetchPublicMemos,
    fetchMemoSingle,
    fetchReportsList,
    fetchProjectContents,
    fetchPublicProjectContents,
    donateCheck () {
      if (this.isSeriesDonate) {
        this.projectSingle && switchOn(this.$store, this.projectSingle)
      } else {
        switchOff(this.$store)
      }
    },
    runJobs () {
      getUserFollowing(this.$store, { resource: 'post', })
      getUserFollowing(this.$store, { resource: 'memo', })
      getUserFollowing(this.$store, { resource: 'report', })
      getUserFollowing(this.$store, { resource: 'tag', })
      getUserFollowing(this.$store, { resource: 'project', })
      loadTappaySDK(this.$store)
      if (get(this.me, 'id')) {
        fetchProjectContents(this.$store, { project_id: get(this.projectSingle, 'id', 0), })

        this.$route.params.subItem &&
        get(this.$route, 'params.subItem') !== 'donate' &&
        fetchMemoSingle(this.$store, this.$route.params.subItem)
        .then(memo => {
          const memoIds = [ get(memo, 'id'), ]
          fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'like', })
          fetchEmotion(this.$store, { mode: 'update', resource: 'memo', ids: memoIds, emotion: 'dislike', })
        })
      }
    },
  },
  beforeMount () {
    this.runJobs()
    this.isSeriesDonate = get(this.$route, 'params.subItem') === 'donate'
    debug('isSeriesDonate', this.isSeriesDonate)
  },
  beforeRouteUpdate (to, from, next) {
    this.isSeriesDonate = get(to, 'params.subItem') === 'donate'
    next()
  },
  mounted () {
    this.donateCheck()
  },
}
</script>
