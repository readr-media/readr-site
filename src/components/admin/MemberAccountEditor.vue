<template>
  <div class="member-editor"
    :class="{
      result: message,
      confirm: action === 'delete' || action === 'customEditor_cancel' || action === 'customEditor_set' }">
    <div class="member-editor__form" v-if="action === 'customEditor_exceedError'">
      <div class="error">
        <div class="error__container">
          <img src="/public/icons/exclamation.png" alt="error">
          <p v-text="$t('admin.WORDING_ADMIN_EXCEED_ERROR_CUSTOMEDITOR')"></p>
        </div>
      </div>
    </div>
    <div class="member-editor__form" v-else-if="action === 'customEditor_setError'">
      <div class="error">
        <div class="error__container">
          <img src="/public/icons/exclamation.png" alt="error">
          <p v-text="$t('admin.WORDING_ADMIN_SET_ERROR_CUSTOMEDITOR')"></p>
        </div>
      </div>
    </div>
    <div class="member-editor__form" v-else-if="action !== 'delete' && action !== 'customEditor_cancel' && action !== 'customEditor_set'">
      <div class="title" v-text="title" v-if="!message"></div>
      <div class="email">
        <span class="label" v-text="$t('admin.WORDING_ADMIN_MEMBER_EDITOR_EMAIL') + '：'"></span>
        <div>
          <TextItem class="admin" type="text"
            :alert.sync="alert.mail"
            :disabled="action === 'add' ? !isEditable : true"
            :initValue="emailVal"
            :value.sync="typedEmail"></TextItem>
        </div>
      </div>
      <div class="role">
        <span class="label" v-text="$t('admin.WORDING_ADMIN_ROLE') + '：'"></span>
        <div class="options">
          <RadioItem class="admin" name="role"
            v-if="role.key > 1" v-for="role in roles"
            :label="role.value"
            :key="role.key"
            :value="role.key"
            :disabled="!isEditable"
            :currSelected.sync="selectedRole"></RadioItem>  
        </div>
      </div>
      <div class="btn--save" @click="save" v-if="!message">
        <span v-text="$t('admin.WORDING_ADMIN_MEMBER_EDITOR_SAVE')" v-if="!shouldShowSpinner"></span>
        <Spinner :show="shouldShowSpinner"></Spinner>
      </div>
      <div class="message" v-else v-text="message"></div>      
    </div>
    <div class="member-editor__form" v-else>
      <div class="title" v-text="title" v-if="!message"></div>
      <template v-for="(m, k) in members">
        <div class="nickname" :class="{ multiple: k > 0 }">
          <span class="label" v-text="$t('admin.WORDING_ADMIN_MEMBER_EDITOR_NICKNAME') + '：'"></span>
          <div>
            <TextItem class="admin" type="text"
              :disabled="true"
              :initValue="get(m, [ 'nickname' ], '')"
              :value="get(m, [ 'nickname' ], '')"></TextItem>
          </div>
        </div>
        <div class="email" :class="{ multiple: k > 0 }">
          <span class="label" v-text="$t('admin.WORDING_ADMIN_MEMBER_EDITOR_EMAIL') + '：'"></span>
          <div>
            <TextItem class="admin" type="text"
              :disabled="true"
              :initValue="get(m, [ 'mail' ], '')"
              :value="get(m, [ 'mail' ], '')"></TextItem>
          </div>
        </div>      
      </template>
      <div class="btn--set" v-if="!message">
        <div class="btn--set__confirm" @click="save"><span v-text="$t('admin.WORDING_ADMIN_YES')"></span></div>
        <div class="btn--set__cancel" @click="closeEditor"><span v-text="$t('admin.WORDING_ADMIN_CANCEL')"></span></div>
      </div>
      <div class="message" v-else v-text="message"></div>
    </div>
  </div>
