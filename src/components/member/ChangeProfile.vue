<template>
  <div class="change-profile">
    <div class="change-profile__image">
      <figure @click="$refs.inputProfileImage.click()">
        <img
          :src="profile.profileImage || '/public/icons/exclamation.png'"
          :alt="profile.name"
        >
        <div class="btn-change-img" />
        <input
          ref="inputProfileImage"
          type="file"
          accept="image/*"
          style="display: none;"
          @change="handleInputProfileImage"
        >
      </figure>
      <p
        v-if="isSuccess"
        class="small"
      >
        更新成功
      </p>
      <p
        v-if="errorOfProfileImage"
        class="msg-failure small"
      >
        檔案大小超過 5MB 限制
      </p>
    </div>
    <div>
      <div class="change-profile__block">
        <p
          v-if="!inEditing"
          :class="{ 'not-set': !profile.nickname }"
          v-text="profile.nickname || '尚未設定個人暱稱'"
        />
        <input
          v-if="inEditing"
          v-model="nickname"
          type="text"
        >
      </div>
      <div class="change-profile__block">
        <p
          v-if="!inEditing"
          :class="{ 'not-set': !profile.description }"
          v-text="profile.description || '尚未設定個人簡介'"
        />
        <textarea
          v-if="inEditing"
          v-model="description"
          type="text"
        />
      </div>
      <button
        v-if="!inEditing"
        @click="inEditing = true"
      >
        (編輯)
      </button>
      <button
        v-if="inEditing"
        class="btn-confirm"
        @click="updateProfileInfo"
      >
        確認
      </button>
      <p
        v-if="errorOfProfileInfo"
        class="msg-failure small"
      >
        系統發生異常，請稍候再試
      </p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'ChangeProfile',
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      description: this.profile.description,
      errors: [],
      inEditing: false,
      isSuccess: false,
      nickname: this.profile.nickname
    }
  },
  computed: {
    errorOfProfileImage () {
      return this.errors.filter(error => error.match(/profile-image/)).length > 0
    },
    errorOfProfileInfo () {
      return this.errors.filter(error => error.match(/profile-info/)).length > 0
    }
  },
  methods: {
    ...mapActions({
      UPDATE_PROFILE: 'DataUser/UPDATE_PROFILE',
      UPLOAD_IMAGE: 'DataUser/UPLOAD_IMAGE'
    }),
    handleInputProfileImage () {
      this.isSuccess = false
      this.errors = []
      const file = this.$refs.inputProfileImage.files[0]
      if (file.size > 5 * 1024 * 1024) {
        this.errors.push('profile-image')
      }
      if (this.errors.length === 0) {
        this.uploadProfileImage(file)
      }
    },
    updateProfileInfo () {
      this.errors = []
      this.UPDATE_PROFILE({
        params: {
          id: this.profile.id,
          nickname: this.nickname,
          description: this.description
        }
      })
        .then(() => {
          this.inEditing = false
        })
        .catch(err => {
          this.errors.push('profile-info')
          console.error(err)
        })
    },
    uploadProfileImage (file) {
      const fd = new FormData()
      fd.append('image', file, `${this.profile.id}`)
      this.UPLOAD_IMAGE({
        file: fd,
        type: 'member'
      })
        .then((res) => this.UPDATE_PROFILE({
          params: {
            id: this.profile.id,
            profile_image: res.body.url
          }
        }))
        .then(() => {
          this.isSuccess = true
        })
        .catch(err => console.error(err))
    }
  }
}
</script>
<style lang="stylus" scoped>
.change-profile
  display flex
  align-items flex-start
  >>> input, >>> textarea
    width 100%
    padding .2em .4em
    border 1px solid #979797
  > div
    & + div
      flex 1
      margin-left 50px
  p
    &.not-set
      color #979797
  textarea
    min-height 80px
    margin-top .5em
    text-align justify
  button
    height 20px
    margin-top .5em
    padding 0
    color #11b8c9
    line-height 20px
  &__image
    // width calc(1.125rem * 4)
    figure
      position relative
      width 75px
      height 75px
      background-color transparent
      cursor pointer
      img
        display block
        width 100%
        height 100%
        border 1px solid #979797
        border-radius 50%
        object-fit cover
        object-position center center
  &__block
    & + .change-profile__block
      margin-top .5em
  .btn-change-img
    position absolute
    right 0
    bottom 0
    width 20px
    height 20px
    background-color #979797
    border-radius 50%
    &::before
      content ''
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 50%
      height 1px
      background-color #fff
    &::after
      content ''
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 1px
      height 50%
      background-color #fff
  .btn-confirm
    width 100%
    height 30px
    color #fff
    background-color #11b8c9
  .msg-failure
    margin-top .5em
    color red
    text-align justify
</style>
