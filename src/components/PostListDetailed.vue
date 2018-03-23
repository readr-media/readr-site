<template>
  <section class="postListDetailed">
    <div class="postListDetailed__heading">
      <h1 v-text="wording.WORDING_POSTLIST_DRAFT_RECORD"></h1>
    </div>
    <div v-for="p in posts" :key="p.id" class="postListDetailed__post">
      <div class="postListDetailed__post--titleBox">
        <h2 v-text="p.title"></h2>
        <div class="postListDetailed__control--desktop">
          <button @click="$_postListDetailed_editPost(p.id)" v-text="wording.WORDING_POSTLIST_EDIT"></button>
          <button @click="$_postListDetailed_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button>
        </div>
      </div>
      <p class="postListDetailed__post--descr" v-text="$_postListDetailed_getDescr(p.content)"></p>
      <div class="postListDetailed__control--mobile">
        <button @click="$_postListDetailed_editPost(p.id)" v-text="wording.WORDING_POSTLIST_EDIT"></button>
        <button @click="$_postListDetailed_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button>
      </div>
    </div>
  </section>
</template>
<script>
  import { POST_ACTIVE, } from '../../api/config'
  import {
    WORDING_POSTLIST_DELETE,
    WORDING_POSTLIST_DRAFT_RECORD,
    WORDING_POSTLIST_EDIT,
  } from '../constants'

  export default {
    name: 'PostListDetailed',
    props: {
      posts: {
        type: Array,
        required: true,
      },
    },
    data () {
      return {
        wording: {
          WORDING_POSTLIST_DELETE,
          WORDING_POSTLIST_DRAFT_RECORD,
          WORDING_POSTLIST_EDIT,
        },
      }
    },
    methods: {
      $_postListDetailed_deletePost (id) {
        this.$emit('deletePost', [ id, ], POST_ACTIVE.DEACTIVE)
      },
      $_postListDetailed_editPost (id) {
        this.$emit('editPost', { postPanel: 'edit', id: id, })
      },
      $_postListDetailed_getDescr (content) {
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
    },
  }
</script>
<style lang="stylus" scoped>

.postListDetailed
  width 90%
  height 100%
  margin 0 auto
  overflow-x hidden
  overflow-y scroll
  &__heading
    margin-top 25px
    h1
      font-size 15px
      font-weight 600
      color #808080
  &__post
    padding-bottom 15px
    border-bottom 1px solid #d3d3d3
    h2
      max-width 100%
      margin 0
      font-size 18px
      font-weight 600
      line-height 21px
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
    p
      font-size 15px
      font-weight 300
    &:nth-of-type(2)
      margin-top 30px
    &:not(:nth-of-type(2))
      margin-top 10px
    &--titleBox
      display flex
      justify-content space-between
      align-items center
    
    &--descr
      position relative
      max-height 84px
      margin 10px 0
      text-align justify
      text-overflow ellipsis
      line-height 1.4
      overflow hidden
  &__control
    &--mobile
      display flex
      justify-content space-between
      button
        width calc((100% - 20px) / 2)
        height 25px
        color #fff
        font-size 15px
        background-color #4280a2
        border none
    &--desktop
      display none

@media (min-width 950px)  
  .postListDetailed
    width 900px
    padding 25px 100px
    &__post
      padding-bottom 0
      border-bottom none
      &:nth-of-type(2)
        margin-top 65px
      &--descr
        margin 1em 0 2em
    &__control
      &--mobile
        display none
      &--desktop
        display block
        button
          margin 0 .3em
          padding 0 0 2px
          color #4280a2
          font-size 15px
          font-weight 600
          border none
          border-bottom 1px solid #4280a2
</style>
