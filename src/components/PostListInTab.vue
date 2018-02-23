<template>
  <section class="postListInTab">
    <PaginationNav :totalPages="totalPages" @pageChanged="$_postListInTab_pageChanged"></PaginationNav>
    <div v-for="p in posts" :key="p.id" class="postListInTab__post">
      <div
        class="postListInTab__active"
        :class="[ p.active === config.active.DRAFT ? 'draft' : '' ]"
        v-text="$_postListInTab_getActive(p)">
      </div>
      <div class="postListInTab__content">
        <div class="postListInTab__title">
          <h2 v-text="p.title"></h2>
          <div v-if="!(!$can('editOtherPost') && p.active !== config.active.DRAFT)" class="postListInTab__control--desktop">
            <button class="postListInTab__btn" @click="$_postListInTab_editPost(p.id)" v-text="wording.WORDING_POSTLIST_EDIT"></button>
            <button class="postListInTab__btn" @click="$_postListInTab_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button>
          </div>
        </div>
        <p v-if="p.content" class="postListInTab__descr" v-text="$_postListInTab_getDescr(p.content)"></p>
      </div>
      <div class="postListInTab__control--mobile">
        <button class="postListInTab__btn" @click="$_postListInTab_editPost(p.id)" v-text="wording.WORDING_POSTLIST_EDIT"></button>
        <button class="postListInTab__btn" @click="$_postListInTab_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button>
      </div>
    </div>
  </section>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from '../../api/config'
  import {
    WORDING_POSTLIST_DELETE,
    WORDING_POSTLIST_EDIT,
    WORDING_POSTLIST_ACTIVE_PUBLISH,
    WORDING_POSTLIST_ACTIVE_PENDING,
    WORDING_POSTLIST_ACTIVE_UNPUBLISH,
    WORDING_POSTLIST_ACTIVE_DRAFT
  } from '../constants'
  import _ from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  const MAXRESULT = 20

  export default {
    name: 'PostListInTab',
    components: {
      PaginationNav
    },
    props: {
      posts: {
        type: Array,
        default: []
        // required: true
      }
    },
    data () {
      return {
        config: {
          active: POST_ACTIVE,
        },
        postConfig: POST_ACTIVE,
        wording: {
          WORDING_POSTLIST_DELETE,
          WORDING_POSTLIST_EDIT,
          WORDING_POSTLIST_ACTIVE_PUBLISH,
          WORDING_POSTLIST_ACTIVE_PENDING,
          WORDING_POSTLIST_ACTIVE_UNPUBLISH,
          WORDING_POSTLIST_ACTIVE_DRAFT
        }
      }
    },
    computed: {
      totalPages () {
        return Math.ceil(_.get(this.$store, [ 'state', 'postsCount' ], 0) / MAXRESULT)
      }
    },
    methods: {
      $_postListInTab_deletePost (id) {
        this.$emit('deletePost', [ id ], POST_ACTIVE.DEACTIVE)
      },
      $_postListInTab_editPost (id) {
        this.$emit('editPost', { postPanel: 'edit', id: id })
      },
      $_postListInTab_getActive (post) {
        switch (post.active) {
          case POST_ACTIVE.ACTIVE:
            return WORDING_POSTLIST_ACTIVE_PUBLISH
          case POST_ACTIVE.DRAFT:
            return WORDING_POSTLIST_ACTIVE_DRAFT
          case POST_ACTIVE.PENDING:
            return WORDING_POSTLIST_ACTIVE_PENDING
          case POST_ACTIVE.UNPUBLISH:
            return WORDING_POSTLIST_ACTIVE_UNPUBLISH
          default:
            return WORDING_POSTLIST_ACTIVE_DRAFT
        }
      },
      $_postListInTab_getDescr (content) {
        const parser = new DOMParser()
        const html = parser.parseFromString(content, 'text/html')
        const origin = Array.from(html.querySelectorAll('p'))
          .filter((node) => {
            return node.innerHTML !== '<br>'
          })
          .map((node) => {
            return node.innerHTML.replace(/<[^>]*>/g, "")
          })
          .join('')
        return origin
      },
      $_postListInTab_pageChanged (index) {
        this.$emit('pageChanged', index)
      }
    }
  }
</script>
<style lang="stylus" scoped>
.postListInTab
  width 100%
  margin 0 auto
  &__post
    display flex
    flex-direction column
    padding 0 0 10px
    border-bottom 1px solid #979797
    h2
      margin 0
    &:not(:first-of-type)
      margin-top 10px
    &:last-of-type
      border-bottom none
  &__active
    width 55px
    height 25px
    color #ddcf21
    font-size 14px
    text-align center
    line-height 25px
    background-color #444746
    &.draft
      color #444746
      background-color #ddcf21
  &__content
    flex 1
    margin 10px 0 0
  &__title
    display flex
    justify-content space-between
    h2
      max-width 100%
      font-size 15px
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
  &__control
    &--mobile
      display flex
      justify-content space-between
      margin-top 5px
    &--desktop
      display none
  &__btn
    width calc((100% - 25px) / 2)
    height 25px
    color #fff
    background-color #4280a2
    border none
  &__descr
    max-height 59px
    margin 5px 0 0
    font-size 14px
    font-weight 300
    text-align justify
    line-height 1.4
    overflow hidden
  

@media (min-width 950px)
  .postListInTab
    width 750px
    &__post
      flex-direction row
      padding 0
      border-bottom none
    &__content
      margin 0 0 0 10px
    &__title
      height 25px
      h2
        max-width 550px
        font-size 18px
        line-height 25px
    &__control
      &--mobile
        display none
      &--desktop
        display flex
        align-items center
    &__btn
      width auto
      height auto
      margin 0 5px
      padding 0 0 2px
      color #4280a2
      font-size 15px
      font-weight 600
      background-color transparent
      border none 
      border-bottom 1px solid #4280a2
      &:last-of-type
        margin-right 0
    &__descr
      max-height 63px
      font-size 15px
      line-height 1.4
</style>
