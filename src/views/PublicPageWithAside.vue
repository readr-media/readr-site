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
        <PostList></PostList>
      </div>
      <div class="public-page__aside" :class="asideType.toLowerCase()">
        <div class="public-page__aside-container aside-container">
          <CommentContainer :asset="commentAsset" :assetId="assetId" v-if="asideType === ASIDE_TYPE.COMMENTS"></CommentContainer>
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
import { isClientSide, } from 'src/util/comm'
import { get, } from 'lodash'

const ASIDE_TYPE = {
  COMMENTS: 'COMMENTS',
  TAGS: 'TAGS',
}

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

const switchOn = (store, item) => store.dispatch('SWITCH_ON_DONATE_PANEL', { item, })
 
export default {
  name: 'PublicPageWithAside',
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
    route () {
      return this.$route.fullPath.split('/')[ 1 ]
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