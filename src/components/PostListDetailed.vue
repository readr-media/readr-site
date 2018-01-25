<template>
  <section class="postListDetailed">
    <div v-for="p in posts" :key="p.id" class="postListDetailed__post">
      <div class="postListDetailed__post--titleBox">
        <h2 v-text="p.title"></h2>
        <div class="postListDetailed__post--control">
          <button @click="$_postListDetailed_editPost(p.id)" v-text="wording.WORDING_POSTLISTDETAILED_EDIT"></button>
          <button @click="$_postListDetailed_deletePost(p.id)" v-text="wording.WORDING_POSTLISTDETAILED_DELETE"></button>
        </div>
      </div>
      <p class="postListDetailed__post--descr" v-text="$_postListDetailed_getDescr(p.content)"></p>
    </div>
  </section>
</template>
<script>
  import { 
    WORDING_POSTLISTDETAILED_DELETE,
    WORDING_POSTLISTDETAILED_EDIT
  } from '../constants'
  import _ from 'lodash'

  export default {
    name: 'PostListDetailed',
    props: {
      posts: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        wording: {
          WORDING_POSTLISTDETAILED_DELETE,
          WORDING_POSTLISTDETAILED_EDIT
        }
      }
    },
    methods: {
      $_postListDetailed_deletePost (id) {
        this.$emit('deletePost', id)
      },
      $_postListDetailed_editPost (id) {
        this.$emit('editPost', true, 'edit', id)
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
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postListDetailed
  width 90%
  height 100%
  margin 0 auto
  overflow-x hidden
  overflow-y scroll
  &__post
    h2
      margin 0
      font-size 18px
      font-weight 600
      line-height 21px
    p
      font-size 15px
      font-weight 300
    &:not(:first-of-type)
      margin-top 35px
    &--titleBox
      display flex
      justify-content space-between
      align-items center
    &--control
      button
        margin 0 .3em
        padding 0 0 2px
        color #4280a2
        font-size 15px
        font-weight 600
        border none
        border-bottom 1px solid #4280a2
    &--descr
      position relative
      max-height 84px
      margin 10px 0
      text-align justify
      text-overflow ellipsis
      line-height 1.4
      overflow hidden

@media (min-width 950px)  
  .postListDetailed
    width 900px
    padding 25px 100px
</style>
