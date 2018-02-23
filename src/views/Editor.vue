<template>
  <div class="editor">
    <div class="editor__container">
      <aside class="editor__aside">
        <AppAsideNav/>
      </aside>
      <main class="main-container">
        <app-about :profile="profile"></app-about>
        <control-bar
          @addNews="$_editor_showEditor({ postPanel: 'add', postType: config.type.NEWS })"
          @addReview="$_editor_showEditor({ postPanel: 'add', postType: config.type.REVIEW })"
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
                @editPost="$_editor_showEditor">
              </post-list-tab>
              <post-list-tab
                slot="1"
                :posts="posts"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_showEditor">
              </post-list-tab>
              <CommentManagement slot="3"></CommentManagement>
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="main-panel">
            <post-list
              :maxResult="20"
              :posts="posts"
              @deletePosts="$_editor_showAlert"
              @editPost="$_editor_showEditor"
              @publishPosts="$_editor_showAlert">
            </post-list>
          </section>
        </template>
        <template v-else-if="activePanel === 'tags'">
          <section class="main-panel">
            <tag-list
              :maxResult="20"
              :tags="tags"
              @addTag="$_editor_addTag"
              @deleteTags="$_editor_showAlert"
              @updateTagList="$_editor_updateTagList({})">
            </tag-list>
          </section>
        </template>
      </main>
    </div>
    <base-light-box :showLightBox.sync="showDraftList">
      <post-list-detailed
        :posts="postsDraft"
        @deletePost="$_editor_showAlert"
        @editPost="$_editor_showEditor">
      </post-list-detailed>
    </base-light-box>
    <base-light-box :showLightBox.sync="showEditor">
      <post-panel
        :post="post"
        :panelType="postPanel"
        :postType="postType"
        @addPost="$_editor_addPost"
        @deletePost="$_editor_deletePost"
        @publishPost="$_editor_publishPost"
        @updatePost="$_editor_updatePost">
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
        @deletePosts="$_editor_deletePosts"
        @deleteTags="$_editor_deleteTags"
        @closeAlert="$_editor_alertHandler(false)"
        @publishPosts="$_editor_publishPostHandler">
      </alert-panel>
    </base-light-box>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE, TAG_ACTIVE } from '../../api/config'
  import {
    WORDING_TAB_REVIEW_RECORD,
    WORDING_TAB_NEWS_RECORD,
    WORDING_TAB_COMMENT_RECORD,
    WORDING_TAB_FOLLOW_RECORD
  } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanelB from '../components/AlertPanelB.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import CommentManagement from '../components/comment/CommentManagement.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanelB from '../components/PostPanelB.vue'
  import Tab from '../components/Tab.vue'
  import TagList from '../components/TagList.vue'
  import TheControlBar from '../components/TheControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const addTags = (store, text = '') => {
    return store.dispatch('ADD_TAGS', {
      params: {
        text: text,
        updated_by: _.get(store, [ 'state', 'profile', 'id' ])
      }
    })
  }

  const deletePosts = (store, { params }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params
    })
  }

  const deleteTags = (store, ids = []) => {
    return store.dispatch('DELETE_TAGS', {
      params: {
        ids: ids,
        updated_by: _.get(store, [ 'state', 'profile', 'id' ])
      }
    })
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

  const fetchTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sorting = DEFAULT_SORT,
    keyword = '',
    stats = false
  }) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sorting: sorting,
        keyword: keyword,
        stats: stats
      }
    })
  }

  const fetchTagsCount = (store) => {
    return store.dispatch('GET_TAGS_COUNT')
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
      'alert-panel': AlertPanelB,
      'app-about': About,
      'app-tab': Tab,
      'base-light-box': BaseLightBox,
      'control-bar': TheControlBar,
      'post-list': PostList,
      'post-list-detailed': PostListDetailed,
      'post-list-tab': PostListInTab,
      'post-panel': PostPanelB,
      'tag-list': TagList,
      AppAsideNav,
      CommentManagement
    },
    data () {
      return {
        activePanel: 'records',
        activeTab: 'reviews',
        alertType: 'post',
        config: {
          type: POST_TYPE
        },
        isPublishPostInEditor: false,
        itemsActive: undefined,
        itemsSelected: [],
        loading: true,
        needConfirm: false,
        page: DEFAULT_PAGE,
        post: {},
        postActiveChanged: false,
        postForPublishInEditor: {},
        postPanel: 'add',
        postType: POST_TYPE.REVIEW,
        sort: DEFAULT_SORT,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        tabs: [
          WORDING_TAB_REVIEW_RECORD,
          WORDING_TAB_NEWS_RECORD,
          WORDING_TAB_FOLLOW_RECORD,
          WORDING_TAB_COMMENT_RECORD
        ]
      }
    },
    computed: {
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
      $_editor_addPost (params) {
        this.itemsSelected = []
        this.itemsSelected.push(params)
        if (params.active === POST_ACTIVE.ACTIVE) {
          this.postForPublishInEditor = params
          this.isPublishPostInEditor = true
          this.itemsActive = params.active
          this.postActiveChanged = true
          this.needConfirm = true
          this.showAlert = true
        } else {
          addPost(this.$store, params)
            .then(() => {
              this.$_editor_updatePostList({ needFetchCount: true })
              this.showEditor = false
              this.itemsActive = params.active
              this.postActiveChanged = true
              this.needConfirm = false
              this.showAlert = true
            })
        }
      },
      $_editor_addTag (tagName) {
        this.itemsActive = TAG_ACTIVE.ACTIVE
        this.needConfirm = false
        this.loading = true
        addTags(this.$store, tagName)
        .then(() => {
          this.$_editor_updateTagList({ needFetchCount: true })
          this.showAlert = true
        })
        .catch(() => this.loading = false)
      },
      $_editor_alertHandler (showAlert) {
        this.showAlert = showAlert
      },
      $_editor_deletePost () {
        this.itemsActive = POST_ACTIVE.DEACTIVE
        this.postActiveChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      $_editor_deletePosts () {
        deletePosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: _.get(this.$store.state, [ 'profile', 'id' ])
          }
        }).then(() => {
          this.$_editor_updatePostList({ needFetchCount: true })
          this.showEditor = false
          this.showDraftList = false
          this.needConfirm = false
        })
      },
      $_editor_deleteTags () {
        deleteTags(this.$store, this.itemsSelectedID)
          .then(() => {
            this.$_editor_updateTagList({ needFetchCount: true })
            this.needConfirm = false
          })
      },
      $_editor_openPanel (panel) {
        this.loading = true
        this.activePanel = panel
        switch (this.activePanel) {
          case 'records':
            this.alertType = 'post'
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
            this.alertType = 'post'
            Promise.all([
              fetchPosts(this.$store, {}),
              fetchPostsCount(this.$store, {})
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'tags':
            this.alertType = 'tag'
            Promise.all([
              fetchTags(this.$store, { stats: true }),
              fetchTagsCount(this.$store)
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
        }
      },
      $_editor_publishPost (params) {
        this.postForPublishInEditor = params
        this.isPublishPostInEditor = true
        this.itemsActive = params.active
        this.postActiveChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      $_editor_publishPostHandler () {
        if (this.isPublishPostInEditor) {
          if (this.postPanel === 'add') {
            addPost(this.$store, this.postForPublishInEditor)
              .then(() => {
                this.$_editor_updatePostList({ needFetchCount: true })
                this.showEditor = false
                this.needConfirm = false
              })
          } else {
            updatePost(this.$store, this.postForPublishInEditor)
              .then(() => {
                this.$_editor_updatePostList({ needFetchCount: false })
                this.showEditor = false
                this.showDraftList = false
                this.needConfirm = false
              })
          }
        } else {
          const params = {}
          params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])
          params.ids = this.itemsSelectedID
          publishPosts(this.$store, params)
            .then(() => {
              this.$_editor_updatePostList({ needFetchCount: true })
              this.needConfirm = false
            })
        }
      },
      $_editor_showAlert (ids, itemsActive) {
        this.itemsSelected = []
        switch (this.alertType) {
          case 'post':
            this.postActiveChanged = true
            this.isPublishPostInEditor = false
            this.itemsActive = itemsActive
            this.itemsSelected = _.filter(this.posts, (o) => {
              return _.includes(ids, o.id)
            })
            break
          case 'tag':
            this.itemsActive = TAG_ACTIVE.DEACTIVE
            this.itemsSelected = _.filter(this.tags, (o) => {
              return _.includes(ids, o.id)
            })
            break
        }
        this.needConfirm = true
        this.showAlert = true
      },
      $_editor_showDraftList (type) {
        this.loading = true
        switch (type) {
          case POST_TYPE.REVIEW:
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
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
          case POST_TYPE.NEWS:
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
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
        }
      },
      $_editor_showEditor ({ postPanel, id, postType }) {
        this.itemsSelected = []
        this.alertType = 'post'
        if (postPanel === 'add') {
          this.post = {}
          this.postType = postType
        } else {
          this.post = _.find(this.posts, { 'id': id })
          this.postType = _.get(this.post, [ 'type' ])
          this.itemsSelected.push(this.post)
        }
        this.postPanel = postPanel
        this.showEditor = true
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
        }
      },
      $_editor_updatePost(params, activeChanged) {
        this.itemsActive = params.active
        this.postActiveChanged = activeChanged
        updatePost(this.$store, params)
          .then(() => {
            this.$_editor_updatePostList({})
            this.showEditor = false
            this.showDraftList = false
            this.showAlert = true
            this.needConfirm = false
          })
          .catch((err) => console.error(err))
      },
      $_editor_updatePostList ({ sort, needFetchCount = false }) {
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

        }
        
      },
      $_editor_updateTagList ({ sort, needFetchCount = false }) {
        if (needFetchCount) {
          fetchTagsCount(this.$store)
        }
        fetchTags(this.$store, {
          page: this.page,
          sort: this.sort,
          stats: true
        })
        .then(() => this.loading = false)
        .catch(() => this.loading = false)
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