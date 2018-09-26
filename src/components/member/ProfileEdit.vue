<template>
  <ProfileEditLayout>
    <template slot="aside">
      <div class="portrait">
        <div class="portrait__container" @click="profileEditorUploadThumbnail">
          <img class="portrait__thumbnail" v-show="thumbnail" :src="getImageUrl(thumbnail)" alt="thumbnail">
          <div class="portrait__upload"></div>
        </div>
      </div>
    </template>  
    <template slot="main">
      <div class="form">
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('profile_editor.SECTION_PROFILE')"></span></div>
          <div class="form__item">
            <span class="form__name" v-text="$t('profile_editor.WORDING_PROFILEEDIT_NICKNAME')"></span>
            <input class="form__input" type="text" name="nickname" v-model="inputNickname">
          </div>
          <div class="form__item">
            <span class="form__name align-start" v-text="$t('profile_editor.WORDING_PROFILEEDIT_DESCRIPTION')"></span>
            <textarea class="form__input textarea" name="description" v-model="inputDescription"></textarea>
          </div>
        </div>
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('profile_editor.SECTION_NOTIFICATION')"></span></div>
          <!--div class="form__item switcher">
            <span class="form__name" v-text="$t('profile_editor.WORDING_PROFILEEDIT_PERSONAL_OPTIONS')"></span>
            <Advanced class="form__field" :values.sync="advanced" :fetchPersonalSetting="fetchPersonalSetting"></Advanced>
          </div-->
          <div class="form__item switcher" v-for="item in SETTING_NOTIFICATION">
            <ProfileEditSwitchItem :value.sync="settings[ get(item, 'key') ]" :defaultVal="get(personalSetting, camelize(get(item, 'key')))"
              :title="$t(`profile_editor.SETTING_NOTIFICATION.${get(item, 'name')}.TITLE`)"
              :desc="$t(`profile_editor.SETTING_NOTIFICATION.${get(item, 'name')}.DESC`)"></ProfileEditSwitchItem>
          </div>
        </div>        
        <div class="form__wrapper">
          <div class="form__item--title"><span v-text="$t('profile_editor.SECTION_ACCUONT')"></span></div>
          <div class="form__item switcher" v-for="item in SETTING_ACCOUNT">
            <ProfileEditSwitchItem :value.sync="settings[ get(item, 'key') ]" :defaultVal="get(personalSetting, camelize(get(item, 'key')))"
              :title="$t(`profile_editor.SETTING_ACCOUNT.${get(item, 'name')}.TITLE`)"
              :desc="$t(`profile_editor.SETTING_ACCOUNT.${get(item, 'name')}.DESC`)"></ProfileEditSwitchItem>
          </div>   
          <div class="form__item--subtitle"><span v-text="$t('profile_editor.MODIFY_PASSWORD')"></span></div>
          <div class="form__item">
            <span class="form__name sub" v-text="$t('profile_editor.WORDING_PROFILEEDIT_OLDPASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="25px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.old_pwd"
              :value.sync="inputOldPassword"></TextItem>            
          </div>
          <div class="form__item">
            <span class="form__name sub" v-html="$t('profile_editor.WORDING_PROFILEEDIT_NEWPASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="25px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.new_pwd"
              :value.sync="inputNewPassword"></TextItem>             
          </div>
          <div class="form__item">
            <span class="form__name sub" v-text="$t('profile_editor.WORDING_PROFILEEDIT_CONFIRMPASSWORD')"></span>
            <TextItem type="password" class="form__input text"
              height="25px" border="1px solid #d3d3d3" alertPosition="bottom"
              :alert.sync="alert.confirm_pwd"
              :value.sync="inputConfirmPassword"></TextItem>
          </div>
        </div>
      </div>
    </template>
    <template>
      <button class="button save" @click="profileEditorSave" v-text="$t('profile_editor.WORDING_PROFILEEDIT_SAVE')"></button>
      <div class="password_alert" v-if="isPasswordAlertActive">
        <div class="container">
          <div class="message"><span v-text="$t('profile_editor.PASSWORD_REVISING.SUCCESSUFULLY')"></span></div>
          <div class="confirm" @click="logout"><span v-text="$t('profile_editor.PASSWORD_REVISING.CONFIRM')"></span></div>
        </div>
      </div>      
    </template>
  </ProfileEditLayout>
</template>

<script>
import ProfileEditLayout from 'src/components/member/ProfileEditLayout.vue'
import ProfileEditSwitchItem from 'src/components/member/ProfileEditSwitchItem.vue'
import TextItem from 'src/components/form/TextItem.vue'
import validator from 'validator'
import { SETTING_ACCOUNT, SETTING_NOTIFICATION, } from 'src/constants'
import { camelize, } from 'humps'
import { get, map, } from 'lodash'
import { getImageUrl, } from 'src/util/comm'
import { removeToken, } from 'src/util/services'

