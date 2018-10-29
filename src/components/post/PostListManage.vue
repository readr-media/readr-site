<template>
  <div class="post-list-manage">
    <PaginationNav :totalPages="totalPages" :currPage.sync="page" />
    <table>
      <thead>
        <tr>
          <th>
            <div class="checkbox">
              <input type="checkbox" @change="toggleCheckboxAll">
              <span></span>
            </div>
          </th>
          <th><span @click="sortBy('-author.nickname')" v-text="$t('POST_LIST.NICKNAME')"></span></th>
          <th></th>
          <th><span @click="sortBy('-title')" v-text="$t('POST_LIST.TITLE')"></span></th>
          <th class="col--align-center"><span @click="sortBy('-publish_status')" v-text="$t('POST_LIST.PUBLISH_STATUS')"></span></th>
          <th class="col--align-center"><button :disabled="!canPublishPosts" @click="showAlertMultiple(POST_PUBLISH_STATUS.PUBLISHED)"><span v-text="$t('POST_LIST.PUBLISH')"></span></button></th>
          <th class="col--align-center"><button :disabled="itemsChecked.length < 1" @click="showAlertMultiple(POST_PUBLISH_STATUS.DELETED)"><span v-text="$t('POST_LIST.DELETE')"></span></button></th>
          <th class="head--datetime col--align-right">
            <span :class="{ active: isSortByPublishedAt }" @click="sortBy('-published_at')" v-text="$t('POST_LIST.PUBLISH_AT')"></span>
            <span :class="{ active: !isSortByPublishedAt }" @click="sortBy('-updated_at')" v-text="$t('POST_LIST.UPDATE_AT')"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="post in posts">
          <tr :key="post.id" class="row">
            <td class="col--checkbox">
              <div class="checkbox">
                <input ref="checkboxItems" type="checkbox" @change="toggleCheckbox($event, post.id)">
                <span></span>
              </div>
            </td>
            <td class="col--nickname col--single-line" v-text="getNickname(post)"></td>
            <td class="col--news-icon"><span v-if="post.type === POST_TYPE.NEWS">N</span></td>
            <td class="col--title col--single-line"><span @click="showPost(post)" v-text="post.title"></span></td>
            <td class="col--align-center" v-text="getStatus(post)"></td>
            <td class="col--action col--align-center"><span @click="editPost(post)" v-text="$t('POST_LIST.UPDATE')"></span></td>
            <td class="col--action col--align-center"><span @click="showAlertSingleDelete(post)" v-text="$t('POST_LIST.DELETE')"></span></td>
            <td class="col--datetime col--align-right" v-text="isSortByPublishedAt ? getDateTime(post.publishedAt) : getDateTime(post.updatedAt)"></td>
          </tr>
          <tr :key="`${post.id}-tags`">
            <td v-if="post.tags && post.tags.length > 0" colspan="8">
              <TagNav class="post-list-manage__tag-nav" :tags="post.tags" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <BaseLightBox :showLightBox.sync="showLightBoxPost">
      <BaseLightBoxPost :showLightBox="showLightBoxPost" :post="post" @closeEditor="post = {}"/>
    </BaseLightBox>
    <BaseLightBox :isEditor="true" :showLightBox.sync="showLightBoxEditor">
      <PostPanel
        :action="'edit'"
        :editorType="post.type || POST_TYPE.REVIEW"
        :initialPost="post"
        @closeEditor="showLightBoxEditor = false"
        @updateList="updatePostList">
      </PostPanel>
    </BaseLightBox>
    <BaseLightBox :isAlert="true" :showLightBox.sync="showLightBoxAlert">
      <AlertPanel
        :status="itemsStatus"
        :statusChanged="changePublishStatus"
        :items="itemsSelected"
        :needConfirm="needConfirm"
        :showLightBox="showLightBoxAlert"
        :type="alertType"
        @closeAlert="showLightBoxAlert = false"
        @deletePosts="deletePosts"
        @publishPosts="publishPosts" />
    </BaseLightBox>
  </div>
