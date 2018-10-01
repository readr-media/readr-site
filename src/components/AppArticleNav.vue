<template>
  <div class="article-nav">
    <nav class="article-nav__nav-btns">
      <span class="comment-icon" @click="renderComment()">
        <img class="comment-icon__thumbnail" :src="commentIcon" alt="comment">
        <CommentCount class="comment-icon__count" :commentAmount="commentCount" :postId="postId" :type="'publicPostsHot'"></CommentCount>
      </span>
      <span v-if="showFollow" class="follow-icon" @click="clickFollow($event)">
        <img class="follow-icon__thumbnail" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow">
        <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
      </span>
      <template v-if="resource !== 'project'">
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
    <slot name="tagNav"></slot>
    <CommentContainer v-if="shouldShowComment || showComment" :asset="asset" :assetId="postId" :assetRefId="postRefId" :isPublic="!get(me, 'id')"></CommentContainer>
  </div>
</template>

<script>
import { find, get, } from 'lodash'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import CommentCount from 'src/components/comment/CommentCount.vue'
import { mapState, } from 'vuex'
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
const toogleFollowingByUserStat = (store, { resource, resourceType = '', targetId, }) => {
  return store.commit('TOOGLE_FOLLOWING_BY_USER_STAT', {
    params: {
      resource,
      resourceType,
      targetId,
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
    ...mapState({
      userId: state => state.profile.id,
      postsFollowingByUser: state => get(state.followingByUserStats, [ 'post', ], {}),
      memosFollowingByUser: state => get(state.followingByUserStats, [ 'memo', ], {}),
      reportsFollowingByUser: state => get(state.followingByUserStats, [ 'report', ], {}),
    }),
    asset () {
      switch (this.resource) {
        case 'memo':
          return `${get(this.$store, 'state.setting.HOST')}/series/${get(this.$route, 'params.slug')}/${this.postId}`
        case 'project':
          return `${get(this.$store, 'state.setting.HOST')}/series/${this.postId}`
        case 'report':
          return `${get(this.$store, 'state.setting.HOST')}/project/${this.slug}`
        default: 
          return `${get(this.$store, 'state.setting.HOST')}/${this.resource}/${this.postId}`

      }
    },
    emotionLikeCount () {
      return get(find(get(this.$store, [ 'state', 'emotionByResource', this.resource, 'like', ], []), { resourceID: this.postId, }), 'count', 0 ) || 0
    },
    emotionDislikeCount () {
      return get(find(get(this.$store, [ 'state', 'emotionByResource', this.resource, 'dislike', ], []), { resourceID: this.postId, }), 'count', 0 ) || 0
    },
    dataFollowingByUser () {
      switch (this.resource) {
        case 'post':
          return this.postsFollowingByUser
        case 'memo':
          return this.memosFollowingByUser
        case 'report':
          return this.reportsFollowingByUser
        default: 
          return []
      }
    },
    isFollow () {
      return this.$store.state.isLoggedIn &&
        this.resource === 'post' ? get(this.dataFollowingByUser, [ this.resourceType, this.postId, ], false) : get(this.dataFollowingByUser, this.postId, false)
    },
    isLike () {
      const ids = get(find(get(this.$store, [ 'state', 'emotionByResource', this.resource, 'like', ], []), { resourceID: this.postId, }), 'followers', []) || [] 
      return this.$store.state.isLoggedIn && ids.indexOf(this.$store.state.profile.id) !== -1
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isDislike () {
      const ids = get(find(get(this.$store, [ 'state', 'emotionByResource', this.resource, 'dislike', ], []), { resourceID: this.postId, }), 'followers', []) || [] 
      return this.$store.state.isLoggedIn && ids.indexOf(this.$store.state.profile.id) !== -1
    },
    commentIcon () {
      return this.toogleComment ? '/public/icons/comment-blue.png' : '/public/icons/comment-quote.png'
    },
    me () {
      return get(this.$store, 'state.profile', {})
    },
  },
  data () {
    return {
      showComment: false,
    }
  },
  methods: {
    get,
    renderComment (event) {
      if (event) event.preventDefault()
      if (this.inLightbox) {
        this.$emit('toogleComment')
      } else if (this.toogleComment && !this.inLightbox) {
        this.showComment = true
      }
    },
    // TODO: Refactor following to a component like ButtonFollow.vue
    clickFollow (event) {
      this.isLoggedIn ? this.toogleFollow(event) : this.$router.push('/login')
    },
    toogleFollow (event) {
      if (event) event.preventDefault()
      if (!this.$store.state.isLoggedIn) {
        alert('please login first')
      } else {
        if (!this.isFollow) {
          publishAction(this.$store, {
            action: 'follow',
            resource: this.resource,
            subject: this.$store.state.profile.id,
            object: this.postId,
          })
        } else {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: this.resource,
            subject: this.$store.state.profile.id,
            object: this.postId,
          })
        }
        toogleFollowingByUserStat(this.$store, { resource: this.resource, resourceType: this.resourceType, targetId: this.postId, })
      }
    },
    toggleEmotion (emotion) {
      if (this.$store.state.isLoggedIn) {
        const emotionVal = emotion === 'like' ? this.isLike : this.isDislike
        const oppositeVal = emotion === 'like' ? this.isDislike : this.isLike
        if (emotionVal) {
          updateEmotion(this.$store, { resource: this.resource, action:'delete', emotion: emotion, object: this.postId, })
        } else if (oppositeVal) {
          updateEmotion(this.$store, { resource: this.resource, action:'update', emotion: emotion, object: this.postId, })
        } else {
          updateEmotion(this.$store, { resource: this.resource, action:'insert', emotion: emotion, object: this.postId, })
        }
      }
    },
  },
  mounted () {},
  props: {
    resource: {
      type: String,
      default: 'post',
    },
    resourceType: {
      type: String,
      default: '',
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
    tags: {
      default: () => [],
    },
    toogleComment: {
      type: Boolean,
      default: true,
    },
    inLightbox: {
      type: Boolean,
      default: false,
    },
    shouldShowComment: {
      type: Boolean,
      default: false,
    },
    showFollow: {
      type: Boolean,
      default: true,
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
  &__tags
    margin-top 20px
    padding-top 10px
    border-top 1px solid #d3d3d3
    span
      display inline-block
      padding 0 .5em
      margin 5px 0 0
      font-size .9375rem
      line-height 1.5rem
      font-weight 700
      border 1px solid #11b8c9
      border-radius 12px
      user-select none
      &:first-of-type
        position relative
        margin-left 20px
        &::before
          content '#'
          position absolute
          top 0
          left -20px
          color #11b8c9
          font-size 1.5rem
      & + span
        margin-left 5px
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

