<template>
  <div class="admin">
    <div class="admin__container">
      <aside class="admin__aside">
        <AppAsideNav/>
      </aside>
      <main class="admin__main">
        <!-- <app-header :sections="sections"></app-header> -->
        <About :profile="profile"></About>
        <div class="control-bar">
          <TheControlBar
            @addAccount="addMember"
            @addNews="$_admin_textEditorHandler(true, 'add', config.type.NEWS)"
            @addReview="$_admin_textEditorHandler(true, 'add', config.type.REVIEW)"
            @editNews="$_admin_showDraftList(config.type.NEWS)"
            @editReview="$_admin_showDraftList(config.type.REVIEW)"
            @openPanel="openPanel">
          </TheControlBar>
        </div>
        <template v-if="activePanel === 'accounts'">
          <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
        </template>
        <template v-if="activePanel === 'records'">
          <section class="">
            <app-tab :tabs="tabs" @changeTab="$_admin_tabHandler">
              <PostListInTab
                slot="0"
                :posts="posts"
                @deletePost="$_admin_showAlert"
                @editPost="$_admin_textEditorHandler">
              </PostListInTab>
              <PostListInTab
                slot="1"
                :posts="posts"
                @deletePost="$_admin_showAlert"
                @editPost="$_admin_textEditorHandler">
              </PostListInTab>
              <FollowingListInTab
                slot="2"
                :followingByUser="followingByUser"
                @changeResource="$_admin_followingHandler"
                @unfollow="$_admin_unfollowingHandler">
              </FollowingListInTab>
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="panel">
            <PostList
              :posts="posts"
              @deleteMultiple="$_admin_deleteMultiple"
              @deletePost="$_admin_showAlert"
              @editPost="$_admin_textEditorHandler"
              @filterChanged="$_admin_updatePostList"
              @publishMultiple="$_admin_publishMultiple">
            </PostList>
          </section>
        </template>
        <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
          <MemberAccountEditor @updated="filterChanged" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showReviewsDraftList">
          <PostListDetailed
            :posts="postsDraft"
            @editPost="$_admin_textEditorHandler"
            @deletePost="$_admin_showAlert">
          </PostListDetailed>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showNewsDraftList">
          <PostListDetailed
            :posts="postsDraft"
            @editPost="$_admin_textEditorHandler"
            @deletePost="$_admin_showAlert">
          </PostListDetailed>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showEditor">
          <PostPanel
            :action="action"
            :isCompleted="isCompleted"
            :post.sync="post"
            :showLightBox="showEditor"
            :type="postType"
            @closeLightBox="$_admin_textEditorHandler(false)"
            @deletePost="$_admin_showAlert"
            @showAlert="$_admin_alertHandler">
          </PostPanel>
        </BaseLightBox>
        <BaseLightBox :isAlert="true" :showLightBox.sync="showAlert">
          <AlertPanel
            :action="action"
            :active="postActive"
            :isCompleted="isCompleted"
            :post="post"
            :posts="postsSelected"
            :showLightBox="showAlert"
            @closeAlert="$_admin_alertHandler"
            @closeEditor="$_admin_textEditorHandler(false)"
            @deletePost="$_admin_deletePost"
            @publishPost="$_admin_publishPost">
          </AlertPanel>
        </BaseLightBox>
      </main>
    </div>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE } from '../../api/config'
  import { SECTIONS_DEFAULT } from '../constants'
  import {
    WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER,
    WORDING_TAB_REVIEW_RECORD,
    WORDING_TAB_NEWS_RECORD,
    WORDING_TAB_FOLLOW_RECORD,
    WORDING_TAB_COMMENT_RECORD
  } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import AppHeader from '../components/AppHeader.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'
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

  const getMembers = (store, { page, sort }) => {
    return store.dispatch('GET_MEMBERS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT
      }
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
    components: {
      'app-header': AppHeader,
      'app-tab': Tab,
      About,
      AlertPanel,
      AppAsideNav,
      BaseLightBox,
      FollowingListInTab,
      MembersPanel,
      MemberAccountEditor,
      PostList,
      PostListDetailed,
      PostListInTab,
      PostPanel,
      TheControlBar
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
    data () {
      return {
        action: undefined,
        activePanel: 'accounts',
        activeTab: 'reviews',
        config: {
          active: POST_ACTIVE,
          type: POST_TYPE
        },
        currPage: 1,
        currPagePostsDraft: DEFAULT_PAGE,
        currSort: '-updated_at',
        isAlertMultiple: false,
        isCompleted: false,
        loading: false,
        post: {},
        postActive: undefined,
        postType: POST_TYPE.REVIEW,
        postsSelected: [],
        showAlert: false,
        showEditor: false,
        showLightBox: false,
        showNewsDraftList: false,
        showReviewsDraftList: false,
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_NEWS_RECORD,
          WORDING_TAB_FOLLOW_RECORD,
          WORDING_TAB_COMMENT_RECORD
        ],
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER,
        }
      }
    },
    name: 'admin-page',
    methods: {
      $_admin_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_admin_deleteMultiple (items) {
        this.action = 'edit'
        this.postActive = POST_ACTIVE.DEACTIVE
        this.postsSelected = _.filter(this.postsUnion, (o) => {
          return _.includes(items, o.id)
        })
        this.isAlertMultiple = true
        this.showAlert = true
      },
      $_admin_deletePost (isMultiple) {
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
              this.$_admin_updatePostList({ type: _.get(this.post, [ 'type' ]), needFetchCount: true })
              this.isCompleted = true
            })
        }
      },
      $_admin_followingHandler (resource) {
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_admin_publishMultiple (items) {
        this.action = 'edit'
        this.postActive = POST_ACTIVE.ACTIVE
        this.postsSelected = _.filter(this.postsUnion, (o) => {
          return _.includes(items, o.id)
        })
        this.isAlertMultiple = true
        this.showAlert = true
      },
      $_admin_publishPost (isMultiple) {
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
      $_admin_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = POST_ACTIVE.DEACTIVE
        this.isCompleted = false
        this.showAlert = true
      },
      $_admin_showDraftList (type) {
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
      $_admin_tabHandler (tab) {
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
      $_admin_textEditorHandler (showEditor, action, postType, id) {
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
      $_admin_unfollowingHandler (resource, object) {
        const subject = _.get(this.profile, [ 'id' ])
        const objectID = object.toString()
        unfollow(this.$store, resource, subject, objectID)
        .then(() => {
          fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
        })
      },
      $_admin_updatePostList ({ sort, type, needFetchCount = false }) {
        this.currSort = sort || this.currSort
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
      },
      addMember () {
        this.showLightBox = true
      },
      filterChanged (filter = {}) {
        this.currPage = filter.page || this.currPage
        this.currSort = filter.sort || this.currSort
        getMembers(this.$store, {
          page: this.currPage,
          sort: this.currSort
        })
      },
      openPanel (panel) {
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
    beforeMount () {
      this.$can('memberManage') && Promise.all([
        getMembers(this.$store, {}),
      ])
      fetchPosts(this.$store, {})
    }
  }
</script>
<style lang="stylus" scoped>
  .admin
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
    &__main
      margin-left 93.5px
    .control-bar
      width 100%
      margin 0 auto
    .panel
      width 100%
      padding 22px 84px 33px
      border 5px solid #d8ca21
      margin 0 auto
      background-color white
  @media (min-width 950px)
    .admin
      .control-bar
        max-width 950px
      .panel
        max-width 950px
</style>