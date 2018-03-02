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
          @addVideo="$_editor_showEditor({ postPanel: 'add', postType: config.type.VIDEO })"
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
                @editPost="$_editor_showEditor"
                @filterChanged="$_editor_filterHandler">
              </post-list-tab>
              <post-list-tab
                slot="1"
                :posts="posts"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_showEditor"
                @filterChanged="$_editor_filterHandler">
              </post-list-tab>
              <following-list-tab
                slot="2"
                :currentResource="followingResource"
                :followingByUser="followingByUser"
                @changeResource="$_editor_followingHandler">
              </following-list-tab>
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="main-panel">
            <post-list
              :maxResult="20"
              :posts="posts"
              :sort="sort"
              @deletePosts="$_editor_showAlert"
              @editPost="$_editor_showEditor"
              @filterChanged="$_editor_filterHandler"
              @publishPosts="$_editor_showAlert">
            </post-list>
          </section>
        </template>
        <template v-else-if="activePanel === 'tags'">
          <section class="main-panel">
            <tag-list
              :maxResult="20"
              :sort="sort"
              :tags="tags"
              @addTag="$_editor_addTag"
              @deleteTags="$_editor_showAlert"
              @filterChanged="$_editor_filterHandler"
              @updateTagList="$_editor_updateTagList({})">
            </tag-list>
          </section>
        </template>
        <template v-else-if="activePanel === 'videos'">
          <section class="main-panel">
            <video-list
              :maxResult="20"
              :posts="posts"
              :sort="sort"
              @deletePosts="$_editor_showAlert"
              @editPost="$_editor_showEditor"
              @filterChanged="$_editor_filterHandler"
              @publishPosts="$_editor_showAlert">
            </video-list>
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
        v-if="showEditor"
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
    WORDING_TAB_COMMENT_RECORD,
    WORDING_TAB_FOLLOW_RECORD,
    WORDING_TAB_NEWS_RECORD,
    WORDING_TAB_REVIEW_RECORD
  } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanelB from '../components/AlertPanel.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanelB from '../components/PostPanel.vue'
  import Tab from '../components/Tab.vue'
  import TagList from '../components/TagList.vue'
  import TheControlBar from '../components/TheControlBar.vue'
  import VideoList from '../components/VideoList.vue'

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

  const getFollowing = (store, params) => {
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

  const getPosts = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {}
  } = {}) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: where
      }
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

  const getTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    keyword = '',
    stats = false
  }) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sort: sort,
        keyword: keyword,
        stats: stats
      }
    })
  }

  const getTagsCount = (store) => {
    return store.dispatch('GET_TAGS_COUNT')
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
      'alert-panel': AlertPanelB,
      'app-about': About,
      'app-tab': Tab,
      'base-light-box': BaseLightBox,
      'control-bar': TheControlBar,
      'following-list-tab': FollowingListInTab,
      'post-list': PostList,
      'post-list-detailed': PostListDetailed,
      'post-list-tab': PostListInTab,
      'post-panel': PostPanelB,
      'tag-list': TagList,
      'video-list': VideoList,
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
              this.$_editor_updatePostList({ needUpdateCount: true })
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
            this.$_editor_updateTagList({ needUpdateCount: true })
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
          this.$_editor_updatePostList({ needUpdateCount: true })
          this.showEditor = false
          this.showDraftList = false
          this.needConfirm = false
        })
      },
      $_editor_deleteTags () {
        deleteTags(this.$store, this.itemsSelectedID)
          .then(() => {
            this.$_editor_updateTagList({ needUpdateCount: true })
            this.needConfirm = false
          })
      },
      $_editor_filterHandler ({ sort = this.sort, page = this.page }) {
        switch (this.activePanel) {
          case 'records':
          case 'posts':
          case 'videos':
            return this.$_editor_updatePostList({ sort: sort, page: page })
          case 'tags':
            return this.$_editor_updateTagList({ sort: sort, page: page })
        }
      },
      $_editor_followingHandler (resource) {
        this.followingResource = resource
        this.page = DEFAULT_PAGE
        getFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_editor_openPanel (panel) {
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
          case 'posts':
            this.alertType = 'post'
            Promise.all([
              getPosts(this.$store, {
                where: { active: [ POST_ACTIVE.ACTIVE, POST_ACTIVE.PENDING ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS ] }
              }),
              getPostsCount(this.$store, {
                where: { active: [ POST_ACTIVE.ACTIVE, POST_ACTIVE.PENDING ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS ] }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'tags':
            this.alertType = 'tag'
            Promise.all([
              getTags(this.$store, { stats: true }),
              getTagsCount(this.$store)
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            this.alertType = 'video'
            Promise.all([
              getPosts(this.$store, {
                where: { type: POST_TYPE.VIDEO }
              }),
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO }
              })
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
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
                this.$_editor_updatePostList({ needUpdateCount: true })
                this.showEditor = false
                this.needConfirm = false
              })
          } else {
            updatePost(this.$store, this.postForPublishInEditor)
              .then(() => {
                this.$_editor_updatePostList({ needUpdateCount: false })
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
              this.$_editor_updatePostList({ needUpdateCount: true })
              this.needConfirm = false
            })
        }
      },
      $_editor_showAlert (ids, itemsActive) {
        this.itemsSelected = []
        switch (this.alertType) {
          case 'post':
          case 'video':
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
      $_editor_showEditor ({ postPanel, id, postType }) {
        this.itemsSelected = []
        this.alertType = 'post'

        if (this.activePanel === 'videos') {
          this.alertType = 'video'
        }

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
      $_editor_tabHandler (tab) {
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
      $_editor_updatePostList ({ sort, page, needUpdateCount = false }) {
        this.sort = sort || this.sort
        this.page = page || this.sort
        switch (this.activePanel) {
          case 'records':
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
            break
          case 'posts':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { active: [ POST_ACTIVE.ACTIVE, POST_ACTIVE.PENDING ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS ] }
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { active: [ POST_ACTIVE.ACTIVE, POST_ACTIVE.PENDING ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS ] }
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO }
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { type: POST_TYPE.VIDEO }
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      $_editor_updateTagList ({ sort, page, needUpdateCount = false }) {
        this.sort = sort || this.sort
        this.page = page || this.sort
        if (needUpdateCount) {
          getTagsCount(this.$store)
        }
        getTags(this.$store, {
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