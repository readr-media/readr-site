<template>
  <div class="editor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="editor__container">
      <aside class="editor__aside">
        <AppAsideNav/>
      </aside>
      <main class="editor__main">
        <main class="main-container">
          <app-about :profile="profile"></app-about>
          <base-control-bar
            @addNews="$_editor_textEditorHandler(true, 'add', config.type.news)"
            @addReview="$_editor_textEditorHandler(true, 'add', config.type.review)"
            @editNews="$_editor_showDraftList(config.type.news)"
            @editReview="$_editor_showDraftList(config.type.review)"
            @openPanel="$_editor_openPanel">
          </base-control-bar>
          <template v-if="activePanel === 'record'">
            <section class="editor__record">
              <app-tab :tabs="tabs" @changeTab="$_editor_tabHandler">
                <post-list-tab
                  slot="0"
                  :posts="reviewsByUser"
                  @deletePost="$_editor_showAlert"
                  @editPost="$_editor_textEditorHandler">
                </post-list-tab>
                <post-list-tab
                  slot="1"
                  :posts="newsByUser"
                  @deletePost="$_editor_showAlert"
                  @editPost="$_editor_textEditorHandler">
                </post-list-tab>
                <following-list-tab
                  slot="2"
                  :followingByUser="followingByUser"
                  @changeResource="$_editor_followingHandler">
                </following-list-tab>
              </app-tab>
            </section>
          </template>
          <template v-else-if="activePanel === 'posts'">
            <section class="main-panel">
              <pagination-nav :totalPages="10" @pageChanged="$_editor_pageChanged"></pagination-nav>
              <post-list
                :posts="posts"
                @deleteMultiple="$_editor_deleteMultiple"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_textEditorHandler"
                @filterChanged="$_editor_updatePostList"
                @publishMultiple="$_editor_publishMultiple">
              </post-list>
            </section>
          </template>
          <base-light-box :showLightBox.sync="showReviewsDraftList">
            <post-list-detailed
              :posts="newsDraftByUser"
              @editPost="$_editor_textEditorHandler"
              @deletePost="$_editor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showNewsDraftList">
            <post-list-detailed
              :posts="reviewsDraftByUser"
              @editPost="$_editor_textEditorHandler"
              @deletePost="$_editor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showEditor">
            <post-panel
              :action="action"
              :isCompleted="isCompleted"
              :post.sync="post"
              :showLightBox="showEditor"
              :type="postType"
              @closeLightBox="$_editor_textEditorHandler(false)"
              @deletePost="$_editor_showAlert"
              @showAlert="$_editor_alertHandler">
            </post-panel>
          </base-light-box>
          <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
            <alert-panel
              :action="action"
              :active="postActive"
              :isCompleted="isCompleted"
              :isMultiple="isAlertMultiple"
              :post="post"
              :posts="postsSelected"
              :showLightBox="showAlert"
              @closeAlert="$_editor_alertHandler"
              @closeEditor="$_editor_textEditorHandler(false)"
              @deletePost="$_editor_deletePost"
              @publishPost="$_editor_publishPost">
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

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
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

  const fetchPosts = (store, { page, sort }) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT
      }
    })
  }

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

  const deletePostSelf = (store, id) => {
    return store.dispatch('DELETE_POST_SELF', { id: id })
  }

  const deletePosts = (store, { params }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params
    })
  }

  const publishPosts = (store, params) => {
    return store.dispatch('PUBLISH_POSTS', { params })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
  }

  export default {
    name: 'AppEditor',
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
        isAlertMultiple: false,
        isCompleted: false,
        pageNews: DEFAULT_PAGE,
        pageNewsDraft: DEFAULT_PAGE,
        pagePost: DEFAULT_PAGE,
        pageReviews: DEFAULT_PAGE,
        pageReviewsDraft: DEFAULT_PAGE,
        post: {},
        postActive: undefined,
        postType: POST_TYPE.REVIEW,
        postsSelected: [],
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
      posts () {
        return _.get(this.$store, [ 'state', 'posts', 'items' ], [])
      },
      postsUnion () {
        return _.uniqBy(_.union(this.newsByUser, this.newsDraftByUser, this.posts, this.reviewsByUser, this.reviewsDraftByUser), 'id')
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
        fetchPosts(this.$store, {}),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.NEWS
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            active: POST_ACTIVE.DRAFT,
            type: POST_TYPE.NEWS
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        }),
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            active: POST_ACTIVE.DRAFT,
            type: POST_TYPE.REVIEW
          }
        }),
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
      ])
    },
    methods: {
      $_editor_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_editor_deleteMultiple (items) {
        this.action = 'edit'
        this.postActive = POST_ACTIVE.DEACTIVE
        this.postsSelected = _.filter(this.postsUnion, (o) => {
          return _.includes(items, o.id)
        })
        this.isAlertMultiple = true
        this.showAlert = true
      },
      $_editor_deletePost (isMultiple) {
        if (isMultiple) {
          const items = []
          _.forEach(this.postsSelected, (post) => {
            items.push(post.id)
          })
          deletePosts(this.$store, {
            params: {
              ids: items,
              updated_by: _.get(this.$store.state, [ 'profile', 'id' ])
            }
          }).then(() => {
            this.isCompleted = true
          })
        } else {
          const id = _.get(this.post, [ 'id' ])
          deletePostSelf(this.$store, id)
            .then(() => {
              if (this.showNewsDraftList || this.showReviewsDraftList) {
                this.showNewsDraftList = false
                this.showReviewsDraftList = false
              }
              this.$_editor_updatePostList({ type: _.get(this.post, [ 'type' ])})
              this.isCompleted = true
            })
        }
      },
      $_editor_followingHandler (resource) {
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_editor_openPanel (panel) {
        this.activePanel = panel
      },
      $_editor_pageChanged (index) {
        // this.$_editor_updatePostList({ page: index })
      },
      $_editor_publishMultiple (items) {
        this.action = 'edit'
        this.postActive = POST_ACTIVE.ACTIVE
        this.postsSelected = _.filter(this.postsUnion, (o) => {
          return _.includes(items, o.id)
        })
        this.isAlertMultiple = true
        this.showAlert = true
      },
      $_editor_publishPost (isMultiple) {
        const params = {}
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])
        if (isMultiple) {
          params.ids = []
          _.forEach(this.postsSelected, (post) => {
            params.ids.push(post.id)
          })
          publishPosts(this.$store, params)
            .then(() => {
              this.isCompleted = true
            })
        } else {
          params.active = 1
          params.content = _.get(this.post, [ 'content' ])
          params.link = _.get(this.post, [ 'link' ])
          params.og_description = _.get(this.post, [ 'ogDescription' ])
          params.og_image = _.get(this.post, [ 'ogImage' ])
          params.og_title = _.get(this.post, [ 'ogTitle' ]) || _.get(this.post, [ 'title' ])
          params.title = _.get(this.post, [ 'title' ])

          if (Date.parse(_.get(this.post, [ 'date' ]))) {
            params.published_at = _.get(this.post, [ 'date' ])
          }

          if (this.action === 'add') {
            params.author = _.get(this.$store.state, [ 'profile', 'id' ])
            addPost(this.$store, params)
              .then(() => {
                this.isCompleted = true
              })
          } else if (this.action === 'edit') {
            params.id = _.get(this.post, [ 'id' ])
            params.author = _.get(this.post, [ 'author', 'id' ])
            updatePost(this.$store, params)
              .then(() => {
                this.isCompleted = true
              })
          }
        }
      },
      $_editor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = POST_ACTIVE.DEACTIVE
        this.isCompleted = false
        this.showAlert = true
      },
      $_editor_showDraftList (type) {
        if (type === POST_TYPE.REVIEW) {
          this.showReviewsDraftList = true
        } else if (type === POST_TYPE.NEWS) {
          this.showNewsDraftList = true
        }
      },
      $_editor_tabHandler (tab) {
        if (tab === 1) {
          fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
        }
      },
      $_editor_textEditorHandler (showEditor, action, postType, id) {
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
          this.$_editor_updatePostList({ type: this.postType })
        } else {
          this.action = action
          this.postType = postType
          if (this.action === 'add') {
            this.post.author = _.get(this.$store.state, [ 'profile' ])
          }
        }
      },
      $_editor_updatePostList ({ sort, type }) {
        this.sort = sort || this.sort
        fetchPosts(this.$store, {
          page: this.pagePost,
          sort: this.sort
        })

        if (type === POST_TYPE.REVIEW) {
          Promise.all([
            fetchPostsByUser(this.$store, {
              page: this.pageReviews,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                type: POST_TYPE.REVIEW
              }
            }),
            fetchPostsByUser(this.$store, {
              page: this.pageReviewsDraft,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.REVIEW
              }
            })
          ])
        } else if (type === POST_TYPE.NEWS) {
          Promise.all([
            fetchPostsByUser(this.$store, {
              page: this.pageNews,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                type: POST_TYPE.NEWS
              }
            }),
            fetchPostsByUser(this.$store, {
              page: this.pageNewsDraft,
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.NEWS
              }
            })
          ])
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .editor
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
  .main-panel
    background-color white
</style>