const debug = require('debug')('CLIENT:ProfileEdit')
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
  name: 'ProfileEdit',
  components: {
    ProfileEditLayout,
    ProfileEditSwitchItem,
    TextItem,
  },
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
      SETTING_ACCOUNT,
      SETTING_NOTIFICATION,
      alert: {},
      inputNickname: get(this.profile, 'nickname', ''),
      inputDescription: get(this.profile, 'description', ''),
      inputOldPassword: '',
      inputNewPassword: '',
      inputConfirmPassword: '',
      isPasswordAlertActive: false,
      isPersonalSettingMutated: false,
      settings: {},
      staticNickname : get(this.profile, 'nickname', ''),
    }
  },
  computed: {
    personalSetting () {
      return get(this.$store, 'state.personalSetting', {})
    }, 
    thumbnail () {
      return get(this.profile, 'profileImage') || '/public/icons/exclamation.png'
    },
    thumbnailFilePath () {
      return this.thumbnail.substr(this.thumbnail.lastIndexOf('/') + 1)
    },
  },
  watch: {
    showLightBox (value) {
      if (!value) {
        this.inputNickname = get(this.profile, [ 'nickname', ], '')
        this.inputDescription = get(this.profile, [ 'description', ], '')
        this.inputOldPassword = ''
        this.inputNewPassword = ''
        this.inputConfirmPassword = ''
      }
    },
    personalSetting () {
      debug('Mutation detected: personalSetting,', this.personalSetting)
    },
    isPersonalSettingMutated () {
      debug('Mutation detected: isPersonalSettingMutated', this.isPersonalSettingMutated)
    },
    settings: {
      handler () {
        debug('Mutation detected: settings', this.settings, this.personalSetting)
        if (this.isPersonalSettingMutated) { return }
        map(this.settings, (v, k) => {
          const origin = get(this.personalSetting, camelize(k))
          if (origin !== undefined && get(this.personalSetting, camelize(k)) !== v) {
            this.isPersonalSettingMutated = true
          }
        })
      },
      deep: true,
    },
  },
  mounted () {
    this.fetchPersonalSetting(this.$store)
  },
  methods: {
    camelize,
    fetchPersonalSetting: (store) => {
      return store.dispatch('FETCH_PERSONAL_SETTONG')
    },
    getImageUrl,
    get,
    logout () {
      location && location.replace('/')
    },
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
        if (this.isPersonalSettingMutated) {
          params = Object.assign(params, this.settings)
        }
        return updateInfo(this.$store, params, 'UPDATE_PROFILE').then(() => {
          return this.fetchPersonalSetting(this.$store)
        })
        // .then(callback)
      }

      // Check password which user inputs, and confirm the new password, if two values are equal, update the password
      const isOldPasswordEmpty = () => {
        debug('inputOldPassword', !this.inputOldPassword || validator.isEmpty(this.inputOldPassword))
        return !this.inputOldPassword || validator.isEmpty(this.inputOldPassword)
      }
      const isConfirmNewPassword = () => {
        if (this.inputNewPassword && this.inputConfirmPassword && !validator.isEmpty(this.inputNewPassword) && !validator.isEmpty(this.inputConfirmPassword)) {
          if (this.inputNewPassword === this.inputConfirmPassword) {
            return true
          } else {
            this.alert.confirm_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL_NEW'),
            } 
            return false
          }
        } else {
          if (!this.inputNewPassword || validator.isEmpty(this.inputNewPassword)) {
            this.alert.new_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
            }
          }
          if ((!this.inputConfirmPassword || validator.isEmpty(this.inputConfirmPassword))) {
            this.alert.confirm_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY'),
            }
          }
          return false
        }
      }
      const updatePassword = () => {
        debug('this.inputNewPassword', this.inputNewPassword)
        return checkPassword(this.$store, {
          email: this.profile.mail,
          password: this.inputOldPassword,
          // keepAlive: this.$refs[ 'keep-alive' ].checked
        })
        .then(res => {
          if (res.status === 200) {
            debug('this.inputNewPassword', this.inputNewPassword)
            return updateInfo(this.$store, {
              edit_mode: 'edit_profile',
              password: this.inputNewPassword,
            }, 'UPDATE_PASSWORD')
            .then(() => {
              return logout(this.$store).then(() => {
                const domain = get(this.$store, 'state.setting.DOMAIN')
                return removeToken(domain).then(() => {
                  this.isPasswordAlertActive = true
                })
              })              
            })
          } else {
            debug('login fail')
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            debug('login 401')
            // return false
            this.alert.old_pwd = {
              flag: true,
              msg: this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE'),
            }             
          }
          return
        })
      }

      const process = []
      if (!(inputNotChange('Nickname') && inputNotChange('Description')) || this.isPersonalSettingMutated) {
        process.push(updateBasicInfo())
      }
      if (!isOldPasswordEmpty() && isConfirmNewPassword()) {
        process.push(updatePassword())
      }
      Promise.all(process).then(() => {
        !this.isPasswordAlertActive && this.$emit('save')
      })
    },
  },
}
</script>