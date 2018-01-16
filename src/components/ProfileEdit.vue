<template>
  <div class="profile-edit">
    <div class="profile-edit__main">
      <div class="input-container">
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_NICKNAME }}：</span>
          <!-- <input type="text" name="nickname" v-model="computedNickname"> -->
          <input type="text" name="nickname" v-model="inputNickname">
        </div>
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_EMAIL }}：</span>
          <!-- <input type="text" name="email" v-model="computedMail"> -->
          <input type="text" name="email" v-model="inputMail">
        </div>
        <div class="input-container__input">
          <span class="name name--description">{{ wording.WORDING_PROFILEEDIT_DESCRIPTION }}：</span>
          <!-- <textarea name="description" v-model="computedDescription"></textarea> -->
          <textarea name="description" v-model="inputDescription"></textarea>
        </div>
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_OLDPASSWORD }}：</span>
          <input type="password" name="old_password" v-model="inputOldPassword">
        </div>
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_NEWPASSWORD }}：</span>
          <input type="password" name="new_password" v-model="inputNewPassword">
        </div>
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_CONFIRMPASSWORD }}：</span>
          <input type="password" name="confirm_password" v-model="inputConfirmPassword">
        </div>
        <div class="input-container__input">
          <span class="name">{{ wording.WORDING_PROFILEEDIT_PERSONAL_OPTIONS }}：</span>
          <div class="personal-options"></div>
        </div>
      </div>
    </div>
    <div class="profile-edit__aside">
      <div class="portrait">
        <div class="portrait__thumbnail" @click="profileEditorUploadThumbnail">
          <img :src="thumbnail" alt="thumbnail">
          <div class="circle"></div>
        </div>
        <div class="portrait__name">{{ staticNickname }}</div>
      </div>
      <button class="save-button" @click="profileEditorSave">{{ wording.WORDING_PROFILEEDIT_SAVE }}</button>
    </div>
  </div>
</template>

<script>
import { 
  WORDING_PROFILEEDIT_NICKNAME,
  WORDING_PROFILEEDIT_EMAIL,
  WORDING_PROFILEEDIT_DESCRIPTION,
  WORDING_PROFILEEDIT_OLDPASSWORD,
  WORDING_PROFILEEDIT_NEWPASSWORD,
  WORDING_PROFILEEDIT_CONFIRMPASSWORD,
  WORDING_PROFILEEDIT_PERSONAL_OPTIONS,
  WORDING_PROFILEEDIT_SAVE
} from '../constants'
import { removeToken } from '../util/services'
import validator from 'validator'
import _ from 'lodash'

const updateInfo = (store, profile, action) => {
  return store.dispatch(action, {
    params: profile
  })
}
const checkPassword = (store, profile) => {
  return store.dispatch('CHECK_PASSWORD', {
    params: {
      email: profile.email,
      password: profile.password
      // keepAlive: profile.keepAlive
    }
  })
}
const logout = (store) => {
  return store.dispatch('LOGOUT', {})
}
const uploadImage = (store, file) => {
  return store.dispatch('UPLOAD_IMAGE', { file })
}
const deleteImage = (store, file) => {
  return store.dispatch('DELETE_IMAGE', { file })
}

