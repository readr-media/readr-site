<template>
  <div class="wrapper">
    <slot :postInstance="postInstance"></slot>
    <AppArticleNav
      :showFollow="false"
      :postId="post.id"
      :postRefId="get(post, 'project.id')"
      :projectInfo="get(post, 'project')"
      :resource="get(postInstance, [ 'processed', 'resource' ])"
      :resourceType="resourceType"
      :slug="get(postInstance, [ 'processed', 'resource' ]) === 'report'? post.slug : ''"
      :link="post.link"
      :tags="post.tags"
      :commentCount="commentCount"
      :commentsLatest="post.comments"
      :isNotLightbox="true"
      :shouldShowComment="true"
    >
      <AppShareButton v-if="enableShareFeature" slot="share" :shareUrl="shareUrl" class="wrapper__share" />
      <TagNav
        v-if="post.tags && post.tags.length > 0"
        slot="tagNav"
        :tags="post.tags"
        class="wrapper__tag-nav"
      />
    </AppArticleNav>
  </div>
</template>

<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import AppShareButton from 'src/components/AppShareButton.vue'
import TagNav from 'src/components/tag/TagNav.vue'
import { get, } from 'lodash'
import { getPostFullUrl, } from 'src/util/post/index'
import { createPost, } from 'src/util/post'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    AppArticleNav,
    AppShareButton,
    TagNav,
  },
  computed: {
    postInstance () {
      return createPost(this.post)
    },
    resourceType () {
      return get(this.postInstance, [ 'processed', 'resourceType', ], '')
    },
    commentCount () {
      return get(this.postInstance, [ 'processed', 'commentCount', ], 0)
    },
    enableShareFeature () {
      return this.$route.path.split('/')[1] === 'profile'
    },
    shareUrl () {
      return getPostFullUrl(this.post)
    },
  },
  methods: {
    get,
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  &__share
    margin 0 0 0 auto
  &__tag-nav
    margin-top 20px
    padding-top 10px
    border-top 1px solid #d3d3d3
</style>


