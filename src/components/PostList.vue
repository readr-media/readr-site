<template>
  <div class="postList-container">
    <table class="postList">
      <thead>
        <tr>
          <th class="postList__checkbox"><input type="checkbox" ref="checkboxSelectAll" @click="$_postList_toggleSelectAll"></th>
          <th class="postList__nickname"><span @click="$_postList_orderBy('author.nickname')" v-text="wording.WORDING_POSTLIST_NICKNAME"></span></th>
          <th class="postList__title"><span @click="$_postList_orderBy('title')" v-text="wording.WORDING_POSTLIST_TITLE"></span></th>
          <th class="postList__status postList--center"><span @click="$_postList_orderBy('active')" v-text="wording.WORDING_POSTLIST_ACTIVE"></span></th>
          <th class="postList__update postList--center">
            <button
              class="postList__btn postList__btn--multiple"
              v-text="wording.WORDING_POSTLIST_PUBLISH"
              @click="$_postList_publishMultiple">
            </button>
          </th>
          <th class="postList__delete postList--center">
            <button
              class="postList__btn postList__btn--multiple"
              v-text="wording.WORDING_POSTLIST_DELETE"
              @click="$_postList_deleteMultiple">
            </button>
          </th>
          <th class="postList__sort postList--center">
            <select name="" id="">
              <option value="-updated_at" v-text="wording.WORDING_POSTLIST_UPDATE_AT"></option>
              <option value="-created_at" v-text="wording.WORDING_POSTLIST_PUBLISH_AT"></option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td class="postList__checkbox"><input type="checkbox" ref="checkboxItems" @change="$_postList_toggleHandler(p.id)"></td>
          <td class="postList__nickname" v-text="$_postList_getAuthorId(p)"></td>
          <td class="postList__title" v-text="p.title" @click="$_showPost(p)"></td>
          <td class="postList__status postList--center" v-text="$_postList_getStatus(p)"></td>
          <td class="postList__update postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_editPost(p.id, p.type)" v-text="wording.WORDING_POSTLIST_UPDATE"></button></td>
          <td class="postList__delete postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button></td>
          <td class="postList__sort"></td>
        </tr>
      </tbody>
    </table>
    <BaseLightBox :showLightBox.sync="showLightBox">
      <BaseLightBoxPost :showLightBox="showLightBox" :post="post" @closeEditor="post = {}"/>
    </BaseLightBox>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from '../../api/config'
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
  import BaseLightBox from './BaseLightBox.vue'
  import BaseLightBoxPost from './BaseLightBoxPost.vue'

  export default {
    name: 'PostList',
    components: {
      BaseLightBox,
      BaseLightBoxPost
    },
    props: {
      posts: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        checkedPost: [],
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
        },
        showLightBox: false,
        post: {}
      }
    },
    mounted () {},
    methods: {
      $_postList_deleteMultiple () {
        this.$emit('deleteMultiple', this.checkedPost)
      },
      $_postList_deletePost (id) {
        this.$emit('deletePost', id)
      },
      $_postList_editPost (id, type) {
        if (type === POST_TYPE.NEWS) {
          this.$emit('editPost', true, 'edit', POST_TYPE.NEWS, id)
        } else {
          this.$emit('editPost', true, 'edit', POST_TYPE.REVIEW, id)
        }
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
      $_postList_publishMultiple () {
        const items = _.filter(this.checkedPost, (item) => {
          const post = _.find(this.posts, { id: item })
          return _.get(post, [ 'active' ]) !== POST_ACTIVE.ACTIVE
        })
        this.$emit('publishMultiple', items)
      },
      $_postList_toggleHandler (id) {
        if (event.target.checked) {
          this.checkedPost.push(id)
          this.checkedPost.sort()
        } else {
          const index = this.checkedPost.indexOf(id)
          if (index > -1) {
            this.checkedPost.splice(index, 1)
          }
        }
      },
      $_postList_toggleSelectAll () {
        _.map(this.$refs.checkboxItems, (item) => {
          item.checked = this.$refs.checkboxSelectAll.checked
        })
        _.map(this.posts, (item) => {
          if (this.$refs.checkboxSelectAll.checked) {
            this.checkedPost.push(item.id)
            this.checkedPost.sort((a, b) => (a - b))
            this.checkedPost = _.uniq(this.checkedPost)
          } else {
            this.checkedPost = []
          }
        })
      },
      $_showPost (post) {
        this.showLightBox = true
        this.post = post
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postList
  width 100%
  color #808080
  text-align left
  border-collapse collapse
  thead
    font-size 15px
  tbody
    font-size 12px
  th
    padding-bottom 5px
    border-bottom 2px solid #000
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
  tr
    &:first-of-type
      td
        padding-top 10px
    &:last-of-type
      td
        border-bottom none
  td
    max-width 0
    padding-top 5px
    padding-bottom 5px
    text-overflow ellipsis
    white-space nowrap
    border-bottom 1px solid #d3d3d3
    overflow hidden
  
  input[type="checkbox"]
    width 12px
    height 12px
  &__checkbox
    width 20px
  &__nickname
    width 20%
    padding-right 10px
  &__title
    padding-right 10px
    cursor pointer
  &__status, &__update, &__delete, &__sort
    display none
  &--center
    text-align center
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

@media (min-width 950px)
  .postList
    thead
      font-size 18px
    tbody
      font-size 15px
    th
      padding-bottom 10px
    input[type="checkbox"]
      width 15px
      height 15px
    &__checkbox
      padding-right 10px
    &__nickname
      width 85px
    &__title
      width 360px
      padding-right 60px
    &__status, &__update, &__delete, &__sort
      display table-cell
    &__status
      width 60px
      padding-right 10px
    &__sort
      select
        height 25px
        line-height 25px
</style>
