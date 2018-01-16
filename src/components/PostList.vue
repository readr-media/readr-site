<template>
  <table class="postList">
    <thead>
      <tr>
        <th><input type="checkbox" ref="checkboxSelectAll" @click="$_postList_toggleSelectAll"></th>
        <th><span @click="$_postList_orderBy('author.nickname')" v-text="wording.WORDING_POSTLIST_NICKNAME"></span></th>
        <th><span @click="$_postList_orderBy('title')" v-text="wording.WORDING_POSTLIST_TITLE"></span></th>
        <th><span @click="$_postList_orderBy('active')" v-text="wording.WORDING_POSTLIST_ACTIVE"></span></th>
        <th><button class="postList__btn postList__btn--multiple" v-text="wording.WORDING_POSTLIST_PUBLISH"></button></th>
        <th><button class="postList__btn postList__btn--multiple" v-text="wording.WORDING_POSTLIST_DELETE"></button></th>
        <th>
          <select name="" id="">
            <option value="-updated_at" v-text="wording.WORDING_POSTLIST_UPDATE_AT"></option>
            <option value="-created_at" v-text="wording.WORDING_POSTLIST_PUBLISH_AT"></option>
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
        <td class="postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_editPost(p.id)" v-text="wording.WORDING_POSTLIST_UPDATE"></button></td>
        <td class="postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import {
    WORDING_POSTLIST_ACTIVE,
    WORDING_POSTLIST_ACTIVE_DRAFT,
    WORDING_POSTLIST_ACTIVE_PENDING,
    WORDING_POSTLIST_ACTIVE_PUBLISH,
    WORDING_POSTLIST_ACTIVE_UNPUBLISH,
    WORDING_POSTLIST_DELETE,
    WORDING_POSTLIST_NICKNAME,
    WORDING_POSTLIST_PUBLISH,
    WORDING_POSTLIST_PUBLISH_AT,
    WORDING_POSTLIST_TITLE,
    WORDING_POSTLIST_UPDATE,
    WORDING_POSTLIST_UPDATE_AT
  } from '../constants'
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
        order: '',
        wording: {
          WORDING_POSTLIST_ACTIVE,
          WORDING_POSTLIST_ACTIVE_DRAFT,
          WORDING_POSTLIST_ACTIVE_PENDING,
          WORDING_POSTLIST_ACTIVE_PUBLISH,
          WORDING_POSTLIST_ACTIVE_UNPUBLISH,
          WORDING_POSTLIST_DELETE,
          WORDING_POSTLIST_NICKNAME,
          WORDING_POSTLIST_PUBLISH,
          WORDING_POSTLIST_PUBLISH_AT,
          WORDING_POSTLIST_TITLE,
          WORDING_POSTLIST_UPDATE,
          WORDING_POSTLIST_UPDATE_AT
        }
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
          case 1:
            return this.wording.WORDING_POSTLIST_ACTIVE_PUBLISH
          case 2:
            return this.wording.WORDING_POSTLIST_ACTIVE_PENDING
          case 3:
            return this.wording.WORDING_POSTLIST_ACTIVE_DRAFT
          case 4:
            return this.wording.WORDING_POSTLIST_ACTIVE_UNPUBLISH
          default:
            return this.wording.WORDING_POSTLIST_ACTIVE_DRAFT
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
      padding-right 10px
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
    td
      padding 10px 0 10px 0
      border-bottom 1px solid #d3d3d3
   
    
  input[type="checkbox"]
    width 15px
    height 15px
  &__nickname
    max-width 120px
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
  &__title
    max-width 330px
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