</template>
<script>
  import { POST_PUBLISH_STATUS, POST_TYPE, } from 'api/config'
  import { get, } from 'lodash'
  import AlertPanel from 'src/components/AlertPanel.vue'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import BaseLightBoxPost from 'src/components/BaseLightBoxPost.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import PostPanel from 'src/components/PostPanel.vue'
  import TagNav from 'src/components/tag/TagNav.vue'
  import moment from 'moment'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const deletePosts = (store, { params, }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params,
    })
  }

  const getPosts = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
  } = {}) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: {
          publish_status: [
            POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED,
            POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING,
          ],
          type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ],
        },
      },
    })
  }

  const getPostsCount = (store) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: {
        where: {
          publish_status: [
            POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED,
            POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING,
          ],
          type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ],
        },
      },
    })
  }

  const publishPosts = (store, { params, }) => { 
    return store.dispatch('PUBLISH_POSTS', {
      params: params,
    })
  } 

  export default {
    name: 'PostListManage',
    components: {
      AlertPanel,
      BaseLightBox,
      BaseLightBoxPost,
      PaginationNav,
      PostPanel,
      TagNav,
    },
    data () {
      return {
        POST_PUBLISH_STATUS,
        POST_TYPE,
        alertType: 'post',
        changePublishStatus: false,
        itemsChecked: [],
        itemsSelected: [],
        itemsStatus: undefined,
        needConfirm: false,
        page: DEFAULT_PAGE,
        post: {},
        showLightBoxAlert: false,
        showLightBoxEditor: false,
        showLightBoxPost: false,
        sort: DEFAULT_SORT,
      }
    },
    computed: {
      canPublishPosts () {
        const items = this.itemsChecked.filter((id) => {
          const post = this.posts.find(value => value.id === id)
          return get(post, 'publishStatus') !== POST_PUBLISH_STATUS.PUBLISHED
        })
        return items.length > 0
      },
      isSortByPublishedAt () {
        return this.sort.indexOf('published_at') !== -1
      },
      itemsSelectedID () {
        return this.itemsSelected.map(post => post.id)
      },
      posts () {
        return this.$store.state.posts
      },
      totalPages () {
        return Math.ceil(get(this.$store, 'state.postsCount', 0) / MAXRESULT)
      },
    },
    watch: {
      page (value) {
        getPosts(this.$store, { page: value, sort: this.sort, })
      },
      sort (value) {
        this.page = DEFAULT_PAGE
        getPosts(this.$store, { sort: value, })
      },
    },
    beforeMount () {
      Promise.all([ getPosts(this.$store), getPostsCount(this.$store), ])
    },
    methods: {
      deletePosts () {
        deletePosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: this.$store.state.profile.id,
          },
        }).then(() => {
          this.updatePostList({ needUpdateCount: true, })
          this.showLightBoxEditor = false
          this.needConfirm = false // change alert message
        }).catch(() => {
          this.alertType = 'error'
          this.needConfirm = false // change alert message
        })
      },
      editPost (post) { // need to integrate
        this.post = post
        this.showLightBoxEditor = true
      },
      getDateTime (ISODateTimeString) {
        if (ISODateTimeString) {
          return moment(ISODateTimeString).format('M/D/YYYY HH:mm')
        }
        return ' '
      },
      getNickname (post) {
        return get(post, 'author.nickname') || ''
      },
      getStatus (post) {
        const status = get(post, [ 'publishStatus', ])
        switch (status) {
          case POST_PUBLISH_STATUS.DRAFT:
            return this.$t('POST_LIST.PUBLISH_STATUS_DRAFT')
          case POST_PUBLISH_STATUS.PENDING:
            return this.$t('POST_LIST.PUBLISH_STATUS_PENDING')
          case POST_PUBLISH_STATUS.PUBLISHED:
            return this.$t('POST_LIST.PUBLISH_STATUS_PUBLISHED')
          case POST_PUBLISH_STATUS.SCHEDULING:
            return this.$t('POST_LIST.PUBLISH_STATUS_SCHEDULING')
          case POST_PUBLISH_STATUS.UNPUBLISHED:
            return this.$t('POST_LIST.PUBLISH_STATUS_UNPUBLISHED')
          default:
            return ' '
        }
      },
      publishPosts () {
        publishPosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: this.$store.state.profile.id,
            publish_status: POST_PUBLISH_STATUS.PUBLISHE,
          },
        }).then(() => {
          this.updatePostList({ needUpdateCount: true, })
          this.needConfirm = false // change alert message
        }).catch(() => {
          this.alertType = 'error'
          this.needConfirm = false // change alert message
        })
      },
      showAlertSingleDelete (post) {
        this.alertType = 'post'
        this.itemsSelected = [ post, ]
        this.changePublishStatus = true
        this.itemsStatus = POST_PUBLISH_STATUS.DELETED
        this.needConfirm = true
        this.showLightBoxAlert = true
      },
      showAlertMultiple (statusToChange) {
        this.alertType = 'post'
        this.itemsChecked = this.itemsChecked.filter((id) => {
          const post = this.posts.find(value => value.id === id)
          return post && post.publishStatus !== statusToChange
        })
        this.itemsSelected = this.itemsChecked.map(id => this.posts.find(value => value.id === id))
        this.itemsStatus = statusToChange
        this.changePublishStatus = true
        this.needConfirm = true
        this.showLightBoxAlert = true
      },
      showPost (post) {
        this.post = post
        this.showLightBoxPost = true
      },
      sortBy (field) {
        const fieldNameClean = field.replace('-', '')
        if (this.sort === field || this.sort === `-${field}`) {
          this.sort = this.sort.indexOf('-') === 0 ? fieldNameClean : `-${fieldNameClean}`
        } else {
          this.sort = field
        }
      },
      toggleCheckbox (e, id) {
        if (e.target.checked) {
          this.itemsChecked.push(id)
        } else {
          const index = this.itemsChecked.indexOf(id)
          this.itemsChecked.splice(index, 1)
        }
      },
      toggleCheckboxAll (e) {
        this.itemsChecked = []
        if (e.target.checked) {
          this.$refs.checkboxItems.map((checkbox, index) => {
            checkbox.checked = e.target.checked
            this.itemsChecked.push(this.posts[index].id)
          })
        } else {
          this.$refs.checkboxItems.map((checkbox) => {
            checkbox.checked = e.target.checked
          })
        }
      },
      updatePostList ({ needUpdateCount = false, } = {}) {
        const request = [ getPosts(this.$store, { page: this.page, sort: this.sort, }), ]
        if (needUpdateCount) {
          request.push(getPostsCount(this.$store))
        }
        Promise.all(request)
      },
    },
  }