</template>
<script>
  import TextItem from 'src/components/form/TextItem.vue'
  import RadioItem from 'src/components/form/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import validator from 'validator'
  import { ROLE_MAP, } from 'src/constants/'
  import { get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:MemberAccountEditor')
  const register = (store, profile) => {
    return store.dispatch('ADD_MEMBER', {
      params: profile,
    })
  }

  const updateMember = (store, profile, type = '') => {
    return store.dispatch('UPDATE_MEMBER', {
      params: profile,
      type,
    })
  }

  const deleteMember = (store, profile) => {
    return store.dispatch('DELETE_MEMBER', {
      params: profile,
    })
  }

  const deleteMembers = (store, params) => {
    return store.dispatch('DELETE_MEMBERS', {
      params,
    })
  }

  // const getCustomEditors = (store, { page, sort }) => {
  //   return store.dispatch('GET_MEMBERS', {
  //     params: {
  //       custom_editor: true
  //     }
  //   })
  // }

  export default {
    components: {
      TextItem,
      RadioItem,
      Spinner,
    },
    computed: {
      emailVal () {
        return this.typedEmail || get(this.members, [ 0, 'mail', ], '')
      },
      id () {
        return get(this.members, [ 0, 'id', ])
      },
      nicknameVal () {
        return get(this.members, [ 0, 'nickname', ])
      },
      roleValue () {
        return this.selectedRole || get(this.members, [ 0, 'role', ])
      },
      roles () {
        return ROLE_MAP
      },
    },
    data () {
      return {
        alert: {},
        isEditable: true,
        message: null,
        typedEmail: get(this.members, [ 0, 'mail', ], null),
        selectedRole: get(this.members, [ 0, 'role', ], null),
        shouldShowBtnSet: false,
        shouldShowSpinner: false,
      }
    },
    name: 'MemberAccountEditor',
    methods: {
      closeEditor () {
        this.$emit('closeLightBox')
      },
      get,
      save () {
        if (this.shouldShowSpinner) { return }
        if (this.validate() || this.action === 'delete') {
          this.shouldShowSpinner = true
          const callback = ({ status, }) => {
            this.isEditable = false
            this.shouldShowSpinner = false
            if (status === 200) {
              if (this.action === 'delete') {
                this.message = this.$t('admin.WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL') + '！'
              } else {
                this.message = this.title + this.$t('admin.WORDING_ADMIN_SUCCESS') + '！'
              }
              this.$emit('updated')
            } else {
              debug('status', status)
              this.message = this.title + this.$t('admin.WORDING_ADMIN_INFAIL')
            }
          }
          if (this.action === 'update') {
            updateMember(this.$store, {
              id: this.id,
              mail: this.typedEmail,
              role: this.selectedRole,
            }, 'role').then(callback)
          } else if (this.action === 'add') {
            register(this.$store, {
              email: this.typedEmail,
              role: this.selectedRole,
            }).then(callback)
          } else if (this.action === 'delete') {
            if (this.members.length > 1) {
              deleteMembers(this.$store, {
                ids: map(this.members, (m) => (m.id)),
              }).then(callback)
            } else {
              deleteMember(this.$store, {
                id: this.id,
              }).then(callback)
            }
          }
        }
      },
      validate () {
        let pass = true
        if (!this.typedEmail || !validator.isEmail(this.typedEmail)) {
          pass = false
          this.alert.mail = {
            flag: true,
            msg: this.$t('admin.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL'),
          }
          debug('Mail format invalid:', this.typedEmail)
        }
        if (this.selectedRole === null || this.selectedRole === undefined || !validator.isInt(this.selectedRole.toString())) {
          this.selectedRole = 1
        }
        this.$forceUpdate()
        return pass
      },
    },
    mounted () {},
    props: [ 'shouldShow', 'title', 'members', 'action', ],
    watch: {
      members: function () {
        this.typedEmail = get(this.members, [ 0, 'mail', ], null)
        this.selectedRole = get(this.members, [ 0, 'role', ], null)
        this.message = null
        this.isEditable = true
      },
      shouldShow: function () {
        this.typedEmail = get(this.members, [ 0, 'mail', ], '')
        this.selectedRole = get(this.members, [ 0, 'role', ])
        this.message = null
        this.isEditable = true
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .member-editor
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    position relative
    // &.result
    //   .member-editor__form
    //     height 112px
    &.confirm:not(.result)
      .member-editor__form
        padding 13.5px 0 50px
    &__form
      position relative
      background-color #fff
      width 325px
      // height 140px
      padding 13.5px 0 10px
      color #000
      > div
        font-size 0.9375rem
        font-weight 600
        margin-bottom 6px
        height 21px
        display flex
        justify-content flex-start
        align-items center
        padding 0 24.5px
        > .label
          margin-right 11px
          width 50px
          // display block
        > div
          width calc(100% - 50px)
          display flex
          justify-content center
        &.error
          width 325px
          height 174px
          display flex
          justify-content center
          align-items center
          .error__container
            display flex
            flex-direction column
            justify-content center
            align-items center
            img[alt=error]
              width 50px
              height 50px
            p
              font-size 15px
              font-weight 600
              color #4280a2
              margin-top 19px
        &.nickname
          position relative
          &.multiple
            padding-top 12px
            height 33px
            &::before
              content ''
              position absolute
              top 0
              width calc(100% - 50px)
              display block
              border-top 1px solid #d3d3d3
        &.email
          &.multiple
            margin-bottom 12px
        &.title
          color #4280a2
          margin-bottom 14px
        &.role
          > .options
            // margin-right 10px
            display flex
            justify-content space-around
            align-items center
            width calc(100% - 50px)

        &.btn--save
          background-color #4280a2
          color #fff
          width calc(100% - 49px)
          height 25px
          display flex
          justify-content center
          align-items center
          margin 20px auto 0
          cursor pointer
          border-radius 5px
          
        &.message
          font-size 0.9375rem
          font-weight 600
          color #4280a2
          margin-top 23px
        &.btn--set
          position absolute
          bottom 0
          left 0
          width 100%
          height 34.5px
          padding 0
          border-top 1px solid #d3d3d3
          margin-bottom 0
          cursor pointer
          > div
            width 50%
            height 100%
            display inline-flex
            justify-content center
            align-items center
            font-size 0.9375rem
          > div:first-child
            border-right 1px solid #d3d3d3

</style>