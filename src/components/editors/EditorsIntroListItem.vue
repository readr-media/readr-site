<template>
  <li :class="isStyleModifierLarge ? 'editors-intro-list-item-large' : 'editors-intro-list-item'">
    <template v-if="isStyleModifierLarge">
      <!-- editor's thumbnail -->
      <router-link :to="`/profile/${editor.id}`">
        <img class="editors-intro-list-item-large__thumbnail" :src="editorThumbnailImg" alt="editors-intro-list-item-large__thumbnail" v-if="isClientSide">
      </router-link>
      <!-- editor's nickname, follow icon and description -->
      <div class="editors-info">
        <div class="editors-info__nickname-follow-container">
          <router-link :to="`/profile/${editor.id}`" class="editors-info__nickname" v-text="editorNickname"></router-link>
          <span class="follow-icon" v-if="editorIsNotCurrentUser" @click="toogleFollow">
            <img class="follow-icon__thumbnail" :src="editorHasBeenFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'">
            <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
          </span>
        </div>
        <p class="editors-info__description" v-text="editorDescritpion"></p>
      </div>
    </template>
    <template v-else>
      <figure class="editors-intro-list-item__profile">
        <!-- editor's thumbnail -->
        <router-link :to="`/profile/${editor.id}`">
          <img class="editors-intro-list-item__thumbnail" :src="editorThumbnailImg" alt="" v-if="isClientSide">
        </router-link>
        <!-- editor's nickname and follow icon -->
        <figcaption class="editors-intro-list-item__nickname-follow-container">
          <router-link :to="`/profile/${editor.id}`" class="editors-intro-list-item__nickname" v-text="editorNickname"></router-link>
          <span class="follow-icon" v-if="editorIsNotCurrentUser" @click="toogleFollow">
            <img class="follow-icon__thumbnail" :src="editorHasBeenFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'">
            <span class="follow-icon__hint" v-text="$t('FOLLOWING.FOLLOW')"></span>
          </span>
        </figcaption>
      </figure>
      <!-- editor's description -->
      <p class="editors-intro-list-item__description" v-text="editorDescritpion"></p>
    </template>
  </li>
</template>

<script>
import _ from 'lodash'
import { isClientSide, getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'

const publishAction = (store, data) => {
  return store.dispatch('FOLLOW', {
    params: data,
  })
}
const updateStoreFollowingByResource = (store, { action, resource, resourceId, userId, }) => {
  store.dispatch('UPDATE_FOLLOWING_BY_RESOURCE', {
    params: {
      action: action,
      resource: resource,
      resourceId: resourceId,
      userId: userId,
    },
  })
}

export default {
  props: {
    styleModifier: {
      type: String,
    },
    editor: {
      type: Object,
      require: true,
    },
    trimDescription: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isClientSide,
    isStyleModifierLarge () {
      return this.styleModifier === 'large'
    },
    editorThumbnailImg () {
      return getArticleAuthorThumbnailImg(this.editor)
    },
    editorNickname () {
      return getArticleAuthorNickname(this.editor)
    },
    editorHasBeenFollowed () {
      return this.$store.state.isLoggedIn && this.editorFollowers.indexOf(this.$store.state.profile.id) !== -1
    },
    editorIsNotCurrentUser () {
      return !this.$store.state.isLoggedIn || this.$store.state.profile.id !== this.editor.id
    },
    editorFollowers () {
      if (this.$store.state.isLoggedIn) {
        const editorFollowersData = _.find(this.$store.state.followingByResource['member'], { resourceid: this.editor.id, })
        return editorFollowersData ? editorFollowersData.follower : []
      } else {
        return []
      }
    },
    editorDescritpion () {
      const limit = 30
      if (this.editor.description) {
        return this.trimDescription ? this.editor.description.slice(0, limit) + ' ...' : this.editor.description
      } else {
        return ''
      }
    },
  },
  methods: {
    toogleFollow () {
      if (!this.$store.state.isLoggedIn) {
        alert('please login first')
      } else {
        if (!this.editorHasBeenFollowed) {
          publishAction(this.$store, {
            action: 'follow',
            resource: 'member',
            subject: this.$store.state.profile.id,
            object: this.editor.id,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'follow',
            resource: 'member',
            resourceId: this.editor.id,
            userId: this.$store.state.profile.id,
          })
        } else {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: 'member',
            subject: this.$store.state.profile.id,
            object: this.editor.id,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'unfollow',
            resource: 'member',
            resourceId: this.editor.id,
            userId: this.$store.state.profile.id,
          })
        }
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
// standard editor's list item styles
.editors-intro-list-item
  display flex
  flex-direction column
  align-items flex-start
  & + &
    border-top solid 0.5px #979797
  &__profile
    display flex
    margin 0
  &__nickname
    text-decoration none
    color #000
  &__thumbnail
    r = 50px
    width r
    height r
    border-radius r
    object-position center center
    object-fit cover
  &__nickname-follow-container
    display flex
    align-items center
    margin-left 4px
  &__description
    font-size 15px
    font-weight 400
    text-align justify
    line-height 1.5
    margin 3px 0 0 0

// large editor's list item styles
.editors-intro-list-item-large
  display flex
  &:nth-child(2)
    border-left solid 0.5px #000000
  &__thumbnail
    r = 100px
    width r
    height r
    border-radius r
    object-position center center
    object-fit cover

.editors-info
  margin 0 0 0 15px
  &__nickname-follow-container
    display flex
    align-items center
  &__nickname
    font-size 25px
    font-weight 500
    text-align left
    color #000000
  &__description
    font-size 15px
    font-weight 400
    line-height 1.5
    text-align justify
    color #000000

// common follow icon style both used in standard list items and large list items
$icon-size
  width 25px
  height 25px
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
</style>

