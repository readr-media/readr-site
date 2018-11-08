<template>
  <div class="post-item" :id="`post-item-${post.id}`" :key="`post-item-${post.id}`">
    <div class="post">
      <figure class="post__author author">
        <router-link :to="`/profile/${get(post, 'author.id')}`">
          <div class="author__thumbnail" >
            <img :src="authorThumbnailImg" alt="" v-if="isClientSide">
          </div>
        </router-link>
        <figcaption class="author__meta">
          <div class="author__date">
            <AppDateCreatedUpdated
              v-if="isReportOrMemo"
              class="author__date-report-memo"
              :createdAt="post.createdAt"
              :updatedAt="post.updatedAt"
            />
            <span v-else v-text="dateDiffFromNow"></span>
          </div>
          <router-link :to="`/profile/${get(post, 'author.id')}`">
            <div class="author__nickname">
              <span v-text="authorNickname"></span>
            </div>
          </router-link>
        </figcaption>
      </figure>
      <PostShareNav v-if="isClientSide" class="post__share-nav" :post="post"/>
    </div>  
    <div class="post__content" :style="{ width: `${width}px`, }" :key="`post-content-${post.id}`" :id="`post-content-${post.id}`">
      <PostContent modifier="main" :post="post"></PostContent>
    </div>
  </div>
</template>
<script>
import AppShareButton from 'src/components/AppShareButton.vue'
import AppDateCreatedUpdated from 'src/components/AppDateCreatedUpdated.vue'
import PostContent from 'src/components/post/PostContent.vue'
import PostShareNav from 'src/components/post/PostShareNav.vue'
import { dateDiffFromNow, isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'
import { getPostType, } from 'src/util/post/index'
import { get, } from 'lodash'
import { isAnnouncementAccountId, } from 'src/util/post/index'

export default {
  name: 'PostItem',
  components: {
    AppShareButton,
    AppDateCreatedUpdated,
    PostContent,
    PostShareNav,
  },
  computed: {
    isClientSide,
    dateDiffFromNow () {
      return dateDiffFromNow(this.post.publishedAt)
    },
    isReportOrMemo () {
      return getPostType(this.post) === 'report' || getPostType(this.post) === 'memo'
    },
    isAnnouncementAccountId () {
      return isAnnouncementAccountId(get(this.post, 'author.id'))
    },
    authorNickname () {
      return this.isAnnouncementAccountId ? get(this.memberDataAnnouncement, 'nickname') : getArticleAuthorNickname(this.post)
    },
    authorThumbnailImg () {
      return this.isAnnouncementAccountId ? get(this.memberDataAnnouncement, 'profileImage') : getArticleAuthorThumbnailImg(this.post)
    },
    memberDataAnnouncement () {
      return get(this.$store.state, 'publicMemberAnnouncement', {})
    },
  },  
  methods: {
    get,
  },
  mounted () {},
  props: {
    post: {
      type: Object,
      default: {
        author: {
          nickname: '',
        },
        title: '',
        content: '',
      },
    },
    width: {},
  },
}
</script>
<style lang="stylus" scoped>
.post-item
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  position relative
  & + .post-item
    margin-top 10px
  .share
    width 25px
    height 25px
    position absolute
    top 21px
    right 36px    
  .post
    width 100%
    height 60px
    background-color #d3d3d3
    display flex
    justify-content space-between
    align-items center
    &__author
      margin 0
      display flex
      flex-direction row
      justify-content flex-start
      align-items center
      position relative
    &__share-nav
      padding 0 10px 0 0
    .author
      &__thumbnail
        width 60px
        height 60px
        img
          width 100%
          height 100%
          object-fit cover
      &__meta
        margin-left 22.5px
      &__nickname, &__date
        margin 5px 0
      &__date
        font-size 0.875rem
        font-weight 500
      &__date-report-memo
        & >>> .date__field + .date__field
          border-left 1px solid gray
        & >>> .field--gray
          color gray
      &__nickname
        font-size 1.125rem
        color #000
      &:after
        content ''
        position absolute
        left calc(60px - 12px)
        bottom 0
        width 0
        height 0
        border-style solid
        border-width 0 12px 20px 12px
        border-color transparent transparent #ffffff transparent
    &__content
      width 540px
      height inherit
      // box-shadow 0px 0px 3px 2px rgba(211, 211, 211, 1)
      padding 17px 20px
      background-color white
      display flex
      flex-direction column
</style>