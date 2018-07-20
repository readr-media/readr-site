<template>
  <div class="article-nav">
    <nav class="article-nav__nav-btns">
      <span class="comment-icon" @click="renderComment()">
        <img class="comment-icon__thumbnail" :src="commentIcon" alt="comment">
        <CommentCount class="comment-icon__count" :commentAmount="commentCount" :postId="postId" :type="'publicPostsHot'"></CommentCount>
      </span>
      <span v-if="isLoggedIn" class="follow-icon" @click="toogleFollow($event)">
        <img class="follow-icon__thumbnail" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow">
        <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
      </span>
      <template v-if="articleType !== 'project'">
        <span class="like-icon" @click="toggleEmotion('like')">
          <img :src="isLike ? '/public/icons/like-blue.png' : '/public/icons/like-line-blue.png'" alt="like">
          <span v-text="emotionLikeCount"></span>
        </span>
        <span class="like-icon dislike" @click="toggleEmotion('dislike')">
          <img :src="isDislike ? '/public/icons/like-blue.png' : '/public/icons/like-line-blue.png'" alt="unlike">
          <span v-text="emotionDislikeCount"></span>
        </span>
      </template>
    </nav>
    <CommentContainer v-if="showComment" :asset="asset" :assetId="postId" :assetRefId="postRefId"></CommentContainer>
  </div>
</template>

<script>
import { find, get, } from 'lodash'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import CommentCount from 'src/components/comment/CommentCount.vue'

// const debug = require('debug')('CLIENT:AppAritcleNav')

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })
const updateEmotion = (store, { resource = 'post', action = 'insert', emotion = 'like', object, }) => {
  return store.dispatch('UPDATE_EMOTION', {
    customAttrs: {
      type: 'emotion',
      action: action,
    },
    dataBuffer: {
      resource: resource,
      emotion: emotion,
      subject: store.state.profile.id,
      object: object,
    },
  })
}
const updateStoreFollowingByResource = (store, { action, resource, resourceId, userId, }) => {
  return store.dispatch('UPDATE_FOLLOWING_BY_RESOURCE', {
    params: {
      action: action,
      resource: resource,
      resourceId: resourceId,
      userId: userId,
    },
  })
}

