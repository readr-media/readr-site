<template>
  <div class="follow-wrapper">
    <div
      class="follow-wrapper__follow follow"
      @click="toggleFollow"
    >
      <IconFollow
        :color="isFollow ? '#ddcf21' : 'white'"
        :height="30"
      />
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-show="showTooltip"
        class="follow-wrapper__tooltip tooltip"
      >
        <p>收藏成功囉！</p>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { createPost } from 'src/util/post'

import IconFollow from 'src/components/icons/IconFollow.vue'

export default {
  components: {
    IconFollow
  },
  data () {
    return {
      showTooltip: false
    }
  },
  computed: {
    ...mapState({
      dataUser: state => state.DataUser
    }),
    userFollowing () {
      return this.dataUser.isFollowing
    },
    userLoggedIn () {
      return this.dataUser.isLoggedIn
    },
    userProfile () {
      return this.dataUser.profile
    },
    userId () {
      return _.get(this.userProfile, 'id')
    },

    ...mapState({
      dataPost: state => state.DataPost.post
    }),
    post () {
      return createPost(this.dataPost)
    },
    postId () {
      return _.get(this.post, 'id')
    },
    postResource () {
      return _.get(this.post, [ 'processed', 'resource' ], 'post')
    },

    isFollow () {
      return _.get(this.userFollowing, this.postResource, []).includes(this.postId)
    },

    ...mapState({
      isLoggedIn: state => state.DataUser.isLoggedIn
    })
  },
  beforeMount () {
    if (this.userLoggedIn) {
      this.CHECK_IS_FOLLOWING({
        params: {
          id: this.userId,
          resource: this.postResource,
          target_ids: [ this.postId ]
        }
      })
    }
  },
  methods: {
    ...mapActions({
      PUBSUB_ACTION: 'DataUser/PUBSUB_ACTION'
    }),
    toggleFollow () {
      if (!this.isLoggedIn) {
        this.login()
        return
      }

      const action = this.isFollow ? 'unfollow' : 'follow'
      this.PUBSUB_ACTION({
        action,
        resource: this.postResource,
        subject: this.userId,
        object: this.postId
      })

      if (this.isFollow) {
        this.toggleTooltipShow()
      } else {
        this.toggleTooltipHide()
      }
    },
    toggleTooltipShow () {
      this.showTooltip = true
      this._tooltipTimeout = setTimeout(() => {
        this.showTooltip = false
      }, 2000)
    },
    toggleTooltipHide () {
      if (this._tooltipTimeout) {
        clearTimeout(this._tooltipTimeout)
      }
      this.showTooltip = false
    },

    ...mapActions({
      CHECK_IS_FOLLOWING: 'DataUser/CHECK_IS_FOLLOWING'
    }),

    ...mapActions({
      LOGIN_ASK_TOGGLE: 'UILoginLightbox/LOGIN_ASK_TOGGLE'
    }),
    switchOnLoginPanel () {
      this.LOGIN_ASK_TOGGLE({ active: 'on', message: '' })
    },
    login () {
      this.switchOnLoginPanel()
    }
  }
}
</script>

<style lang="stylus" scoped>
.follow-wrapper
  display flex
  flex-direction column
  align-items center
  position relative
  &__tooltip
    position absolute
    top 40px
    min-width max-content

.follow
  height 100%
  img
    height 100%
  &__icon
    width 100px
    height 100%
    background-color #8cffa0
    -webkit-mask-image url(/public/2.0/icons/follow-white.png)
    mask-image url(/public/2.0/icons/follow-white.png)

.tooltip
  background-color white
  padding 10px 5px
  z-index 1000
  p
    margin 0
</style>
