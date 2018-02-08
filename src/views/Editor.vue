<template>
  <div class="editor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="editor__container">
      <aside class="editor__aside">
        <AppAsideNav/>
      </aside>
      <main class="main-container">
        <app-about :profile="profile"></app-about>
        <control-bar
          @addNews="$_editor_textEditorHandler(true, 'add', config.type.NEWS)"
          @addReview="$_editor_textEditorHandler(true, 'add', config.type.REVIEW)"
          @editNews="$_editor_showDraftList(config.type.NEWS)"
          @editReview="$_editor_showDraftList(config.type.REVIEW)"
          @openPanel="$_editor_openPanel">
        </control-bar>
        <template v-if="activePanel === 'records'">
          <section class="editor__record">
            <app-tab :tabs="tabs" @changeTab="$_editor_tabHandler">
              <post-list-tab
                slot="0"
                :posts="posts"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_textEditorHandler">
              </post-list-tab>
              <post-list-tab
                slot="1"
                :posts="posts"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_textEditorHandler">
              </post-list-tab>
              <following-list-tab
                slot="2"
                :followingByUser="followingByUser"
                @changeResource="$_editor_followingHandler"
                @unfollow="$_editor_unfollowingHandler">
              </following-list-tab>
              <CommentManagement slot="3"></CommentManagement>
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="main-panel">
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
            :posts="postsDraft"
            @editPost="$_editor_textEditorHandler"
            @deletePost="$_editor_showAlert">
          </post-list-detailed>
        </base-light-box>
        <base-light-box :showLightBox.sync="showNewsDraftList">
          <post-list-detailed
            :posts="postsDraft"
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
  import CommentManagement from '../components/comment/CommentManagement.vue'
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

  const deletePostSelf = (store, id) => {
    return store.dispatch('DELETE_POST_SELF', { id: id })
  }

  const deletePosts = (store, { params }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params
    })
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

  const fetchPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params
    })
  }

  const publishPosts = (store, params) => {
    return store.dispatch('PUBLISH_POSTS', { params })
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
    name: 'AppEditor',
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
      AppAsideNav,
      CommentManagement
    },
    data () {
      return {
        action: undefined,
        activePanel: 'records',
        activeTab: 'reviews',
        config: {
          active: POST_ACTIVE,
          type: POST_TYPE
        },
        isAlertMultiple: false,
        isCompleted: false,
        loading: false,
        page: DEFAULT_PAGE,
        pagePostsDraft: DEFAULT_PAGE,
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
      posts () {
        return _.get(this.$store, [ 'state', 'posts' ], [])
      },
      postsDraft () {
        return _.get(this.$store, [ 'state', 'postsDraft' ], [])
      },
      postsUnion () {
        return _.uniqBy(this.posts, 'id')
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    mounted () {
      this.loading = true
      Promise.all([
        fetchPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            type: POST_TYPE.REVIEW
          }
        }),
        fetchPostsCount(this.$store, {
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
              this.$_editor_updatePostList({ type: _.get(this.post, [ 'type' ]), needFetchCount: true })
              this.isCompleted = true
            })
        }
      },
      $_editor_followingHandler (resource) {
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_editor_openPanel (panel) {
        this.loading = true
        this.activePanel = panel
        switch (this.activePanel) {
          case 'records':
            Promise.all([
              fetchPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              fetchPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'posts':
            Promise.all([
              fetchPosts(this.$store, {}),
              fetchPostsCount(this.$store, {})
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          default:
            Promise.all([
              fetchPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              fetchPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
        }
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
        this.loading = true
        if (type === POST_TYPE.REVIEW) {
          this.showReviewsDraftList = true
          Promise.all([
            fetchPostsByUser(this.$store, {
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.REVIEW
              }
            }),
            fetchPostsCount(this.$store, {
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.REVIEW
              }
            })
          ])
          .then(() => this.loading = false)
          .catch(() => this.loading = false)
        } else if (type === POST_TYPE.NEWS) {
          this.showNewsDraftList = true
          Promise.all([
            fetchPostsByUser(this.$store, {
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.NEWS
              }
            }),
            fetchPostsCount(this.$store, {
              where: {
                author: _.get(this.profile, [ 'id' ]),
                active: POST_ACTIVE.DRAFT,
                type: POST_TYPE.NEWS
              }
            })
          ])
          .then(() => this.loading = false)
          .catch(() => this.loading = false)
        }
      },
      $_editor_tabHandler (tab) {
        this.loading = true
        switch (tab) {
          case 0:
            this.activeTab = 'reviews'
            Promise.all([
              fetchPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              fetchPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 1:
            this.activeTab = 'news'
            Promise.all([
              fetchPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
              }),
              fetchPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 2:
            this.activeTab = 'followings'
            fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          default:
            this.activeTab = 'reviews'
            Promise.all([
              fetchPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              }),
              fetchPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
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
          if (this.action === 'add') {
            this.$_editor_updatePostList({ type: this.postType, needFetchCount: true })
          } else {
            this.$_editor_updatePostList({ type: this.postType })
          }
          this.action = undefined
          this.isCompleted = true
        } else {
          this.action = action
          this.postType = postType
          if (this.action === 'add') {
            this.post.author = _.get(this.$store.state, [ 'profile' ])
          }
        }
      },
      $_editor_unfollowingHandler (resource, object) {
        const subject = _.get(this.profile, [ 'id' ])
        const objectID = object.toString()
        unfollow(this.$store, resource, subject, objectID)
        .then(() => {
          fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
        })
      },
      $_editor_updatePostList ({ sort, type, needFetchCount = false }) {
        this.sort = sort || this.sort
        switch (this.activePanel) {
          case 'records':
            switch (this.activeTab) {
              case 'reviews':
                if (needFetchCount) {
                  fetchPostsCount(this.$store, {
                    where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
                  })
                }
                fetchPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
                })
                break
              case 'news':
                if (needFetchCount) {
                  fetchPostsCount(this.$store, {
                    where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
                  })
                }
                fetchPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.NEWS }
                })
                break
              case 'followings':
                fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
              default:
                Promise.all([
                  fetchPostsCount(this.$store, {
                    where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
                  }),
                  fetchPostsByUser(this.$store, {
                    page: this.page,
                    where: { author: _.get(this.profile, [ 'id' ]), type: POST_TYPE.REVIEW }
                  })
                ])
            }
            break
          case 'posts':
            if (needFetchCount) {
              fetchPostsCount(this.$store, {})
            }
            fetchPosts(this.$store, {
              page: this.page,
              sort: this.sort
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          default:
            Promise.all([
              fetchPosts(this.$store, {
                page: this.page,
                sort: this.sort
              }),
              fetchPostsCount(this.$store, {})
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .editor
    width 100%
    min-height 100vh
    &__container
      padding-top 37px
    &__aside
      display none
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__record
      background-color #fff

  @media (min-width 950px)
    .editor
      &__container
        max-width 1200px
        margin auto
        padding 60px 0
        display flex
      &__aside
        display block
</style>