<template>
  <table class="postList">
    <thead>
      <tr>
        <th><input type="checkbox"></th>
        <th>暱稱</th>
        <th>標題</th>
        <th>狀態</th>
        <th><button class="postList__btn postList__btn--multiple">發布</button></th>
        <th><button class="postList__btn postList__btn--multiple">刪除</button></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in posts" :key="p.id">
        <td><input type="checkbox"></td>
        <td v-text="$_postList_getAuthorId(p)"></td>
        <td v-text="p.title"></td>
        <td v-text="$_postList_getStatus(p)"></td>
        <td><button class="postList__btn postList__btn--single" @click="$_postList_editPost(p.id)">修改</button></td>
        <td><button class="postList__btn postList__btn--single" @click="$_postList_deletePost(p.id)">刪除</button></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'PostList',
    components: {
    },
    props: {
      posts: {
        type: Array,
        required: true
      }
    },
    mounted () {},
    methods: {
      $_postList_deletePost (id) {
        this.$emit('deletePost', id)
      },
      $_postList_editPost (id) {
        this.$emit('editPost', id)
      },
      $_postList_getAuthorId (post) {
        return _.get(post, [ 'author', 'nickname' ])
      },
      $_postList_getStatus (post) {
        const status = _.get(post, [ 'active' ])
        switch (status) {
          case 0:
            return 'deactive'
          case 1:
            return '已發佈'
          case 2:
            return '待審核'
          case 3:
            return '草稿'
          case 4:
            return '已下架'
          default:
            return '草稿'
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postList
  width 100%
  color #808080
  border-collapse collapse
  thead
    font-size 18px
    text-align left
    th
      padding-bottom 10px
      border-bottom 2px solid #000
  tbody
    font-size 15px
    tr:first-of-type
      td
        padding-top 10px
    td
      padding-top 2px
      padding-bottom 2px
      border-bottom 1px solid #d3d3d3
    td:first-of-type
      padding-right 10px
    
  input[type="checkbox"]
    width 15px
    height 15px
  &__btn
    background-color transparent
    border none
    outline none
    cursor pointer
    &--single
      color #4280a2
    &--multiple
      width 60px
      height 25px
      color #fff
      line-height 23px
      background-color #808080
      border-radius 4px


</style>