export default {
  props: {
    profile: {
      type: Object
    }
  },
  data () {
    return {
      staticNickname : _.get(this.profile, [ 'nickname' ], ''),
      // inputNickname: '',
      // inputMail: '',
      // inputDescription: '',
      inputNickname: _.get(this.profile, [ 'nickname' ], ''),
      inputMail: _.get(this.profile, [ 'mail' ], ''),
      inputDescription: _.get(this.profile, [ 'description' ], ''),
      inputOldPassword: '',
      inputNewPassword: '',
      inputConfirmPassword: '',
      wording: {
        WORDING_PROFILEEDIT_NICKNAME,
        WORDING_PROFILEEDIT_EMAIL,
        WORDING_PROFILEEDIT_DESCRIPTION,
        WORDING_PROFILEEDIT_OLDPASSWORD,
        WORDING_PROFILEEDIT_NEWPASSWORD,
        WORDING_PROFILEEDIT_CONFIRMPASSWORD,
        WORDING_PROFILEEDIT_PERSONAL_OPTIONS,
        WORDING_PROFILEEDIT_SAVE
      }
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
    // computedMail: {
    //   get () {
    //     return _.get(this.profile, [ 'mail' ], '')
    //   },
    //   set (newValue) {
    //     this.inputMail = newValue
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
    showLightBox () {
      return this.$parent.showLightBox
    },
    thumbnail () {
      return _.get(this.profile, [ 'profileImage' ]) || '/public/icons/exclamation.png'
    },
    thumbnailFilePath () {
      return this.thumbnail.substr(this.thumbnail.lastIndexOf('/') + 1)
    }
  },
  watch: {
    showLightBox () {
      if (!this.showLightBox) {
        this.inputNickname = _.get(this.profile, [ 'nickname' ], '')
        this.inputMail = _.get(this.profile, [ 'mail' ], '')
        this.inputDescription = _.get(this.profile, [ 'description' ], '')
        this.inputOldPassword = ''
        this.inputNewPassword = ''
        this.inputConfirmPassword = ''
      }
    }
  },
  methods: {
    profileEditorUploadThumbnail () {
      const saveImage = (file) => {
        const fd = new FormData()
        const fileExt = file.type.split('image/')[1]
        fd.append('image', file, `${this.profile.id}-${Math.random()}.${fileExt}`)
        // fd.append('image', file)

        uploadImage(this.$store, fd)
          .then((res) => {
            updateInfo(this.$store, {
              id: this.profile.id,
              edit_mode: 'edit_profile',
              profile_image: res.body.url
            }, 'UPDATE_PROFILE')
            // .then(callback)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = () => {
        const file = input.files[0]
        if (/^image\//.test(file.type)) {
          deleteImage(this.$store, this.thumbnailFilePath)
          file.size <= 5242880 ? saveImage(file) : console.log(`file size is ${file.size} bytes bigger than 5MB`)
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
        let params = { id: this.profile.id, edit_mode: 'edit_profile' }
        if (!inputNotChange('Nickname')) {
          params.nickname = this.inputNickname
        }
        if (!inputNotChange('Mail')) {
          params.mail = this.inputMail
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
          password: this.inputOldPassword
          // keepAlive: this.$refs[ 'keep-alive' ].checked
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log('login success')
            // return true
            updateInfo(this.$store, {
              id: this.profile.id,
              edit_mode: 'edit_profile',
              password: this.inputNewPassword
            }, 'UPDATE_PASSWORD')
            .then((res) => {
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

      if (!(inputNotChange('Nickname') && inputNotChange('Mail') && inputNotChange('Description'))) {
        updateBasicInfo()
      }
      if (!isOldPasswordEmpty() && isConfirmNewPassword()) {
        updatePassword()
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
bg-color = #d8d8d8

.profile-edit
  width 920px
  height 688px
  background-color bg-color
  display flex
  &__main
    width 704px
    height 646px
    padding 30px 0 30px 50px
    .input-container
      display flex
      flex-direction column
      align-items flex-end
      &__input
        display flex
        align-items center
        & + .input-container__input
          margin 15px 0 0 0
        .name
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
          &--description
            align-self flex-start
        input
          width 560px
          height 35px
          border 1px solid white
          padding 0 15px
        textarea
          width 560px
          height 121px
          border 1px solid white
          resize none
          padding 9px 15px
        .personal-options
          width 560px
          height 250px
          // height 200px
          background-color white

  &__aside
    width 216px
    height 688px
    padding 30px 50px 22px 41px
    display flex
    flex-direction column
    justify-content space-between
    .portrait
      &__thumbnail
        width 125px
        height 125px
        position relative
        cursor pointer
        img
          width 125px
          height 125px
          border-radius 50%
          overflow hidden
        .circle
          position absolute
          bottom 0
          right 0
          width 38px
          height 38px
          background-color #808080
          border-radius 38px
          box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
          // CSS based plus sign
          &::before
            content ''
            width 24px
            height 4px
            background-color white
            position absolute
            top 0
            bottom 0
            left 0
            right 0
            margin auto
          &::after
            content ''
            width 4px
            height 24px
            background-color white
            position absolute
            top 0
            bottom 0
            left 0
            right 0
            margin auto
      &__name
        font-size 15px
        font-weight 300
        text-align center
        margin 5px 0
        word-break break-all
    .save-button
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
      &:active
        filter brightness(80%)
</style>

