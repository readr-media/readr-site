<template>
  <div class="guestEditor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="guestEditor__container">
      <aside class="guestEditor__aside">
        <AppAsideNav/>
      </aside>
      <main class="main-container">
        <app-about :profile="profile"></app-about>
        <control-bar
          @addNews="$_guestEditor_showEditor({ postPanel: 'add', postType: config.type.NEWS })"
          @addReview="$_guestEditor_showEditor({ postPanel: 'add', postType: config.type.REVIEW })"
          @editNews="$_guestEditor_showDraftList(config.type.NEWS)"
          @editReview="$_guestEditor_showDraftList(config.type.REVIEW)"
          @openPanel="$_guestEditor_openPanel">
        </control-bar>
        <template v-if="activePanel === 'records'">
          <section class="guestEditor__record">
            <app-tab :tabs="tabs" @changeTab="$_guestEditor_tabHandler">
              <post-list-tab
                slot="0"
                :posts="posts"
                @deletePost="$_guestEditor_showAlert"
                @editPost="$_guestEditor_showEditor"
                @filterChanged="$_guestEditor_filterHandler">
              </post-list-tab>
              <post-list-tab
                slot="1"
                :posts="posts"
                @deletePost="$_guestEditor_showAlert"
                @editPost="$_guestEditor_showEditor"
                @filterChanged="$_guestEditor_filterHandler">
              </post-list-tab>
              <following-list-tab
                slot="2"
                :currentResource="followingResource"
                :followingByUser="followingByUser"
                @changeResource="$_guestEditor_updateFollowingList"
                @unfollow="$_guestEditor_unfollow">
              </following-list-tab>
            </app-tab>
          </section>
        </template>
      </main>
    </div>
    <base-light-box :showLightBox.sync="showDraftList">
      <post-list-detailed
        :posts="postsDraft"
        @deletePost="$_guestEditor_showAlert"
        @editPost="$_guestEditor_showEditor">
      </post-list-detailed>
    </base-light-box>
    <base-light-box :showLightBox.sync="showEditor">
      <post-panel
        :post="post"
        :panelType="postPanel"
        :postType="postType"
        @addPost="$_guestEditor_addPost"
        @deletePost="$_guestEditor_deletePost"
        @updatePost="$_guestEditor_updatePost">
      </post-panel>
    </base-light-box>
    <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
      <alert-panel
        :active="itemsActive"
        :activeChanged="postActiveChanged"
        :items="itemsSelected"
        :needConfirm="needConfirm"
        :showLightBox="showAlert"
        :type="alertType"
        @closeAlert="$_guestEditor_alertHandler(false)"
        @deletePosts="$_guestEditor_deletePosts">
      </alert-panel>
    </base-light-box>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from '../../api/config'
  import {
    WORDING_TAB_FOLLOW_RECORD,
    WORDING_TAB_NEWS_RECORD,
    WORDING_TAB_REVIEW_RECORD
  } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import AppHeader from '../components/AppHeader.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PaginationNav from '../components/PaginationNav.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanel from '../components/PostPanel.vue'
  import Tab from '../components/Tab.vue'
  import TheControlBar from '../components/TheControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id })
  }

  const getFollowing = (store, { subject, resource, resourceType = '' }) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: subject,
      resource: resource,
      resource_type: resourceType
    })
  }

  const getPostsByUser = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {}
  }) => {
    return store.dispatch('GET_POSTS_BY_USER', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: where
      }
    })
  }

  const getPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params
    })
  }

  const unfollow = (store, resource, subject, object) => {
    return store.dispatch('PUBLISH_ACTION', {
      params: {
        action: 'unfollow',
        resource: resource,
        subject: subject,
        object: object
      }
    })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
  }

  export default {
    name: 'GuestEditor',
    components: {
      'alert-panel': AlertPanel,
      'app-about': About,
      'app-header': AppHeader,
      'app-tab': Tab,
      'control-bar': TheControlBar,
      'base-light-box': BaseLightBox,
      'following-list-tab': FollowingListInTab,
      'pagination-nav': PaginationNav,
      'post-list': PostList,
      'post-list-detailed': PostListDetailed,
      'post-list-tab': PostListInTab,
      'post-panel': PostPanel,
      AppAsideNav
    },
    data () {
      return {
        activePanel: 'records',
        activeTab: 'reviews',
        alertType: 'post',
        config: {
          type: POST_TYPE
        },
        followingResource: 'member',
        isPublishPostInEditor: false,
        itemsActive: undefined,
        itemsSelected: [],
        loading: false,
        needConfirm: false,
        page: DEFAULT_PAGE,
        post: {},
        postActiveChanged: false,
        postPanel: 'add',
        postType: POST_TYPE.REVIEW,
        sort: DEFAULT_SORT,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_NEWS_RECORD,
          WORDING_TAB_FOLLOW_RECORD
        ]
      }
    },
    computed: {
      followingByUser () {
        return _.get(this.$store, [ 'state', 'followingByUser' ], [])
      },
      itemsSelectedID () {
        const items = []
        _.forEach(this.itemsSelected, (item) => {
          items.push(item.id)
        })
        return items
      },
      posts () {
        return _.get(this.$store, [ 'state', 'posts' ], [])
      },
      postsDraft () {
        return _.get(this.$store, [ 'state', 'postsDraft' ], [])
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      tags () {
        return _.get(this.$store, [ 'state', 'tags' ], [])
      }
    },
    beforeMount () {
      this.loading = true
      Promise.all([
        getPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        }),
        getPostsCount(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        })
      ])
      .then(() => this.loading = false)
      .catch(() => this.loading = false)
    },
    methods: {
      $_guestEditor_addPost (params) {
        this.itemsSelected = []
        this.itemsSelected.push(params)
        addPost(this.$store, params)
          .then(() => {
            this.$_guestEditor_updatePostList({ needUpdateCount: true })
            this.showEditor = false
            this.itemsActive = params.active
            this.postActiveChanged = true
            this.needConfirm = false
            this.showAlert = true
          })
      },
      $_guestEditor_deletePost () {
        this.itemsActive = POST_ACTIVE.DEACTIVE
        this.postActiveChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      $_guestEditor_deletePosts () {
        deletePost(this.$store, this.itemsSelectedID)
          .then(() => {
            this.$_guestEditor_updatePostList({ needUpdateCount: true })
            this.showEditor = false
            this.showDraftList = false
            this.needConfirm = false
          })
      },
      $_guestEditor_filterHandler ({ sort = this.sort, page = this.page }) {
        switch (this.activePanel) {
          case 'records':
            return this.$_guestEditor_updatePostList({ sort: sort, page: page })
        }
      },
      $_guestEditor_openPanel (panel) {
        this.loading = true
        this.activePanel = panel
        this.sort = DEFAULT_SORT
        this.page = DEFAULT_PAGE
        switch (this.activePanel) {
          case 'records':
            this.alertType = 'post'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      $_guestEditor_showAlert (ids, itemsActive) {
        this.itemsSelected = []

        this.postActiveChanged = true
        this.isPublishPostInEditor = false
        this.itemsActive = itemsActive
        this.itemsSelected = _.filter(this.posts, (o) => {
          return _.includes(ids, o.id)
        })

        this.needConfirm = true
        this.showAlert = true
      },
      $_guestEditor_showDraftList (type) {
        this.loading = true
        switch (type) {
          case POST_TYPE.REVIEW:
            Promise.all([
              getPostsByUser(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  active: POST_ACTIVE.DRAFT,
                  type: POST_TYPE.REVIEW
                }
              }),
              getPostsCount(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  active: POST_ACTIVE.DRAFT,
                  type: POST_TYPE.REVIEW
                }
              })
            ])
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
          case POST_TYPE.NEWS:
            Promise.all([
              getPostsByUser(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  active: POST_ACTIVE.DRAFT,
                  type: POST_TYPE.NEWS
                }
              }),
              getPostsCount(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id' ]),
                  active: POST_ACTIVE.DRAFT,
                  type: POST_TYPE.NEWS
                }
              })
            ])
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
        }
      },
      $_guestEditor_showEditor ({ postPanel, id, postType }) {
        this.itemsSelected = []
        this.alertType = 'post'
        if (postPanel === 'add') {
          this.post = {}
          this.postType = postType
        } else {
          this.post = _.find(this.posts, { 'id': id }) || _.find(this.postsDraft, { 'id': id })
          this.postType = _.get(this.post, [ 'type' ])
          this.itemsSelected.push(this.post)
        }
        this.postPanel = postPanel
        this.showEditor = true
      },
      $_guestEditor_tabHandler (tab) {
        this.loading = true
        switch (tab) {
          case 0:
            this.activeTab = 'reviews'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 1:
            this.activeTab = 'news'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 2:
            this.activeTab = 'followings'
            getFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
              .then(() => this.loading = false)
              .catch(() => this.loading = false)
              break
        }
      },
      $_guestEditor_unfollow (resource, object) {
        const subject = _.get(this.profile, [ 'id' ]) 
        const objectID = object.toString()
        unfollow(this.$store, resource, subject, objectID) 
        .then(() => {
          setTimeout(() => this.$_guestEditor_updateFollowingList(), 1000)
        }) 
      },
      $_guestEditor_updateFollowingList (resource = this.followingResource) {
        this.followingResource = resource
        this.page = DEFAULT_PAGE
        switch (resource) {
          case 'review':
            return getFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'post', resourceType: resource })
          case 'news':
            return getFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'post', resourceType: resource })
          default:
            getFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
        }
      },
      $_guestEditor_updatePost(params, activeChanged) {
        this.itemsActive = params.active
        this.postActiveChanged = activeChanged
        updatePost(this.$store, params)
          .then(() => {
            this.$_guestEditor_updatePostList({})
            this.showEditor = false
            this.showDraftList = false
            this.showAlert = true
            this.needConfirm = false
          })
          .catch((err) => console.error(err))
      },
      $_guestEditor_updatePostList ({ sort, page, needUpdateCount = false }) {
        this.sort = sort || this.sort
        this.page = page || this.sort
        
        switch (this.activeTab) {
          case 'reviews':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            }
            getPostsByUser(this.$store, {
              page: this.page,
              where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
            })
            break
          case 'news':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
              })
            }
            getPostsByUser(this.$store, {
              page: this.page,
              where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
            })
            break
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .guestEditor
    background-color #e6e6e6
    width 100%
    min-height 100vh
    &__container
      max-width 1200px
      margin auto
      padding 25px 0
      display flex
    &__aside
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__record
      background-color #fff
</style>