<template>
  <div class="videoList-container">
    <PaginationNav :totalPages="totalPages" @pageChanged="$_videoList_pageChanged"></PaginationNav>
    <table class="videoList">
      <thead>
        <tr>
          <th class="videoList__checkbox"><input type="checkbox" ref="checkboxSelectAll" @click="$_videoList_toggleSelectAll"></th>
          <th class="videoList__title"><span @click="$_videoList_orderBy('title')" v-text="wording.WORDING_POSTLIST_TITLE"></span></th>
          <th class="videoList__link"><span @click="$_videoList_orderBy('link')" v-text="`${wording.WORDING_POSTLIST_VIDEO}${wording.WORDING_POSTLIST_LINK}`"></span></th>
          <th class="videoList__status videoList--center"><span @click="$_videoList_orderBy('active')" v-text="wording.WORDING_POSTLIST_ACTIVE"></span></th>
          <th class="videoList__update videoList--center">
            <button
              class="videoList__btn videoList__btn--multiple"
              :disabled="!canPublishPosts"
              @click="$_videoList_publishPosts"
              v-text="wording.WORDING_POSTLIST_PUBLISH">
            </button>
          </th>
          <th class="videoList__delete videoList--center">
            <button
              class="videoList__btn videoList__btn--multiple"
              :disabled="!canDeletePosts"
              @click="$_videoList_deletePosts"
              v-text="wording.WORDING_POSTLIST_DELETE">
            </button>
          </th>
          <th class="videoList__sort videoList--center">
            <select name="" id="">
              <option value="-updated_at" v-text="wording.WORDING_POSTLIST_UPDATE_AT"></option>
              <option value="-created_at" v-text="wording.WORDING_POSTLIST_PUBLISH_AT"></option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td class="videoList__checkbox"><input type="checkbox" ref="checkboxItems" @change="$_videoList_toggleHandler($event, p.id)"></td>
          <td class="videoList__title" v-text="p.title"></td>
          <td class="videoList__link" v-text="p.link"></td>
          <td class="videoList__status videoList--center" v-text="$_videoList_getStatus(p)"></td>
          <td class="videoList__update videoList--center"><button class="videoList__btn videoList__btn--single" @click="$_videoList_editPost(p.id)" v-text="wording.WORDING_POSTLIST_UPDATE"></button></td>
          <td class="videoList__delete videoList--center"><button class="videoList__btn videoList__btn--single" @click="$_videoList_deletePost(p.id)" v-text="wording.WORDING_POSTLIST_DELETE"></button></td>
          <td class="videoList__sort"></td>
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
    WORDING_POSTLIST_ACTIVE_PUBLISH,
    WORDING_POSTLIST_DELETE,
    WORDING_POSTLIST_LINK,
    WORDING_POSTLIST_PUBLISH,
    WORDING_POSTLIST_PUBLISH_AT,
    WORDING_POSTLIST_TITLE,
    WORDING_POSTLIST_UPDATE,
    WORDING_POSTLIST_UPDATE_AT,
    WORDING_POSTLIST_VIDEO
  } from '../constants'
  import _ from 'lodash'
  import BaseLightBox from './BaseLightBox.vue'
  import BaseLightBoxPost from './BaseLightBoxPost.vue'
  import PaginationNav from './PaginationNav.vue'

  export default {
    name: 'VideoList',
    components: {
      BaseLightBox,
      BaseLightBoxPost,
      PaginationNav
    },
    props: {
      maxResult: {
        type: Number,
        required: true
      },
      posts: {
        type: Array,
        required: true
      },
      sort: {
        type: String,
        required: true
      },
    },
    data () {
      return {
        checkedIems: [],
        order: '',
        post: {},
        postType: POST_TYPE,
        showLightBox: false,
        wording: {
          WORDING_POSTLIST_ACTIVE,
          WORDING_POSTLIST_ACTIVE_DRAFT,
          WORDING_POSTLIST_ACTIVE_PUBLISH,
          WORDING_POSTLIST_DELETE,
          WORDING_POSTLIST_LINK,
          WORDING_POSTLIST_PUBLISH,
          WORDING_POSTLIST_PUBLISH_AT,
          WORDING_POSTLIST_TITLE,
          WORDING_POSTLIST_UPDATE,
          WORDING_POSTLIST_UPDATE_AT,
          WORDING_POSTLIST_VIDEO
        }
      }
    },
    computed: {
      canDeletePosts () {
        return this.checkedIems.length > 0
      },
      canPublishPosts () {
        const items = _.filter(this.checkedIems, (item) => {
          const post = _.find(this.posts, { id: item })
          return _.get(post, [ 'active' ]) !== POST_ACTIVE.ACTIVE
        })
        return items.length > 0
      },
      totalPages () {
        return Math.ceil(_.get(this.$store, [ 'state', 'postsCount' ], 0) / this.maxResult)
      }
    },
    mounted () {},
    methods: {
      $_videoList_deletePost (id) {
        this.$emit('deletePosts', [ id ], POST_ACTIVE.DEACTIVE)
      },
      $_videoList_deletePosts () {
        this.$emit('deletePosts', this.checkedIems, POST_ACTIVE.DEACTIVE)
      },
      $_videoList_editPost (id) {
        this.$emit('editPost', { postPanel: 'edit', id: id })
      },
      $_videoList_getStatus (post) {
        const status = _.get(post, [ 'active' ])
        switch (status) {
          case POST_ACTIVE.ACTIVE:
            return this.wording.WORDING_POSTLIST_ACTIVE_PUBLISH
          default:
            return this.wording.WORDING_POSTLIST_ACTIVE_DRAFT
        }
      },
      $_videoList_orderBy (field) {
        let order
        if (this.sort === field || this.sort === `-${field}`) {
          order = this.sort.indexOf('-') === 0 ? field : `-${field}`
        } else {
          order = field
        }
        this.$emit('filterChanged', { sort: order })
      },
      $_videoList_pageChanged (index) {
        this.$emit('filterChanged', { page: index })
      },
      $_videoList_publishPosts () {
        const items = _.filter(this.checkedIems, (item) => {
          const post = _.find(this.posts, { id: item })
          return _.get(post, [ 'active' ]) !== POST_ACTIVE.ACTIVE
        })
        this.$emit('publishPosts', items, POST_ACTIVE.ACTIVE)
      },
      $_videoList_toggleHandler (event, id) {
        if (event.target.checked) {
          this.checkedIems.push(id)
        } else {
          const index = this.checkedIems.indexOf(id)
          if (index > -1) {
            this.checkedIems.splice(index, 1)
          }
        }
      },
      $_videoList_toggleSelectAll () {
        this.checkedIems = []
        _.map(this.$refs.checkboxItems, (item) => {
          item.checked = this.$refs.checkboxSelectAll.checked
        })
        if (this.$refs.checkboxSelectAll.checked) {
          _.map(this.posts, (item) => {
            this.checkedIems.push(item.id)
          })
          this.checkedIems = _.uniq(this.checkedIems)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

.videoList
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
  button:disabled
    background-color #ccc
  &__checkbox
    width 20px
  
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
  .videoList
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
   
    &__title
      width 200px
      padding-right 60px
    &__link
      width 250px
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
