<template>
  <div class="guestEditor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="guestEditor__container">
      <aside class="guestEditor__aside">
        <AppAsideNav/>
      </aside>
      <main class="guestEditor__main">
        <main class="main-container">
          <app-about :profile="profile"></app-about>
          <base-control-bar
            @addNews="$_guestEditor_textEditorHandler(true, 'add', config.type.news)"
            @addReview="$_guestEditor_textEditorHandler(true, 'add', config.type.review)"
            @editNews="$_guestEditor_showDraftList(config.type.news)"
            @editReview="$_guestEditor_showDraftList(config.type.review)"
            @openPanel="$_guestEditor_openPanel">
          </base-control-bar>
          <template v-if="activePanel === 'record'">
            <section class="guestEditor__record">
              <app-tab :tabs="tabs" @changeTab="$_guestEditor_tabHandler">
                <post-list-tab
                  slot="0"
                  :posts="reviewsByUser"
                  @deletePost="$_guestEditor_showAlert"
                  @editPost="$_guestEditor_textEditorHandler">
                </post-list-tab>
                <post-list-tab
                  slot="1"
                  :posts="newsByUser"
                  @deletePost="$_guestEditor_showAlert"
                  @editPost="$_guestEditor_textEditorHandler">
                </post-list-tab>
                <following-list-tab
                  slot="2"
                  :followingByUser="followingByUser"
                  @changeResource="$_guestEditor_followingHandler">
                </following-list-tab>
              </app-tab>
            </section>
          </template>
          <base-light-box :showLightBox.sync="showReviewsDraftList">
            <post-list-detailed
              :posts="newsDraftByUser"
              @editPost="$_guestEditor_textEditorHandler"
              @deletePost="$_guestEditor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showNewsDraftList">
            <post-list-detailed
              :posts="reviewsDraftByUser"
              @editPost="$_guestEditor_textEditorHandler"
              @deletePost="$_guestEditor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showEditor">
            <post-panel
              :action="action"
              :isCompleted="isCompleted"
              :post.sync="post"
              :showLightBox="showEditor"
              :type="postType"
              @closeLightBox="$_guestEditor_textEditorHandler(false)"
              @showAlert="$_guestEditor_alertHandler">
            </post-panel>
          </base-light-box>
          <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
            <alert-panel
              :action="action"
              :active="postActive"
              :isCompleted="isCompleted"
              :post="post"
              :showLightBox="showAlert"
              @closeAlert="$_guestEditor_alertHandler"
              @closeEditor="$_guestEditor_textEditorHandler(false)"
              @deletePost="$_guestEditor_deletePost">
            </alert-panel>
          </base-light-box>
        </main>
      </main>
    </div>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from '../../api/config'
  import {
    SECTIONS_DEFAULT,
    WORDING_TAB_REVIEW_RECORD,
    WORDING_TAB_NEWS_RECORD,
    WORDING_TAB_COMMENT_RECORD,
    WORDING_TAB_FOLLOW_RECORD
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
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const fetchPostsByUser = (store, {
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

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id })
  }

  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', {
        subject: params.subject,
        resource: params.resource
      })
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
        resource: params.resource,
        ids: params.ids
      })
    }
  }

  export default {
    name: 'GuestEditor',
    components: {
      'alert-panel': AlertPanel,
      'app-about': About,
      'app-header': AppHeader,
      'app-tab': Tab,
      'base-control-bar': TheBaseControlBar,
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
        action: undefined,
        activePanel: 'record',
        config: {
          active: POST_ACTIVE,
          type: POST_TYPE
        },
        isCompleted: false,
        pageNews: DEFAULT_PAGE,
        pageNewsDraft: DEFAULT_PAGE,
        pageReviews: DEFAULT_PAGE,
        pageReviewsDraft: DEFAULT_PAGE,
        post: {},
        postActive: undefined,
        postType: POST_TYPE.review,
        showAlert: false,
        showEditor: false,
        showNewsDraftList: false,
        showReviewsDraftList: false,
        sort: DEFAULT_SORT,
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_NEWS_RECORD,
          WORDING_TAB_FOLLOW_RECORD,
          WORDING_TAB_COMMENT_RECORD
        ]
      }
    },
    computed: {
      followingByUser () {
        return _.get(this.$store, [ 'state', 'followingByUser' ], [])
      },
      newsByUser () {
        return _.get(this.$store, [ 'state', 'newsByUser', 'items' ], [])
      },
      newsDraftByUser () {
        return _.get(this.$store, [ 'state', 'newsDraftByUser', 'items' ], [])
      },
      postsUnion () {
        return _.uniqBy(_.union(this.newsByUser, this.newsDraftByUser, this.reviewsByUser, this.reviewsDraftByUser), 'id')
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      reviewsByUser () {
        return _.get(this.$store, [ 'state', 'reviewsByUser', 'items' ], [])
      },
      reviewsDraftByUser () {
        return _.get(this.$store, [ 'state', 'reviewsDraftByUser', 'items' ], [])
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    mounted () {
      Promise.all([
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.news
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            active: POST_ACTIVE.draft,
            type: POST_TYPE.news
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.review
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            active: POST_ACTIVE.draft,
            type: POST_TYPE.review
          }
        }),
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
      ])
      
    },
    methods: {
      $_guestEditor_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_guestEditor_deletePost () {
        const id = _.get(this.post, [ 'id' ])
        deletePost(this.$store, id)
          .then(() => {
            if (this.showNewsDraftList || this.showReviewsDraftList) {
              this.showNewsDraftList = false
              this.showReviewsDraftList = false
            }
            this.$_guestEditor_updatePostList({ type: _.get(this.post, [ 'type' ])})
            this.isCompleted = true
          })
      },
      $_guestEditor_followingHandler (resource) {
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_guestEditor_openPanel (panel) {
        this.activePanel = panel
      },
      $_guestEditor_pageChanged (index) {
        this.$_guestEditor_updatePostList({ page: index })
      },
      $_guestEditor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_guestEditor_showDraftList (type) {
        if (type === POST_TYPE.review) {
          this.showReviewsDraftList = true
        } else if (type === POST_TYPE.news) {
          this.showNewsDraftList = true
        }
      },
      $_guestEditor_tabHandler (tab) {
        if (tab === 1) {
          fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
        }
      },
      $_guestEditor_textEditorHandler (showEditor, action, postType, id) {
        this.showEditor = showEditor
        this.isCompleted = false
        this.post = _.find(this.postsUnion, { 'id': id }) || {}

        if (!this.showEditor) {
          if (this.showNewsDraftList || this.showReviewsDraftList) {
            this.showNewsDraftList = false
            this.showReviewsDraftList = false
          }
          this.action = undefined
          this.isCompleted = true
          this.$_guestEditor_updatePostList({ type: this.postType })
        } else {
          this.action = action
          this.postType = postType
          if (action === 'add') {
            this.post.author = _.get(this.$store.state, [ 'profile' ])
          }
        }
      },
      $_guestEditor_updatePostList ({ type }) {
        if (type === POST_TYPE.review) {
          Promise.all([
            fetchPostsByUser(this.$store, {
              page: this.pageReviews,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                type: POST_TYPE.review
              }
            }),
            fetchPostsByUser(this.$store, {
              page: this.pageReviewsDraft,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.draft,
                type: POST_TYPE.review
              }
            })
          ])
        } else if (type === POST_TYPE.news) {
          Promise.all([
            fetchPostsByUser(this.$store, {
              page: this.pageNews,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                type: POST_TYPE.news
              }
            }),
            fetchPostsByUser(this.$store, {
              page: this.pageNewsDraft,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.draft,
                type: POST_TYPE.news
              }
            })
          ])
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
      padding 60px 0
      display flex
    &__aside
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__main
      margin-left 93.5px
    &__record
      background-color #fff
</style>