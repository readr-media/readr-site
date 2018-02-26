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
            @addNews="showEditorHandler({ postPanel: 'add', postType: config.type.NEWS })"
            @addReview="showEditorHandler({ postPanel: 'add', postType: config.type.REVIEW })"
            @editNews="showDraftListHandler(config.type.NEWS)"
            @editReview="showDraftListHandler(config.type.REVIEW)"
            @openPanel="openPanel">
          </TheControlBar>
        </div>
        <template v-if="activePanel === 'accounts'">
          <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
        </template>
        <template v-if="activePanel === 'records'">
          <section class="">
            <app-tab :tabs="tabs" @changeTab="tabHandler">
              <PostListInTab
                slot="0"
                :posts="posts"
                @deletePost="showAlertHandler"
                @editPost="showEditorHandler">
              </PostListInTab>
              <PostListInTab
                slot="1"
                :posts="posts"
                @deletePost="showAlertHandler"
                @editPost="showEditorHandler">
              </PostListInTab>
              <!-- <FollowingListInTab
                slot="2"
                :followingByUser="followingByUser"
                @changeResource="$_admin_followingHandler"
                @unfollow="$_admin_unfollowingHandler">
              </FollowingListInTab> -->
            </app-tab>
          </section>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="panel">
            <PostList
              :maxResult="20"
              :posts="posts"
              @deletePosts="showAlertHandler"
              @editPost="showEditorHandler"
              @publishPosts="showAlertHandler">
            </PostList>
          </section>
        </template>
        <template v-else-if="activePanel === 'tags'">
          <section class="panel">
            <TagList
              :maxResult="20"
              :tags="tags"
              @addTag="addTag"
              @deleteTags="showAlertHandler"
              @updateTagList="updateTagList({})">
            </TagList>
          </section>
        </template>
        <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
          <MemberAccountEditor @updated="filterChanged" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showDraftList">
          <PostListDetailed
            :posts="postsDraft"
            @deletePost="showAlertHandler"
            @editPost="showEditorHandler">
          </PostListDetailed>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showEditor">
          <PostPanel
            :post="post"
            :panelType="postPanel"
            :postType="postType"
            @addPost="addPost"
            @deletePost="deletePost"
            @publishPost="publishPost"
            @updatePost="updatePost">
          </PostPanel>
        </BaseLightBox>
        <BaseLightBox :isAlert="true" :showLightBox.sync="showAlert">
          <AlertPanel
            :active="itemsActive"
            :activeChanged="postActiveChanged"
            :items="itemsSelected"
            :needConfirm="needConfirm"
            :showLightBox="showAlert"
            :type="alertType"
            @deletePosts="deletePosts"
            @deleteTags="deleteTags"
            @closeAlert="alertHandler(false)"
            @publishPosts="publishPostHandler">
          </AlertPanel>
        </BaseLightBox>
      </main>
    </div>
  </div>
</template>
<script>
  import { POST_ACTIVE, POST_TYPE, TAG_ACTIVE } from '../../api/config'
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

  const deletePostSelf = (store, id) => {
    return store.dispatch('DELETE_POST_SELF', { id: id })
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
      TagList,
      TheControlBar
    },
    computed: {
      // followingByUser () {
      //   return _.get(this.$store, [ 'state', 'followingByUser' ], [])
      // },
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
      sections () {
        return SECTIONS_DEFAULT
      },
      tags () {
        return _.get(this.$store, [ 'state', 'tags' ], [])
      }
    },
    data () {
      return {
        activePanel: 'records',
        activeTab: 'reviews',
        alertType: 'post',
        config: {
          type: POST_TYPE
        },
        currPage: DEFAULT_PAGE,
        currPagePostsDraft: DEFAULT_PAGE,
        currSort: DEFAULT_SORT,
        isPublishPostInEditor: false,
        itemsActive: undefined,
        itemsSelected: [],
        loading: false,
        needConfirm: false,
        post: {},
        postActiveChanged: false,
        postForPublishInEditor: {},
        postPanel: 'add',
        postType: POST_TYPE.REVIEW,
        postsSelected: [],
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        showLightBox: false,
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
      addMember () {
        this.showLightBox = true
      },
      addPost (params) {
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
              this.updatePostList({ needFetchCount: true })
              this.showEditor = false
              this.itemsActive = params.active
              this.postActiveChanged = true
              this.needConfirm = false
              this.showAlert = true
            })
        }
      },
      addTag (tagName) {
        this.itemsActive = TAG_ACTIVE.ACTIVE
        this.needConfirm = false
        this.loading = true
        addTags(this.$store, tagName)
        .then(() => {
          this.updateTagList({ needFetchCount: true })
          this.showAlert = true
        })
        .catch(() => this.loading = false)
      },
      alertHandler (showAlert) {
        this.showAlert = showAlert
      },
      deletePost () {
        this.itemsActive = POST_ACTIVE.DEACTIVE
        this.postActiveChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      deletePosts () {
        deletePosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: _.get(this.$store.state, [ 'profile', 'id' ])
          }
        }).then(() => {
          this.updatePostList({ needFetchCount: true })
          this.showEditor = false
          this.showDraftList = false
          this.needConfirm = false
        })
      },
      deleteTags () {
        deleteTags(this.$store, this.itemsSelectedID)
          .then(() => {
            this.updateTagList({ needFetchCount: true })
            this.needConfirm = false
          })
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
            break
        }
      },
      publishPost (params) {
        this.postForPublishInEditor = params
        this.isPublishPostInEditor = true
        this.itemsActive = params.active
        this.postActiveChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      publishPostHandler () {
        if (this.isPublishPostInEditor) {
          if (this.postPanel === 'add') {
            addPost(this.$store, this.postForPublishInEditor)
              .then(() => {
                this.updatePostList({ needFetchCount: true })
                this.showEditor = false
                this.needConfirm = false
              })
          } else {
            updatePost(this.$store, this.postForPublishInEditor)
              .then(() => {
                this.updatePostList({ needFetchCount: false })
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
              this.updatePostList({ needFetchCount: true })
              this.needConfirm = false
            })
        }
      },
      showAlertHandler (ids, itemsActive) {
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
      showDraftListHandler (type) {
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
      showEditorHandler ({ postPanel, id, postType }) {
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
      tabHandler (tab) {
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
        }
      },
      updatePost(params, activeChanged) {
        this.itemsActive = params.active
        this.postActiveChanged = activeChanged
        updatePost(this.$store, params)
          .then(() => {
            this.updatePostList({})
            this.showEditor = false
            this.showDraftList = false
            this.showAlert = true
            this.needConfirm = false
          })
          .catch((err) => console.error(err))
      },
      updatePostList ({ sort, needFetchCount = false }) {
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
      updateTagList ({ sort, needFetchCount = false }) {
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