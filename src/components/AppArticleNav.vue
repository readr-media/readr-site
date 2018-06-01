<template>
  <div class="article-nav">
    <nav class="article-nav__nav-btns">
      <span class="comment-icon" @click="renderComment()">
        <img class="comment-icon__thumbnail" src="/public/icons/comment-blue.png" alt="comment">
        <CommentCount class="comment-icon__count" :commentAmount="commentCount" :postId="postId" :type="'publicPostsHot'"></CommentCount>
      </span>
      <span v-if="isLoggedIn" class="follow-icon" @click="toogleFollow($event)">
        <img class="follow-icon__thumbnail" :src="isFollow ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="follow">
        <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
      </span>
      <span v-else></span>
    </nav>
    <CommentContainer v-if="showComment" :asset="asset"></CommentContainer>
  </div>
</template>

<script>
import { find, get, } from 'lodash'
import CommentContainer from 'src/components/comment/CommentContainer.vue'
import CommentCount from 'src/components/comment/CommentCount.vue'

// const debug = require('debug')('CLIENT:AppAritcleNav')

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })
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
      return `${get(this.$store, 'state.setting.HOST')}/${this.articleType}/${this.postId}`
    },
    isFollow () {
      return this.$store.state.isLoggedIn && this.postFollowers.indexOf(this.$store.state.profile.id) !== -1
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    postFollowers () {
      if (this.$store.state.isLoggedIn) {
        const postFollowersData = find(this.$store.state.followingByResource[this.articleType], { resourceid: this.postId, })
        return postFollowersData ? postFollowersData.follower : []
      } else {
        return []
      }
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
      this.showComment = true
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
    commentCount: {
      type: Number,
      required: true,
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
.donate-icon
  width 20px
  height 25px
  margin-left 16.2px
  cursor pointer
</style>

