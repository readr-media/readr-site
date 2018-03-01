<template>
  <section class="followingListInTab">
    <nav class="followingListInTab__nav">
      <button
        :class="[ currentResource === 'member' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('member')"
        v-text="wording.WORDING_FOLLOW_LIST_GUEST_EDITOR">
      </button>
      <button
        :class="[ currentResource === 'post' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('post')"
        v-text="`${wording.WORDING_FOLLOW_LIST_FOLLOW}${wording.WORDING_FOLLOW_LIST_REVIEW}`">
      </button>
      <button
        :class="[ currentResource === 'project' ? 'active' : '' ]"
        @click="$_followingListInTab_resourceHandler('project')"
        v-text="`${wording.WORDING_FOLLOW_LIST_FOLLOW}${wording.WORDING_FOLLOW_LIST_PROJECT}`">
      </button>
    </nav>
    <!-- <pagination-nav></pagination-nav> -->
    <div class="followingListInTab__list">
      <div v-for="follow in followingByUser" :key="follow.id" class="followingListInTab__item">
        <div class="followingListInTab__img">
          <div v-if="currentResource === 'member'"></div>
          <button @click="$_followingListInTab_unfollow(follow.id)"><img src="/public/icons/star-grey.png"></button>
        </div>
        <div class="followingListInTab__content">
          <h2 v-text="follow.title"></h2>
          <p v-text="$_followingListInTab_getDescription(follow)"></p>
        </div>
        <div v-if="currentResource === 'project'" class="followingListInTab__og"></div>
      </div>
    </div>
  </section>
</template>
<script>
  import {
    WORDING_FOLLOW_LIST_FOLLOW,
    WORDING_FOLLOW_LIST_GUEST_EDITOR,
    WORDING_FOLLOW_LIST_NEWS,
    WORDING_FOLLOW_LIST_PROJECT,
    WORDING_FOLLOW_LIST_REVIEW
  } from '../constants'
  import PaginationNav from './PaginationNav.vue'

  export default {
    name: 'FollowingListInTab',
    components: {
      'pagination-nav': PaginationNav
    },
    props: {
      currentResource: {
        type: String,
        required: true
      },
      followingByUser: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        wording: {
          WORDING_FOLLOW_LIST_FOLLOW,
          WORDING_FOLLOW_LIST_GUEST_EDITOR,
          WORDING_FOLLOW_LIST_NEWS,
          WORDING_FOLLOW_LIST_PROJECT,
          WORDING_FOLLOW_LIST_REVIEW
        }
      }
    },
    methods: {
      $_followingListInTab_getDescription (follow) {
        switch (this.currentResource) {
          case 'member':
            return _.get(follow, [ 'description' ])
          case 'post':
            const parser = new DOMParser()
            const html = parser.parseFromString(follow.content, 'text/html')
            const origin = Array.from(html.querySelectorAll('p'))
              .filter((node) => {
                return node.innerHTML !== '<br>'
              })
              .map((node) => {
                return node.innerHTML.replace(/<[^>]*>/g, "")
              })
              .join('')
            return origin
          default:
            return ''
        }
      },
      $_followingListInTab_resourceHandler (resource) {
        this.$emit('changeResource', resource)
      },
      $_followingListInTab_unfollow (id) {
        // this.$emit('unfollow', this.currentResource, id)
      }
    }
  }
</script>
<style lang="stylus" scoped>

.followingListInTab
  width 750px
  margin 0 auto
  &__nav
    button
      height 15px
      padding 0
      margin 0 5px
      color #a8a8a8
      font-size 15px
      background transparent
      border none
      outline none
      &.active
        color #000
        &::before
          content ''
          width 0
          height 0
          margin-right 3px
          font-size 0
          line-height 0
          vertical-align super
          border-style solid
          border-width 7.5px 0 7.5px 15px
          border-color transparent transparent transparent #ddcf21
  &__list
    margin-top 30px
    min-height 297px
  &__item
    display flex
  &__img
      width 60px
      text-align center
      > div
        width 60px
        height 60px
        margin-bottom 10px
        border 1px solid #979797
        border-radius 50%
      > button
        width 25px
        height 25px
        padding 0
        text-align center
        background transparent
        border none
        outline none
        img 
          width 100%
  &__content
    flex 1
    margin-left 10px
    h2
      margin 0
      font-size 18px
      line-height 20px
    p
      max-height 63px
      margin-top 1em
      font-size 15px
      text-align justify
      line-height 1.4
      overflow hidden
  &__og
    width 175px
    height 92px
    margin-left 15px

</style>
