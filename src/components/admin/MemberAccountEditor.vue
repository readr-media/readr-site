<template>
  <div class="member-editor" v-if="shouldShow">
    <div class="member-editor__modal" @click="closeEditor"></div>
    <div class="member-editor__form" v-if="action !== 'delete'">
      <div class="title" v-text="title"></div>
      <div class="email">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_EMAIL + '：'"></span>
        <InputItem class="admin" inputKey="email" v-on:filled="fillHandler" :disabled="!isEdible" :initValue="emailVal"></InputItem>
      </div>
      <div class="role">
        <span class="label" v-text="wording.WORDING_ADMIN_ROLE + '：'"></span>
        <div class="options">
          <Radio class="admin" :label="role.title" v-for="role in roles" :key="role.role" :value="role.role" name="role" v-on:selected="selectedHandler" :disabled="!isEdible" :initValue="roleValue"></Radio>
        </div>
      </div>
      <div class="btn--save" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_SAVE" @click="save" v-if="!message"></div>
      <div class="message" v-else v-text="message"></div>      
    </div>
    <div class="member-editor__form" v-else>
      <div class="title" v-text="title"></div>
      <div class="nickname">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_NICKNAME + '：'"></span>
        <InputItem class="admin" inputKey="nickname" :disabled="true" :initValue="nicknameVal"></InputItem>
      </div>
      <div class="email">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_EMAIL + '：'"></span>
        <InputItem class="admin" inputKey="email" :disabled="true" :initValue="emailVal"></InputItem>
      </div>
      <div class="btn--set">
        <div class="btn--set__confirm"></div>
        <div class="btn--set__cancel"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_EMAIL, WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_SAVE, WORDING_ADMIN_ROLE } from '../../constants'
  import { WORDING_ADMIN_SUCCESS, WORDING_ADMIN_INFAIL, WORDING_ADMIN_MEMBER_EDITOR_NICKNAME } from '../../constants'
  import { consoleLogOnDev } from '../../util/comm'
  import InputItem from '../form/InputItem.vue'
  import Radio from '../form/Radio.vue'
  import validator from 'validator'

  /**
   * ToDo: should fetch role list from api. But, instead, we hard code temporarily.
   */
  const RoleList = [
    { role: 0, title: '管理員' },
    { role: 1, title: '編輯' },
    { role: 2, title: '總編' }
  ]

  const register = (store, profile) => {
    return store.dispatch('REGISTER', {
      params: profile
    })
  }

  const updateMember = (store, profile) => {
    return store.dispatch('UPDATE_MEMBER', {
      params: profile
    })
  }

  // const deleteMember = (store, profile) => {
  //   return store.dispatch('DELETE_MEMBER', {
  //     params: profile
  //   })
  // }

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
        return RoleList
      }
    },
    data () {
      return {
        isEdible: true,
        message: null,
        typedEmail: null,
        selectedRole: null,
        shouldShowBtnSet: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_EMAIL,
          WORDING_ADMIN_MEMBER_EDITOR_SAVE,
          WORDING_ADMIN_ROLE,
          WORDING_ADMIN_SUCCESS,
          WORDING_ADMIN_INFAIL,
          WORDING_ADMIN_MEMBER_EDITOR_NICKNAME
        }
      }
    },
    name: 'mamber-editor',
    methods: {
      closeEditor () {
        this.$emit('close')
      },
      fillHandler (key, value) {
        switch (key) {
          case 'email':
            this.typedEmail = value
            break
        }
      },
      save () {
        if (this.validate()) {
          const callback = (status) => {
            this.isEdible = false
            if (status === 200) {
              this.message = this.title + this.wording.WORDING_ADMIN_SUCCESS + '！'
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
          }
          // else if (this.action === 'del') {
          //   deleteMember(this.$store, {
          //     id: this.id
          //   }).then()
          // }
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
        console.log('pass', pass)
        return pass
      }
    },
    mounted () {
      console.log([
        this.shouldShow,
        this.title,
        this.member,
        this.action
      ])
    },
    props: [ 'shouldShow', 'title', 'member', 'action' ],
    watch: {
      action: function () {
        console.log([
          this.shouldShow,
          this.title,
          this.member,
          this.action
        ])
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .member-editor
    width 100%
    height 100%
    background-color rgba(0, 0, 0, 0.5)
    position fixed
    top 0
    left 0
    display flex
    justify-content center
    align-items center
    &__modal
      position absolute
      z-index 1
      top 0
      left 0
      width 100%
      height 100%
    &__form
      position relative
      z-index 2
      background-color #fff
      width 250px
      height 140px
      padding 13.5px 23.5px
      color #000
      > div
        font-size 0.9375rem
        font-weight 600
        margin-bottom 5px
        height 21px
        display flex
        justify-content flex-start
        align-items center
        > .label
          margin-right 11px
          width 50px
        &.nickname
          > .label
            width 80px
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
          width 100%
          height 25px
          display flex
          justify-content center
          align-items center
          margin-top 12.5px
          cursor pointer
        &.message
          font-size 0.9375rem
          font-weight 600
          color #4280a2
        &.btn--set
          width 100%
          height 33px

      // > .title
</style>