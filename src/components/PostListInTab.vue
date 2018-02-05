<template>
  <section class="postListInTab">
    <div v-for="p in posts" :key="p.id" class="postListInTab__post">
      <div
        class="postListInTab__active"
        :class="[ p.active === config.active.draft ? 'draft' : '' ]"
        v-text="$_postListInTab_getActive(p)">
      </div>
      <div class="postListInTab__content">
        <div class="postListInTab__title">
          <h2 v-text="p.title"></h2>
          <div v-if="!(!$can('editOtherPost') && p.active !== config.active.draft)" class="postListInTab__control--desktop">
            <button class="postListInTab__btn" @click="$_postListInTab_editPost(p.id, p.type)" v-text="wording.WORDING_POSTLIST_EDIT"></button>
            <button class="postListInTab__btn" @click="$_postListInTab_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button>
          </div>
        </div>
        <p class="postListInTab__descr" v-text="$_postListInTab_getDescr(p.content)"></p>
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

  export default {
    name: 'PostListInTab',
    props: {
      posts: {
        type: Array,
        required: true
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
    methods: {
      $_postListInTab_deletePost (id) {
        this.$emit('deletePost', id)
      },
      $_postListInTab_editPost (id, type) {
        if (type === POST_TYPE.NEWS) {
          this.$emit('editPost', true, 'edit', POST_TYPE.NEWS, id)
        } else {
          this.$emit('editPost', true, 'edit', POST_TYPE.REVIEW, id)
        }
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
      }
    }
  }
</script>
<style lang="stylus" scoped>
.postListInTab
  width 750px
  margin 0 auto
  &__post
    display flex
    h2
      margin 0
    &:not(:first-of-type)
      margin-top 10px
  &__active
    width 45px
    height 25px
    color #444746
    font-size 14px
    text-align center
    line-height 25px
    background-color #ddcf21
    &.draft
      color #ddcf21
      background-color #444746
  &__content
    flex 1
    margin-left 10px
  &__title
    display flex
    justify-content space-between
    height 25px
    h2
      font-size 18px
      max-width 550px
      line-height 25px
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
  &__control
    &--desktop
      display flex
      align-items center
  &__descr
    height 63px
    margin-top 10px
    font-size 15px
    font-weight 300
    text-align justify
    line-height 1.4
    overflow hidden
  &__btn
    margin 0 5px
    padding 0 0 2px
    color #4280a2
    font-size 15px
    font-weight 600
    border none 
    border-bottom 1px solid #4280a2
    &:last-of-type
      margin-right 0

</style>
