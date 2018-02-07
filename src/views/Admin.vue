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
          <TheBaseControlBar
            @addAccount="addMember"
            @addNews="$_admin_textEditorHandler(true, 'add', config.type.NEWS)"
            @addReview="$_admin_textEditorHandler(true, 'add', config.type.REVIEW)"
            @editNews="$_admin_showDraftList(config.type.NEWS)"
            @editReview="$_admin_showDraftList(config.type.REVIEW)"
            @openPanel="openPanel">
          </TheBaseControlBar>
        </div>
        <template v-if="activePanel === 'accounts'">
          <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
        </template>
        <template v-if="activePanel === 'record'">
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="panel">
            <PostList
              :posts="posts"
              @deletePost="$_admin_showAlert"
              @editPost="$_admin_textEditorHandler"
              @filterChanged="$_admin_updatePostList">
            </PostList>
          </section>
        </template>
        <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
          <MemberAccountEditor @updated="filterChanged" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showReviewsDraftList">
          <PostListDetailed
            :posts="newsDraftByUser"
            @editPost="$_admin_textEditorHandler"
            @deletePost="$_admin_showAlert">
          </PostListDetailed>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showNewsDraftList">
          <PostListDetailed
            :posts="reviewsDraftByUser"
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
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER } from '../constants'
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
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
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

  const fetchPostsByUser = (store, { maxResult, page, sort, where }) => {
    return store.dispatch('GET_POSTS_BY_USER', {
      params: {
        max_result: maxResult || MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT,
        where: where || {}
      }
    })
  }

  const deletePostSelf = (store, id) => {
    return store.dispatch('DELETE_POST_SELF', { id: id })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
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

  export default {
    components: {
      'app-header': AppHeader,
      About,
      AlertPanel,
      AppAsideNav,
      BaseLightBox,
      MembersPanel,
      MemberAccountEditor,
      PostList,
      PostListDetailed,
      PostListInTab,
      PostPanel,
      TheBaseControlBar
    },
    computed: {
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
    data () {
      return {
        action: undefined,
        activePanel: 'accounts',
        config: {
          active: POST_ACTIVE,
          type: POST_TYPE
        },
        currPage: 1,
        currSort: '-updated_at',
        isCompleted: false,
        pageNews: DEFAULT_PAGE,
        pageNewsDraft: DEFAULT_PAGE,
        pagePost: DEFAULT_PAGE,
        pageReviews: DEFAULT_PAGE,
        pageReviewsDraft: DEFAULT_PAGE,
        post: {},
        postActive: undefined,
        postType: POST_TYPE.REVIEW,
        showAlert: false,
        showEditor: false,
        showLightBox: false,
        showNewsDraftList: false,
        showReviewsDraftList: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER
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
      $_admin_deletePost () {
        const id = _.get(this.post, [ 'id' ])
        deletePostSelf(this.$store, id)
          .then(() => {
            if (this.showNewsDraftList || this.showReviewsDraftList) {
              this.showNewsDraftList = false
              this.showReviewsDraftList = false
            }
            this.$_admin_updatePostList({ type: _.get(this.post, [ 'type' ])})
            this.isCompleted = true
          })
      },
      $_admin_publishPost () {
        const params = {}
        params.active = 1
        params.content = _.get(this.post, [ 'content' ])
        params.link = _.get(this.post, [ 'link' ])
        params.og_description = _.get(this.post, [ 'ogDescription' ])
        params.og_image = _.get(this.post, [ 'ogImage' ])
        params.og_title = _.get(this.post, [ 'ogTitle' ]) || _.get(this.post, [ 'title' ])
        params.title = _.get(this.post, [ 'title' ])
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])

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
      },
      $_admin_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_admin_showDraftList (type) {
        if (type === POST_TYPE.REVIEW) {
          this.showReviewsDraftList = true
        } else if (type === POST_TYPE.NEWS) {
          this.showNewsDraftList = true
        }
      },
      $_admin_textEditorHandler (showEditor, action, postType, id) {
        this.showEditor = showEditor
        this.isCompleted = false
        this.post = _.find(this.posts, { 'id': id }) || {}

        if (!this.showEditor) {
          if (this.showNewsDraftList || this.showReviewsDraftList) {
            this.showNewsDraftList = false
            this.showReviewsDraftList = false
          }
          this.action = undefined
          this.isCompleted = true
          this.$_admin_updatePostList({ type: this.postType })
        } else {
          this.action = action
          this.postType = postType
          if (this.action === 'add') {
            this.post.author = _.get(this.$store.state, [ 'profile' ])
          }
        }
      },
      $_admin_updatePostList ({ sort, type }) {
        this.currSort = sort
        fetchPosts(this.$store, {
          page: this.pagePost,
          sort: this.currSort
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
        this.activePanel = panel
      }
    },
    mounted () {
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
      })
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