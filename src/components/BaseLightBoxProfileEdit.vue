<template>
  <div class="profile-edit">
    <div class="profile-edit__main">
      <div class="form">
        <div class="form__item">
          <span class="form__name">{{ $t('profile_editor.WORDING_PROFILEEDIT_NICKNAME') }}：</span>
          <!-- <input type="text" name="nickname" v-model="computedNickname"> -->
          <input class="form__input" type="text" name="nickname" v-model="inputNickname">
        </div>
        <div class="form__item">
          <span class="form__name--align-start">{{ $t('profile_editor.WORDING_PROFILEEDIT_DESCRIPTION') }}：</span>
          <!-- <textarea name="description" v-model="computedDescription"></textarea> -->
          <textarea class="form__description" name="description" v-model="inputDescription"></textarea>
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('profile_editor.WORDING_PROFILEEDIT_OLDPASSWORD') }}：</span>
          <input class="form__input" type="password" name="old_password" v-model="inputOldPassword">
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('profile_editor.WORDING_PROFILEEDIT_NEWPASSWORD') }}：</span>
          <input class="form__input" type="password" name="new_password" v-model="inputNewPassword">
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('profile_editor.WORDING_PROFILEEDIT_CONFIRMPASSWORD') }}：</span>
          <input class="form__input" type="password" name="confirm_password" v-model="inputConfirmPassword">
        </div>
        <div class="form__item">
          <span class="form__name">{{ $t('profile_editor.WORDING_PROFILEEDIT_PERSONAL_OPTIONS') }}：</span>
          <div class="form__personal-options"></div>
        </div>
      </div>
    </div>
    <div class="profile-edit__aside">
      <div class="portrait">
        <div class="portrait__container" @click="profileEditorUploadThumbnail">
          <img class="portrait__thumbnail" :src="thumbnail" alt="thumbnail">
          <div class="portrait__upload"></div>
        </div>
        <div class="portrait__name">{{ staticNickname }}</div>
      </div>
      <button class="profile-edit__save-button" @click="profileEditorSave">{{ $t('profile_editor.WORDING_PROFILEEDIT_SAVE') }}</button>
    </div>
  </div>
</template>

<script>
import { removeToken, } from '../util/services'
import validator from 'validator'
import _ from 'lodash'

const updateInfo = (store, profile, action) => {
  return store.dispatch(action, {
    params: profile,
  })
}
const checkPassword = (store, profile) => {
  return store.dispatch('CHECK_PASSWORD', {
    params: {
      email: profile.email,
      password: profile.password,
      // keepAlive: profile.keepAlive
    },
  })
}
const logout = (store) => {
  return store.dispatch('LOGOUT', {})
}
const uploadImage = (store, file) => {
  return store.dispatch('UPLOAD_IMAGE', { file, type: 'member', })
}
const deleteMemberProfileThumbnails = (store, id) => {
  return store.dispatch('DELETE_MEMBER_PROFILE_THUMBNAILS', { id, })
}

