<template>
  <table class="postList">
    <thead>
      <tr>
        <th>帳號</th>
        <th>標題</th>
        <th>狀態</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in posts" :key="p.id">
        <td v-text="p.author"></td>
        <td v-text="p.title"></td>
        <td v-text="p.active"></td>
        <td><button class="postList__btn" @click="$_postList_editPost(p.id)">修改</button></td>
        <td><button class="postList__btn" @click="$_postList_deletePost(p.id)">刪除</button></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
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
        console.log('id', id)
      },
      $_postList_editPost (id) {
        this.$emit('editPost', id)
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postList
  width 100%
  thead
    text-align left
  &__btn
    background-color transparent
    border none
    outline none
    cursor pointer

</style>
