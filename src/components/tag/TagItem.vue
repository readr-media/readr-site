<template>
  <div class="tag-item">
    <div class="tag-item__tag tag">
      <div class="tag__header">
        <span class="tag__text" v-text="tag.text"></span>
        <span v-if="isLoggedIn" class="tag__action">
          <img :src="isFollow(tag.id) ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" @click="toogleFollow(tag.id)">
        </span>
      </div>
      <!-- TODO: add related projects while data available -->
      <ul v-if="showRelatedsList && isTagRelatedProjectsExist" class="tag__relateds-list">
        <TagItemRelatedsListItem
          v-for="(projects, i) in tag.relatedProjects"
          :key="i"
          class="tag__relateds-list-item"
        />
      </ul>
    </div>
    <!-- TODO: add trending-rank -->
    <p v-if="showTrendingRank" class="tag-item__trending-rank"></p>
  </div>
</template>

<script>
import { get, } from 'lodash'
import TagItemRelatedsListItem from './TagItemRelatedsListItem.vue'

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
  name: 'TagItem',
  props: {
    tag: {
      type: Object,
      required: true,
    },
    showTrendingRank: {
      type: Boolean,
      default: false,
    },
    showRelatedsList: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TagItemRelatedsListItem,
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isTagRelatedProjectsExist () {
      return get(this.tag, 'relatedProjects') !== null
    },
  },
  methods: {
    isFollow (id) {
      const data = this.$store.state.followingByResource.tag.find(tag => tag.resourceID === id)
      const followers = data ? data.followers : []
      return followers.find(memberId => memberId === this.$store.state.profile.id )
    },
    toogleFollow (id) {
      if (this.isFollow(id)) {
        publishAction(this.$store, {
          action: 'unfollow',
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: id,
        })
        updateStoreFollowingByResource(this.$store, {
          action: 'unfollow',
          resource: 'tag',
          resourceId: id,
          userId: this.$store.state.profile.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: id,
        })
        updateStoreFollowingByResource(this.$store, {
          action: 'follow',
          resource: 'tag',
          resourceId: id,
          userId: this.$store.state.profile.id,
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.tag-item
  display inline-flex
  align-items flex-start
  &__tag
    // font-size .9375rem
    line-height 1.5rem
    // font-weight 700
    border 1px solid #11b8c9
    border-radius 12px
    user-select none
    background-color white
    flex 1 1 auto
  &__trending-rank
    width 22.5px
    min-width 22.5px
    height 24px
    line-height 24px
    font-size 9px
    text-align center
    margin 0 0 0 6px

.tag
  &__header
    padding 0 8px 0 13.5px
    display flex
    justify-content space-between
    align-items center
  &__text
    font-size 12px
    font-weight 400
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  &__action
    margin-left 5px
    > img
      position relative
      top 2px
      width 20px
      height 15px
      padding-left 5px
      border-left 1px solid #d3d3d3
      cursor pointer
  &__relateds-list
    list-style none
    margin 0
    padding 9px 8px 9px 13.5px
    border-top 1px solid #11b8c9
    position relative
    &:before
      content ''
      position absolute
      top 0
      left 30px
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 4px 0 4px;
      border-color: #11b8c9 transparent transparent transparent;
    &:after
      content ''
      position absolute
      top -1px
      left 30.5px
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 9px 3px 0 3px;
      border-color: white transparent transparent transparent;
  &__relateds-list-item
    & + &
      border-top 1px solid #d3d3d3
</style>


