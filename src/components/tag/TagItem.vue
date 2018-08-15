<template>
  <li class="tag-item">
    <div class="tag-item__tag tag">
      <div
        :class="[
          'tag__header',
          { 'tag__header--has-list': showRelatedsList && isTaggedProjectsExist },
          { 'tag__header--highlight': isMouseover}
        ]"
        @mouseover="handleMouseEvent"
        @mouseout="handleMouseEvent"
      >
        <span class="tag__text" v-text="tag.text"></span>
        <span v-if="isLoggedIn" class="tag__action tag-action">
          <img
            :src="isFollowed ? starUrlFollowed : starUrlUnFollowed"
            @click="toogleFollow"
          >
          <span
            :class="[ 'tag-action__tooltip', { 'tag-action__tooltip--toogled': showActionTooltip } ]"
            v-text="isFollowed ? $t('FOLLOWING.FOLLOW_TAG') : $t('FOLLOWING.UNFOLLOW_TAG') "
          >
          </span>
        </span>
      </div>
      <ul
        v-if="showRelatedsList && isTaggedProjectsExist"
        :class="[ 'tag__relateds-list', { 'tag__relateds-list--colorize-triangle': isMouseover } ]"
      >
        <TagItemRelatedsListItem
          v-for="(project, i) in tag.taggedProjects"
          :data="project"
          :key="i"
          class="tag__relateds-list-item"
        />
      </ul>
    </div>
    <!-- TODO: add trending-rank -->
    <p v-if="showTrendingRank" class="tag-item__trending-rank"></p>
  </li>
</template>

<script>
import { get, } from 'lodash'
import TagItemRelatedsListItem from './TagItemRelatedsListItem.vue'
import { mapState, } from 'vuex'

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })

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
  data () {
    return {
      showActionTooltip: false,
      isMouseoverLocal: false, // For preserving mouseover effect when tag's isMouseover status is not exist
    }
  },
  computed: {
    ...mapState({
      userId: state => state.profile.id,
      tagsFollowingByUser: state => get(state.followingByUserStats, 'tag', {}),
    }),
    isFollowed () {
      return get(this.tagsFollowingByUser, this.tag.id, false)
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isTaggedProjectsExist () {
      return 'taggedProjects' in this.tag && this.tag.taggedProjects !== null
    },
    isMouseover () {
      return get(this.$store.state, [ 'tagsIsMouseover', this.tag.id, ], this.isMouseoverLocal)
    },
    starUrlFollowed () {
      return this.isMouseover ? '/public/icons/star-white.png' : '/public/icons/star-blue.png'
    },
    starUrlUnFollowed () {
      return this.isMouseover ? '/public/icons/star-whiteline.png' : '/public/icons/star-line-blue.png'
    },
  },
  methods: {
    toogleFollow () {
      if (this.isFollowed) {
        publishAction(this.$store, {
          action: 'unfollow',
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: this.tag.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'tag',
          subject: this.$store.state.profile.id,
          object: this.tag.id,
        })
      }
      toogleFollowingByUserStat(this.$store, { resource: 'tag', targetId: this.tag.id, })
      this.toogleFollowTooltip()
    },
    toogleFollowTooltip () {
      this.showActionTooltip = true
      if (this._timer) {
        clearTimeout(this._timer)
      }
      this._timer = setTimeout(() => {
        this.showActionTooltip = false
      }, 1000)
    },
    handleMouseEvent (e) {
      this.isMouseoverLocal = e.type === 'mouseover'
      this.$store.commit('SET_TAGS_MOUSEEVENT', { id: this.tag.id, value: e.type === 'mouseover', })
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
    border-radius 12px
    background-color white
    color black
    transition background-color .1s ease-out, color .1s ease-out
    &--has-list
      border-radius 0
      border-top-left-radius 12px
      border-top-right-radius 12px
    &--highlight
      background-color #11b8c9
      color white
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
      width 0
      height 0
      border-style solid
      border-width 10px 4px 0 4px
      border-color #11b8c9 transparent transparent transparent
    &:after
      content ''
      position absolute
      top -1px
      left 30.5px
      width 0
      height 0
      border-style solid
      border-width 9px 3px 0 3px
      border-color white transparent transparent transparent
      transition border-color .1s ease-out
    &--colorize-triangle
      &:after
        content ''
        position absolute
        top -1px
        left 30.5px
        width 0
        height 0
        border-style solid
        border-width 9px 3px 0 3px
        border-color #11b8c9 transparent transparent transparent
  &__relateds-list-item
    & + &
      border-top 1px solid #d3d3d3

.tag-action
  position relative
  &__tooltip
    pointer-events none
    padding 1px 2px
    position absolute
    top 5%
    left 30px
    width max-content
    height 90%
    font-size 10px
    color #444746
    background-color white
    border 1px solid #d3d3d3
    z-index 100
    display flex
    align-items center
    opacity 0
    transition opacity .25s
    &:before
      position absolute
      top 2.5px
      left -10px
      content ''
      width 0
      height 0
      border-style solid
      border-width 7px 10px 7px 0
      border-color transparent #d3d3d3 transparent transparent
    &:after
      position absolute
      top 3.5px
      left -9px
      content ''
      width 0
      height 0
      border-style solid
      border-width 6px 9px 6px 0
      border-color transparent white transparent transparent
    &--toogled
      opacity 1
</style>


