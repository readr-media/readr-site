<template>
  <div class="postList-container">
    <PaginationNav :totalPages="totalPages" @pageChanged="$_postList_pageChanged"></PaginationNav>
    <table class="postList">
      <thead>
        <tr>
          <th class="postList__checkbox"><input type="checkbox" ref="checkboxSelectAll" @click="$_postList_toggleSelectAll"></th>
          <th class="postList__nickname"><span @click="$_postList_orderBy('author.nickname')" v-text="$t('post_list.WORDING_POSTLIST_NICKNAME')"></span></th>
          <th class="postList__type"></th>
          <th class="postList__title"><span @click="$_postList_orderBy('title')" v-text="$t('post_list.WORDING_POSTLIST_TITLE')"></span></th>
          <th class="postList__status postList--center"><span @click="$_postList_orderBy('active')" v-text="$t('post_list.WORDING_POSTLIST_ACTIVE')"></span></th>
          <th class="postList__update postList--center">
            <button
              class="postList__btn postList__btn--multiple"
              :disabled="!canPublishPosts"
              @click="$_postList_publishPosts"
              v-text="$t('post_list.WORDING_POSTLIST_PUBLISH')">
            </button>
          </th>
          <th class="postList__delete postList--center">
            <button
              class="postList__btn postList__btn--multiple"
              :disabled="!canDeletePosts"
              @click="$_postList_deletePosts"
              v-text="$t('post_list.WORDING_POSTLIST_DELETE')">
            </button>
          </th>
          <th class="postList__sort postList--center">
            <select name="" id="">
              <option value="-updated_at" v-text="$t('post_list.WORDING_POSTLIST_UPDATE_AT')"></option>
              <option value="-created_at" v-text="$t('post_list.WORDING_POSTLIST_PUBLISH_AT')"></option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td class="postList__checkbox"><input type="checkbox" ref="checkboxItems" @change="$_postList_toggleHandler($event, p.id)"></td>
          <td class="postList__nickname" v-text="$_postList_getAuthorId(p)"></td>
          <td class="postList__type"><div v-if="p.type === postType.NEWS" class="postList__type--news">N</div></td>
          <td class="postList__title" @click="$_showPost(p)" v-text="p.title"></td>
          <td class="postList__status postList--center" v-text="$_postList_getStatus(p)"></td>
          <td class="postList__update postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_editPost(p.id)" v-text="$t('post_list.WORDING_POSTLIST_UPDATE')"></button></td>
          <td class="postList__delete postList--center"><button class="postList__btn postList__btn--single" @click="$_postList_deletePost(p.id)" v-text="$t('post_list.WORDING_POSTLIST_DELETE')"></button></td>
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
  import { POST_ACTIVE, POST_TYPE, } from '../../api/config'
  import _ from 'lodash'
  import BaseLightBox from './BaseLightBox.vue'
  import BaseLightBoxPost from './BaseLightBoxPost.vue'
  import PaginationNav from './PaginationNav.vue'

  export default {
    name: 'PostList',
    components: {
      BaseLightBox,
      BaseLightBoxPost,
      PaginationNav,
    },
    props: {
      maxResult: {
        type: Number,
        required: true,
      },
      posts: {
        type: Array,
        required: true,
      },
      sort: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        checkedIems: [],
        order: '',
        post: {},
        postType: POST_TYPE,
        showLightBox: false,
      }
    },
    computed: {
      canDeletePosts () {
        return this.checkedIems.length > 0
      },
      canPublishPosts () {
        const items = _.filter(this.checkedIems, (item) => {
          const post = _.find(this.posts, { id: item, })
          return _.get(post, [ 'active', ]) !== POST_ACTIVE.ACTIVE
        })
        return items.length > 0
      },
      totalPages () {
        return Math.ceil(_.get(this.$store, [ 'state', 'postsCount', ], 0) / this.maxResult)
      },
    },
    mounted () {},
    methods: {
      $_postList_deletePost (id) {
        this.$emit('deletePosts', [ id, ], POST_ACTIVE.DEACTIVE)
      },
      $_postList_deletePosts () {
        this.$emit('deletePosts', this.checkedIems, POST_ACTIVE.DEACTIVE)
      },
      $_postList_editPost (id) {
        this.$emit('editPost', { postPanel: 'edit', id: id, })
      },
      $_postList_getAuthorId (post) {
        return _.get(post, [ 'author', 'nickname', ])
      },
      $_postList_getStatus (post) {
        const status = _.get(post, [ 'active', ])
        switch (status) {
          case POST_ACTIVE.ACTIVE:
            return this.wording.WORDING_POSTLIST_ACTIVE_PUBLISH
          case POST_ACTIVE.PENDING:
            return this.wording.WORDING_POSTLIST_ACTIVE_PENDING
          case POST_ACTIVE.DRAFT:
            return this.wording.WORDING_POSTLIST_ACTIVE_DRAFT
          case POST_ACTIVE.UNPUBLISH:
            return this.wording.WORDING_POSTLIST_ACTIVE_UNPUBLISH
          default:
            return this.wording.WORDING_POSTLIST_ACTIVE_DRAFT
        }
      },
      $_postList_orderBy (field) {
        let order
        if (this.sort === field || this.sort === `-${field}`) {
          order = this.sort.indexOf('-') === 0 ? field : `-${field}`
        } else {
          order = field
        }
        this.$emit('filterChanged', { sort: order, })
      },
      $_postList_pageChanged (index) {
        this.$emit('filterChanged', { page: index, })
      },
      $_postList_publishPosts () {
        const items = _.filter(this.checkedIems, (item) => {
          const post = _.find(this.posts, { id: item, })
          return _.get(post, [ 'active', ]) !== POST_ACTIVE.ACTIVE
        })
        this.$emit('publishPosts', items, POST_ACTIVE.ACTIVE)
      },
      $_postList_toggleHandler (event, id) {
        if (event.target.checked) {
          this.checkedIems.push(id)
        } else {
          const index = this.checkedIems.indexOf(id)
          if (index > -1) {
            this.checkedIems.splice(index, 1)
          }
        }
      },
      $_postList_toggleSelectAll () {
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
      },
      $_showPost (post) {
        this.showLightBox = true
        this.post = post
      },
    },
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
  button:disabled
    background-color #ccc
  &__checkbox
    width 20px
  &__nickname
    width 20%
    padding-right 10px
  &__type
    width 25px
    padding-right 5px
    &--news
      width 20px
      height 20px
      color #fff
      font-size 13px
      text-align center
      line-height 20px
      background-color #4280A2
      border-radius 50%
      user-select none
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
      width 330px
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
