<template>
  <div class="backstage editor">
    <div class="backstage-container">
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
        <app-tab class="backstage__tab" :tabs="tabs" @changeTab="$_editor_tabHandler">
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
          <following-list-tab slot="2"></following-list-tab>
        </app-tab>
      </template>
      <template v-else-if="activePanel === 'posts'">
        <post-list
          class="backstage__panel"
          :maxResult="20"
          :posts="posts"
          :sort="sort"
          @deletePosts="$_editor_showAlert"
          @editPost="$_editor_showEditor"
          @filterChanged="$_editor_filterHandler"
          @publishPosts="$_editor_showAlert">
        </post-list>
      </template>
      <template v-else-if="activePanel === 'tags'">
        <tag-list
          class="backstage__panel"
          :maxResult="20"
          :sort="sort"
          :tags="tags"
          @addTag="$_editor_addTag"
          @deleteTags="$_editor_showAlert"
          @filterChanged="$_editor_filterHandler"
          @updateTagList="$_editor_updateTagList({})">
        </tag-list>
      </template>
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
        :action="postPanel"
        :editorType="postType"
        :initialPost="post"
        @closeEditor="showEditor = false"
        @updateList="$_editor_updatePostList">
      </post-panel>
    </base-light-box>
    <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
      <alert-panel
        :status="itemsStatus"
        :statusChanged="postStatusChanged"
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
  import { POST_PUBLISH_STATUS, POST_TYPE, TAG_ACTIVE, } from '../../api/config'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanelB from '../components/AlertPanel.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanel from '../components/PostPanel.vue'
  import Tab from '../components/Tab.vue'
  import TagList from '../components/TagList.vue'
  import TheControlBar from '../components/TheControlBar.vue'
  import VideoList from '../components/VideoList.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addTags = (store, text = '') => {
    return store.dispatch('ADD_TAGS', {
      params: {
        text: text,
        updated_by: _.get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  const deletePosts = (store, { params, }) => {
    return store.dispatch('DELETE_POSTS', {
      params: params,
    })
  }

  const deleteTags = (store, ids = []) => {
    return store.dispatch('DELETE_TAGS', {
      params: {
        ids: ids,
        updated_by: _.get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  const getPosts = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  } = {}) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: where,
      },
    })
  }

  const getPostsByUser = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {},
  }) => {
    return store.dispatch('GET_POSTS_BY_USER', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: where,
      },
    })
  }

  const getPostsCount = (store, params = {}) => {
    return store.dispatch('GET_POSTS_COUNT', {
      params: params,
    })
  }

  const getTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    keyword = '',
    stats = false,
  }) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sort: sort,
        keyword: keyword,
        stats: stats,
      },
    })
  }

  const getTagsCount = (store) => {
    return store.dispatch('GET_TAGS_COUNT')
  }

  const publishPosts = (store, params) => {
    return store.dispatch('PUBLISH_POSTS', { params, })
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
      'post-panel': PostPanel,
      'tag-list': TagList,
      'video-list': VideoList,
    },
    data () {
      return {
        activePanel: 'records',
        activeTab: 'reviews',
        alertType: 'post',
        config: {
          type: POST_TYPE,
        },
        isPublishPostInEditor: false,
        itemsStatus: undefined,
        itemsSelected: [],
        loading: true,
        needConfirm: false,
        page: DEFAULT_PAGE,
        post: {},
        postStatusChanged: false,
        postForPublishInEditor: {},
        postPanel: 'add',
        postType: POST_TYPE.REVIEW,
        sort: DEFAULT_SORT,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        tabs: [
          this.$t('tab.WORDING_TAB_REVIEW_RECORD'),
          this.$t('tab.WORDING_TAB_NEWS_RECORD'),
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ],
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
        return _.get(this.$store, [ 'state', 'posts', ], [])
      },
      postsDraft () {
        return _.get(this.$store, [ 'state', 'postsDraft', ], [])
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile', ], {})
      },
      tags () {
        return _.get(this.$store, [ 'state', 'tags', ], [])
      },
    },
    beforeMount () {
      Promise.all([
        getPostsByUser(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id', ]),
            type: POST_TYPE.REVIEW,
          },
        }),
        getPostsCount(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id', ]),
            type: POST_TYPE.REVIEW,
          },
        }),
      ])
      .then(() => this.loading = false)
      .catch(() => this.loading = false)
    },
    methods: {
      
      $_editor_addTag (tagName) {
        this.itemsStatus = TAG_ACTIVE.ACTIVE
        this.needConfirm = false
        this.loading = true
        addTags(this.$store, tagName)
          .then(() => {
            this.$_editor_updateTagList({ needUpdateCount: true, })
            this.showAlert = true
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
            this.loading = false
          })
      },
      $_editor_alertHandler (showAlert) {
        this.showAlert = showAlert
      },
      $_editor_deletePosts () {
        deletePosts(this.$store, {
          params: {
            ids: this.itemsSelectedID,
            updated_by: _.get(this.$store.state, [ 'profile', 'id', ]),
          },
        }).then(() => {
          this.$_editor_updatePostList({ needUpdateCount: true, })
          this.showEditor = false
          this.showDraftList = false
          this.needConfirm = false
        })
        .catch(() => {
          this.alertType = 'error'
          this.needConfirm = false
          this.showAlert = true
        })
      },
      $_editor_deleteTags () {
        deleteTags(this.$store, this.itemsSelectedID)
          .then(() => {
            this.$_editor_updateTagList({ needUpdateCount: true, })
            this.needConfirm = false
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
          })
      },
      $_editor_filterHandler ({ sort = this.sort, page = this.page, }) {
        switch (this.activePanel) {
          case 'records':
          case 'posts':
          case 'videos':
            return this.$_editor_updatePostList({ sort: sort, page: page, })
          case 'tags':
            return this.$_editor_updateTagList({ sort: sort, page: page, })
        }
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
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'posts':
            this.alertType = 'post'
            Promise.all([
              getPosts(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ], },
              }),
              getPostsCount(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ], },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'tags':
            this.alertType = 'tag'
            Promise.all([
              getTags(this.$store, { stats: true, }),
              getTagsCount(this.$store),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            this.alertType = 'video'
            Promise.all([
              getPosts(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              }),
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      $_editor_publishPostHandler () {
        this.alertType = 'post'
        const params = {}
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id', ])
        params.ids = this.itemsSelectedID
        publishPosts(this.$store, params)
          .then(() => {
            this.$_editor_updatePostList({ needUpdateCount: true, })
            this.needConfirm = false
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
          })
      },
      $_editor_showAlert (ids, itemsStatus) {
        this.itemsSelected = []
        const unionPosts = _.unionBy(this.posts, this.postsDraft, 'id')
        switch (this.alertType) {
          case 'post':
          case 'video':
            this.postStatusChanged = true
            this.isPublishPostInEditor = false
            this.itemsStatus = itemsStatus
            this.itemsSelected = _.filter(unionPosts, (o) => {
              return _.includes(ids, o.id)
            })
            break
          case 'tag':
            this.itemsStatus = TAG_ACTIVE.DEACTIVE
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
                  author: _.get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.REVIEW,
                },
              }),
              getPostsCount(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.REVIEW,
                },
              }),
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
                  author: _.get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.NEWS,
                },
              }),
              getPostsCount(this.$store, {
                where: {
                  author: _.get(this.profile, [ 'id', ]),
                  publish_status: POST_PUBLISH_STATUS.DRAFT,
                  type: POST_TYPE.NEWS,
                },
              }),
            ])
            .then(() => {
              this.loading = false
              this.showDraftList = true
            })
            .catch(() => this.loading = false)
            break
        }
      },
      $_editor_showEditor ({ postPanel, id, postType, }) {
        this.itemsSelected = []
        this.alertType = 'post'

        if (this.activePanel === 'videos') {
          this.alertType = 'video'
        }

        if (postPanel === 'add') {
          this.post = {}
          this.postType = postType
        } else {
          this.post = _.find(this.posts, { 'id': id, }) || _.find(this.postsDraft, { 'id': id, })
          this.postType = _.get(this.post, [ 'type', ])
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
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 1:
            this.activeTab = 'news'
            Promise.all([
              getPostsByUser(this.$store, {
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
              }),
              getPostsCount(this.$store, {
                where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
              }),
            ])
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 2:
            this.activeTab = 'followings'
            break
        }
      },
      $_editor_updatePostList ({ sort, page, needUpdateCount = false, } = {}) {
        this.sort = sort || this.sort
        this.page = page || this.page
        switch (this.activePanel) {
          case 'records':
            switch (this.activeTab) {
              case 'reviews':
                if (needUpdateCount) {
                  getPostsCount(this.$store, {
                    where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
                  })
                }
                getPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.REVIEW, },
                })
                break
              case 'news':
                if (needUpdateCount) {
                  getPostsCount(this.$store, {
                    where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
                  })
                }
                getPostsByUser(this.$store, {
                  page: this.page,
                  where: { author: _.get(this.profile, [ 'id', ]), type: POST_TYPE.NEWS, },
                })
                break
            }
            break
          case 'posts':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ], },
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { publish_status: [ POST_PUBLISH_STATUS.UNPUBLISHED, POST_PUBLISH_STATUS.PUBLISHED, POST_PUBLISH_STATUS.SCHEDULING, POST_PUBLISH_STATUS.PENDING, ], type: [ POST_TYPE.REVIEW, POST_TYPE.NEWS, ], },
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
          case 'videos':
            if (needUpdateCount) {
              getPostsCount(this.$store, {
                where: { type: POST_TYPE.VIDEO, },
              })
            }
            getPosts(this.$store, {
              page: this.page,
              sort: this.sort,
              where: { type: POST_TYPE.VIDEO, },
            })
            .then(() => this.loading = false)
            .catch(() => this.loading = false)
            break
        }
      },
      $_editor_updateTagList ({ sort, page, needUpdateCount = false, }) {
        this.sort = sort || this.sort
        this.page = page || this.page
        if (needUpdateCount) {
          getTagsCount(this.$store)
        }
        getTags(this.$store, {
          page: this.page,
          sort: this.sort,
          stats: true,
        })
        .then(() => this.loading = false)
        .catch(() => this.loading = false)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .editor
    &__record
      background-color #fff
</style>