export default {
  props: {
    profile: {
      type: Object,
    },
    showLightBox: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      staticNickname : _.get(this.profile, [ 'nickname', ], ''),
      // inputNickname: '',
      // inputDescription: '',
      inputNickname: _.get(this.profile, [ 'nickname', ], ''),
      inputDescription: _.get(this.profile, [ 'description', ], ''),
      inputOldPassword: '',
      inputNewPassword: '',
      inputConfirmPassword: '',
    }
  },
  computed: {
    // computedNickname: {
    //   get () {
    //     return _.get(this.profile, [ 'nickname' ], '')
    //   },
    //   set (newValue) {
    //     this.inputNickname = newValue
    //   }
    // },
    // computedDescription: {
    //   get () {
    //     return _.get(this.profile, [ 'description' ], '')
    //   },
    //   set (newValue) {
    //     this.inputDescription = newValue
    //   }
    // },
    thumbnail () {
      return _.get(this.profile, [ 'profileImage', ]) || '/public/icons/exclamation.png'
    },
    thumbnailFilePath () {
      return this.thumbnail.substr(this.thumbnail.lastIndexOf('/') + 1)
    },
  },
  watch: {
    showLightBox (value) {
      if (!value) {
        this.inputNickname = _.get(this.profile, [ 'nickname', ], '')
        this.inputDescription = _.get(this.profile, [ 'description', ], '')
        this.inputOldPassword = ''
        this.inputNewPassword = ''
        this.inputConfirmPassword = ''
      }
    },
  },
  methods: {
    profileEditorUploadThumbnail () {
      const saveImage = (file) => {
        const fd = new FormData()
        // const fileExt = file.type.split('image/')[1]
        fd.append('image', file, `${this.profile.id}`)
        
        uploadImage(this.$store, fd)
        .then((res) => {
          updateInfo(this.$store, {
            id: this.profile.id,
            edit_mode: 'edit_profile',
            profile_image: res.body.url,
          }, 'UPDATE_PROFILE')
        })
        .catch((err) => {
          console.error(err)
        })
      }

      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = () => {
        const file = input.files[0]
        if (/^image\//.test(file.type)) {
          deleteMemberProfileThumbnails(this.$store, this.profile.id)
          file.size <= 5242880 ? saveImage(file) : console.info(`file size is ${file.size} bytes bigger than 5MB`)
        }
      }
    },
    profileEditorSave () {
      // Check basic infos has been modified or not, if modified, update the infos
      const inputNotChange = (field) => {
        // return validator.isEmpty(this[`input${field}`]) || this[`computed${field}`] === this[`input${field}`]
        return this[`input${field}`] === this.profile[field.toLowerCase()]
      }
      const updateBasicInfo = () => {
        let params = { id: this.profile.id, edit_mode: 'edit_profile', }
        if (!inputNotChange('Nickname')) {
          params.nickname = this.inputNickname
        }
        if (!inputNotChange('Description')) {
          params.description = this.inputDescription
        }

        updateInfo(this.$store, params, 'UPDATE_PROFILE')
        // .then(callback)
      }

      // Check password which user inputs, and confirm the new password, if two values are equal, update the password
      const isOldPasswordEmpty = () => {
        return validator.isEmpty(this.inputOldPassword)
      }
      const isConfirmNewPassword = () => {
        if (!validator.isEmpty(this.inputNewPassword) && !validator.isEmpty(this.inputConfirmPassword)) {
          return this.inputNewPassword === this.inputConfirmPassword
        } else {
          return false
        }
      }
      const updatePassword = () => {
        checkPassword(this.$store, {
          email: this.profile.id,
          password: this.inputOldPassword,
          // keepAlive: this.$refs[ 'keep-alive' ].checked
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log('login success')
            // return true
            updateInfo(this.$store, {
              id: this.profile.id,
              edit_mode: 'edit_profile',
              password: this.inputNewPassword,
            }, 'UPDATE_PASSWORD')
            .then(() => {
              this.inputOldPassword = ''
              this.inputNewPassword = ''
              this.inputConfirmPassword = ''
  
              logout(this.$store).then(() => {
                return removeToken().then(() => {
                  location && location.replace('/')
                })
              })
            })
          } else {
            console.log('login fail')
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log('login 401')
            // return false
          }
        })
      }

      if (!(inputNotChange('Nickname') && inputNotChange('Description'))) {
        updateBasicInfo()
      }
      if (!isOldPasswordEmpty() && isConfirmNewPassword()) {
        updatePassword()
      }
    },
  },
}
</script>


<style lang="stylus" scoped>
.profile-edit
  width 920px
  height 688px
  background-color #d8d8d8
  display flex
  &__main
    width 704px
    padding 30px 0 30px 50px
  &__aside
    width 216px
    height 688px
    padding 30px 50px 22px 41px
    display flex
    flex-direction column
    justify-content space-between
  &__save-button
    width 100%
    height 35px
    border-radius 2.5px
    border none
    background-color #4280a2
    font-size 15px
    font-weight 600
    color #ffffff
    cursor pointer
    outline none
    &:hover
      filter brightness(80%)

$form__name
  width 90px
  height 25px
  line-height 25px
  font-size 18px
  color #808080
  margin 0 4px 0 0 
  text-align justify
  // pseudo class for performing a line break, intend for applying text-align justify on single line text element
  &:after
    content ''
    width 100%
    display inline-block
.form
  display flex
  flex-direction column
  align-items flex-end
  &__item
    display flex
    align-items center
    & + .form__item
      margin 15px 0 0 0
  &__name
    @extends $form__name
    &--align-start
      @extends $form__name
      align-self flex-start
  form-width = 560px
  &__input
    width form-width
    height 35px
    border 1px solid white
    padding 0 15px
  &__description
    width form-width
    height 121px
    border 1px solid white
    resize none
    padding 9px 15px
  &__personal-options
    width form-width
    height 300px
    // height 200px
    background-color white

$portrait-container-size
  width 125px
  height 125px
$plus-sign
  content ''
  background-color white
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin auto
.portrait
  &__container
    @extends $portrait-container-size
    position relative
    cursor pointer
  &__thumbnail
    @extends $portrait-container-size
    border-radius 50%
    overflow hidden
  &__upload
    r = 38px
    position absolute
    bottom 0
    right 0
    width r
    height r
    background-color #808080
    border-radius r
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
    // CSS based plus sign
    &:before
      @extends $plus-sign
      width 24px
      height 4px
    &:after
      @extends $plus-sign
      width 4px
      height 24px
  &__name
    font-size 15px
    font-weight 300
    text-align center
    margin 5px 0
    word-break break-all
</style>

