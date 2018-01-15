<template>
  <table class="postList">
    <thead>
      <tr>
        <th><input type="checkbox" ref="checkboxSelectAll" @click="$_postList_toggleSelectAll"></th>
        <th><span @click="$_postList_orderBy('author.nickname')">暱稱</span></th>
        <th><span @click="$_postList_orderBy('title')">標題</span></th>
        <th><span @click="$_postList_orderBy('active')">狀態</span></th>
        <th><button class="postList__btn postList__btn--multiple">發布</button></th>
        <th><button class="postList__btn postList__btn--multiple">刪除</button></th>
        <th>
          <select name="" id="">
            <option value="-updated_at">更新時間</option>
            <option value="-created_at">發布時間</option>
          </select>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in posts" :key="p.id">
        <td><input type="checkbox" ref="checkboxItems"></td>
        <td class="postList__nickname" v-text="$_postList_getAuthorId(p)"></td>
        <td class="postList__title" v-text="p.title"></td>
        <td class="postList__status postList--center" v-text="$_postList_getStatus(p)"></td>
        <td class="postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_editPost(p.id)">修改</button></td>
        <td class="postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_deletePost(p.id)">刪除</button></td>
        <td></td>
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
    data () {
      return {
        order: ''
      }
    },
    mounted () {},
    methods: {
      $_postList_deletePost (id) {
        this.$emit('deletePost', id)
      },
      $_postList_editPost (id) {
        this.$emit('editPost', true, 'edit', id)
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
      },
      $_postList_orderBy (field) {
        if (this.order === field || this.order === `-${field}`) {
          this.order = this.order.indexOf('-') === 0 ? field : `-${field}`
          this.$emit('filterChanged', { sort: this.order })
        } else {
          this.order = field
          this.$emit('filterChanged', { sort: this.order })
        }
      },
      $_postList_toggleSelectAll () {
        _.map(this.$refs.checkboxItems, (item) => {
          item.checked = this.$refs.checkboxSelectAll.checked
        })
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
    select
      height 25px
      line-height 25px
    span
      position relative
      cursor pointer
      &::before
        content ''
        position absolute
        top 0
        left 100%
        width 15px
        height 100%
        background-position center center
        background-repeat no-repeat
        background-size 7px auto
        background-image url(/public/icons/double-triangle.png)
  tbody
    font-size 15px
    // tr:first-of-type
    //   td
    //     padding-top 10px
    td
      // padding-top 2px
      // padding-bottom 2px
      padding 10px 10px 10px 0
      border-bottom 1px solid #d3d3d3
    // td:first-of-type
    //   padding-left 0
    
  input[type="checkbox"]
    width 15px
    height 15px
  &__nickname
    max-width 120px
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
  &__title
    // max-width 330px
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
  &__status
    min-width 60px
  &--center
    text-align center
    padding-left 10px
    padding-right 10px
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