</script>
<style lang="stylus" scoped>
.post-list-manage
  table
    width 100%
    text-align left
    border-collapse collapse
    thead
      color #808080
      font-size 1.125rem
      th
        min-width 30px
        padding-right 10px
        font-weight 500
        line-height 45px
        border-bottom 2px solid #000
        &:last-child
          > span
            margin-right 15px
        > span
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
        > button
          width 70px
          padding .1em .5em
          color #fff
          background-color #808080
          border-radius 4px
          span
            line-height 23px
        > button:disabled
          background-color #ccc
    tbody
      font-size .9375rem
      td
        height 30px
        padding-right 10px
        color #000
        font-weight 400
        
    .head
      &--datetime
        position relative
        &:hover
          > span
            opacity 1
            visibility visible
            transition opacity .5s, visibility 0s .0s
        > span
          position absolute
          top -30px
          right 10px
          opacity 0
          visibility hidden
          transition opacity .5s, visibility 0s .5s
          &.active
            position relative
            top auto
            right auto
            opacity 1
            visibility visible
    .row
      border-top 1px solid #d3d3d3
    .col
      &--checkbox
        max-width 1px
        width 20px
      &--nickname
        max-width 1px
        width 100px
      &--news-icon
        max-width 1px
        width 30px
        > span
          display inline-block
          width 20px
          height 20px
          color #fff
          font-size 13px
          text-align center
          line-height 20px
          background-color #4280a2
          border-radius 50%
          user-select none
      &--title
        max-width 200px
        > span
          cursor pointer
      &--action
        max-width 1px
        width 80px
        > span
          color #4280a2
          cursor pointer
      &--datetime
        max-width 1px
        width 150px
        font-family "Helvetica Neue", Helvetica, Arial
      &--align-center
        text-align center
      &--align-right
        text-align right
      &--single-line
        text-overflow ellipsis
        white-space nowrap
        overflow hidden
  button
    background-color transparent
    border none
    outline none
  &__tag-nav
    display table-cell
    padding 0 0 .5em
.checkbox
  position relative
  width 20px
  height 20px
  &:hover
    span
      background-color #808080
  input[type="checkbox"]
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 1
    width 20px
    height 20px
    opacity 0
    cursor pointer
    &:checked ~ span
      background-color #d8ca21
    &:checked ~ span:after
      display block
  span
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    width 20px
    height 20px
    background-color #cccccc
    border-radius 3px
    &:after
      content ''
      display none
      position absolute
      top 0px
      left 8px
      transform rotate(45deg)
      width 10px
      height 15px
      border 1px solid white
      border-width 0 3px 3px 0
      
</style>