export default {
  name: 'AppAritcleNav',
  components: {
    CommentContainer,
    CommentCount,
  },
  computed: {
    asset () {
      switch (this.articleType) {
        case 'memo':
          return `${get(this.$store, 'state.setting.HOST')}/series/${get(this.$route, 'params.slug')}/${this.postId}`
        case 'project':
          return `${get(this.$store, 'state.setting.HOST')}/series/${this.postId}`
        case 'report':
          return `${get(this.$store, 'state.setting.HOST')}/project/${this.slug}`
        default: 
          return `${get(this.$store, 'state.setting.HOST')}/${this.articleType}/${this.postId}`

      }
    },
    emotionLikeCount () {
      return get(find(get(this.$store, [ 'state', 'emotionByResource', this.articleType, 'like', ], []), { resourceID: this.postId, }), 'count', 0 ) || 0
    },
    emotionDislikeCount () {
      return get(find(get(this.$store, [ 'state', 'emotionByResource', this.articleType, 'dislike', ], []), { resourceID: this.postId, }), 'count', 0 ) || 0
    },
    isFollow () {
      return this.$store.state.isLoggedIn && this.postFollowers && this.postFollowers.indexOf(this.$store.state.profile.id) !== -1
    },
    isLike () {
      const ids = get(find(get(this.$store, [ 'state', 'emotionByResource', this.articleType, 'like', ], []), { resourceID: this.postId, }), 'followers', []) || [] 
      return this.$store.state.isLoggedIn && ids.indexOf(this.$store.state.profile.id) !== -1
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isDislike () {
      const ids = get(find(get(this.$store, [ 'state', 'emotionByResource', this.articleType, 'dislike', ], []), { resourceID: this.postId, }), 'followers', []) || [] 
      return this.$store.state.isLoggedIn && ids.indexOf(this.$store.state.profile.id) !== -1
    },
    postFollowers () {
      if (this.$store.state.isLoggedIn) {
        const postFollowersData = find(this.$store.state.followingByResource[this.articleType], { resourceID: this.postId, })
        return postFollowersData ? postFollowersData.followers : []
      } else {
        return []
      }
    },
    commentIcon () {
      return this.toogleComment ? '/public/icons/comment-blue.png' : '/public/icons/comment-quote.png'
    },
  },
  data () {
    return {
      showComment: false,
    }
  },
  methods: {
    renderComment (event) {
      if (event) event.preventDefault()
      if (this.inLightbox) {
        this.$emit('toogleComment')
      } else if (this.toogleComment && !this.inLightbox) {
        this.showComment = true
      }
    },
    toogleFollow (event) {
      if (event) event.preventDefault()
      if (!this.$store.state.isLoggedIn) {
        alert('please login first')
      } else {
        if (!this.isFollow) {
          publishAction(this.$store, {
            action: 'follow',
            resource: this.articleType,
            subject: this.$store.state.profile.id,
            object: this.postId,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'follow',
            resource: this.articleType,
            resourceId: this.postId,
            userId: this.$store.state.profile.id,
          })
        } else {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: this.articleType,
            subject: this.$store.state.profile.id,
            object: this.postId,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'unfollow',
            resource: this.articleType,
            resourceId: this.postId,
            userId: this.$store.state.profile.id,
          })
        }
      }
    },
    toggleEmotion (emotion) {
      if (this.$store.state.isLoggedIn) {
        const emotionVal = emotion === 'like' ? this.isLike : this.isDislike
        const oppositeVal = emotion === 'like' ? this.isDislike : this.isLike
        if (emotionVal) {
          updateEmotion(this.$store, { resource: this.articleType, action:'delete', emotion: emotion, object: this.postId, })
        } else if (oppositeVal) {
          updateEmotion(this.$store, { resource: this.articleType, action:'update', emotion: emotion, object: this.postId, })
        } else {
          updateEmotion(this.$store, { resource: this.articleType, action:'insert', emotion: emotion, object: this.postId, })
        }
      }
    },
  },
  mounted () {},
  props: {
    articleType: {
      type: String,
      default: 'post',
    },
    postId: {
      // type: [ String, Number ],
      required: true,
    },
    postRefId: {
      // type: [ String, Number ],
    },
    commentCount: {
      type: Number,
      required: true,
    },
    slug: {
      // For report use.
      type: String,
    },
    toogleComment: {
      type: Boolean,
      default: true,
    },
    inLightbox: {
      type: Boolean,
      default: false,
    },
  },
}
</script>


<style lang="stylus" scoped>
.article-nav
  display flex
  flex-direction column
  &__nav-btns
    height 25px
    margin-top auto // for automatically placing nav to the botom of the container

$icon-size
  width 25px
  height 25px
.comment-icon
  cursor pointer
  &__thumbnail
    @extends $icon-size
  &__count
    position relative
    right 5px
    font-size 14px
    -webkit-font-smoothing antialiased
    -moz-font-smoothing antialiased
    color #11b8c9
    font-weight 600
.follow-icon
  cursor pointer
  &__thumbnail
    @extends $icon-size
    margin-left 4.5px
    cursor pointer
  &__hint
    position relative
    // right 5px
    bottom 2px
    font-size 12px
    -webkit-font-smoothing antialiased
    -moz-font-smoothing antialiased
    color #11b8c9
    font-weight 600
.like-icon
  margin-left 10px
  cursor pointer
  &.dislike
    img
      position relative
      top 5px
      transform rotate3d(1, 0, 0, 180deg)
  img
    @extends $icon-size
  span
    margin-left 3px
    color #11b8c9
    font-size 14px
    font-weight 600
    user-select none
.donate-icon
  width 20px
  height 25px
  margin-left 16.2px
  cursor pointer
</style>

