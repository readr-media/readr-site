<template>
  <div class="member-editor" :class="{ result: message, confirm: action === 'delete' }">
    <div class="member-editor__form" v-if="action !== 'delete'">
      <div class="title" v-text="title" v-if="!message"></div>
      <div class="email">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_EMAIL + '：'"></span>
        <div><InputItem class="admin" inputKey="email" v-on:filled="fillHandler" :disabled="action === 'add' ? !isEdible : true" :initValue="emailVal"></InputItem></div>
      </div>
      <div class="role">
        <span class="label" v-text="wording.WORDING_ADMIN_ROLE + '：'"></span>
        <div class="options">
          <Radio class="admin" :label="role.value" v-for="role in roles" :key="role.key" :value="role.key" v-if="role.key > 1" name="role" v-on:selected="selectedHandler" :disabled="!isEdible" :initValue="roleValue"></Radio>
        </div>
      </div>
      <div class="btn--save" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_SAVE" @click="save" v-if="!message"></div>
      <div class="message" v-else v-text="message"></div>      
    </div>
    <div class="member-editor__form" v-else>
      <div class="title" v-text="title" v-if="!message"></div>
      <div class="nickname">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_NICKNAME + '：'"></span>
        <div><InputItem class="admin" inputKey="nickname" :disabled="true" :initValue="nicknameVal"></InputItem></div>
      </div>
      <div class="email">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_EMAIL + '：'"></span>
        <div><InputItem class="admin" inputKey="email" :disabled="true" :initValue="emailVal"></InputItem></div>
      </div>
      <div class="btn--set" v-if="!message">
        <div class="btn--set__confirm" @click="save"><span v-text="wording.WORDING_ADMIN_YES"></span></div>
        <div class="btn--set__cancel" @click="closeEditor"><span v-text="wording.WORDING_ADMIN_CANCEL"></span></div>
      </div>
      <div class="message" v-else v-text="message"></div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_EMAIL, WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_SAVE, WORDING_ADMIN_ROLE } from '../../constants'
  import { WORDING_ADMIN_SUCCESS, WORDING_ADMIN_INFAIL, WORDING_ADMIN_MEMBER_EDITOR_NICKNAME, WORDING_ADMIN_CANCEL, WORDING_ADMIN_YES, WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL } from '../../constants'
  import { ROLE_MAP } from '../../constants'
  import { consoleLogOnDev } from '../../util/comm'
  import InputItem from '../form/InputItem.vue'
  import Radio from '../form/Radio.vue'
  import validator from 'validator'

  const register = (store, profile) => {
    return store.dispatch('ADD_MEMBER', {
      params: profile
    })
  }

  const updateMember = (store, profile) => {
    return store.dispatch('UPDATE_MEMBER', {
      params: profile
    })
  }

  const deleteMember = (store, profile) => {
    return store.dispatch('DELETE_MEMBER', {
      params: profile
    })
  }

  export default {
    components: {
      InputItem,
      Radio
    },
    computed: {
      emailVal () {
        return this.typedEmail || _.get(this.member, [ 'mail' ])
      },
      id () {
        return _.get(this.member, [ 'id' ])
      },
      nicknameVal () {
        return _.get(this.member, [ 'nickname' ])
      },
      roleValue () {
        return this.selectedRole || _.get(this.member, [ 'role' ])
      },
      roles () {
        return ROLE_MAP
      }
    },
    data () {
      return {
        isEdible: true,
        message: null,
        typedEmail: _.get(this.member, [ 'mail' ], null),
        selectedRole: _.get(this.member, [ 'role' ], null),
        shouldShowBtnSet: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_EMAIL,
          WORDING_ADMIN_MEMBER_EDITOR_SAVE,
          WORDING_ADMIN_ROLE,
          WORDING_ADMIN_SUCCESS,
          WORDING_ADMIN_INFAIL,
          WORDING_ADMIN_MEMBER_EDITOR_NICKNAME,
          WORDING_ADMIN_CANCEL,
          WORDING_ADMIN_YES,
          WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL
        }
      }
    },
    name: 'mamber-editor',
    methods: {
      closeEditor () {
        this.$emit('closeLightBox')
      },
      fillHandler (key, value) {
        switch (key) {
          case 'email':
            this.typedEmail = value
            break
        }
      },
      save () {
        if (this.validate() || this.action === 'delete') {
          const callback = ({ status }) => {
            this.isEdible = false
            if (status === 200) {
              if (this.action !== 'delete') {
                this.message = this.title + this.wording.WORDING_ADMIN_SUCCESS + '！'
              } else {
                this.message = this.wording.WORDING_ADMIN_MEMBER_EDITOR_DELETE_SUCCESSFUL + '！'
              }
              this.$emit('updated')
            } else {
              this.message = this.title + this.wording.WORDING_ADMIN_INFAIL
            }
          }
          if (this.action === 'update') {
            updateMember(this.$store, {
              id: this.id,
              mail: this.typedEmail,
              role: this.selectedRole
            }).then(callback)
          } else if (this.action === 'add') {
            register(this.$store, {
              email: this.typedEmail,
              role: this.selectedRole
            }).then(callback)
          } else if (this.action === 'delete') {
            deleteMember(this.$store, {
              id: this.id
            }).then(callback)
          }
        }
      },
      selectedHandler (group, value) {
        switch (group) {
          case 'role':
            this.selectedRole = value
            break
        }
      },
      validate () {
        let pass = true
        if (!this.typedEmail || !validator.isEmail(this.typedEmail)) {
          pass = false
          consoleLogOnDev({ msg: 'mail wrong, ' + this.typedEmail })
        }
        if (this.selectedRole === null || this.selectedRole === undefined || !validator.isInt(this.selectedRole.toString())) {
          pass = false
          // this.alertFlags.mail = true
          // this.alertMsgs.mail = this.wording.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL
          consoleLogOnDev({ msg: 'role wrong, ' + this.selectedRole })
        }
        this.$forceUpdate()
        return pass
      }
    },
    mounted () {},
    props: [ 'shouldShow', 'title', 'member', 'action' ],
    watch: {
      member: function () {
        this.typedEmail = _.get(this.member, [ 'mail' ], null)
        this.selectedRole = _.get(this.member, [ 'role' ], null)
        this.message = null
        this.isEdible = true
      }
    }
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
        // &.nickname
        //   > .label
        //     width 80px
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