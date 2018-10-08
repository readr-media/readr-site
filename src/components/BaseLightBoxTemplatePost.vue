<template>
  <div>
    <article class="baselightbox-post__article">
      <img class="baselightbox-post__author-thumbnail" :src="authorThumbnailImg" v-if="isClientSide">
      <section class="article-content">
        <h2 class="article-content__date" v-text="!isPostEmpty ? updatedAtYYYYMMDD(post.updatedAt) : ''"></h2>
        <h2 class="article-content__author-nickname" v-text="authorNickname"></h2>
        <h1 class="article-content__title" v-text="!isPostEmpty ? post.title : ''"></h1>
        <div class="article-content__paragraph-container" v-html="!isPostEmpty ? post.content : ''"></div>
        <a class="article-content__source-link" :href="post.link" target="_blank" v-text="post.linkTitle"></a>
        <AppArticleNav
          :showFollow="false"
          :postId="post.id"
          :postRefId="assetRefId"
          :resource="post.flag"
          :resourceType="'review'"
          :commentCount="commentCount"
          :inLightbox="true" @toogleComment="toogleComment">
          <TagNav
            v-if="post.tags && post.tags.length > 0"
            slot="tagNav"
            :tags="post.tags"
            class="baselightbox-post__tags" />
        </AppArticleNav>
      </section>
      <PostShareNav class="baselightbox-post__share-nav" :shareUrl="shareUrl"/>
    </article>
    <CommentContainer
      v-if="shouldRenderComment"
      v-show="showComment"
      class="baselightbox-post__comment"
      :asset="asset"
      :assetId="post.id"
      :assetRefId="assetRefId"
      :isPublic="!get(me, 'id')"
    />  
  </div>
</template>
<script>
  import AppArticleNav from 'src/components/AppArticleNav.vue'
  import CommentContainer from 'src/components/comment/CommentContainer.vue'
  import TagNav from 'src/components/tag/TagNav.vue'
  import PostShareNav from 'src/components/post/PostShareNav.vue'
  import { get, } from 'lodash'
  import { isClientSide, updatedAtYYYYMMDD, getPostFullUrl, } from 'src/util/comm'
  const debug = require('debug')('CLIENT:BaseLightBoxTemplatePost')
  export default {
    name: 'BaseLightBoxTemplatePost',
    components: {
      AppArticleNav,
      CommentContainer,
      TagNav,
      PostShareNav,
    },
    computed: {
      asset () {
        debug('this.asset', `${get(this.$store, 'state.setting.HOST')}/${get(this.post, 'flag') || 'post'}/${this.post.id}`)
        return `${get(this.$store, 'state.setting.HOST')}/${get(this.post, 'flag') === 'memo' ? `series/${get(this.$route, 'params.slug')}` : 'post'}/${this.post.id}`
      },      
      isClientSide,
      me () {
        return get(this.$store, 'state.profile', {})
      },
      shouldRenderComment () {
        return this.post.id ? true : false
      },
      shareUrl () {
        return getPostFullUrl(this.post)
      },
    },
    data () {
      return {
        showComment: true,
      }
    },
    methods: {
      get,
      updatedAtYYYYMMDD,
      toogleComment () {
        this.showComment = !this.showComment
      },
    },
    mounted () {},
    props: {
      assetRefId: {},
      authorThumbnailImg: String,
      authorNickname: String,
      commentCount: Number,
      isPostEmpty: Boolean,
      post: Object,
    },
  }
</script>

<style lang="stylus" scoped>
.baselightbox-post
  &__article
    position relative
  &__share-nav
    position absolute
    top 0
    right 0
</style>