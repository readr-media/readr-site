<template>
  <div class="member-editor" v-if="shouldShow">
    <div class="member-editor__form">
      <div class="title" v-text="title"></div>
      <div class="email">
        <span class="label" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_EMAIL + '：'"></span>
        <InputItem class="admin" inputKey="email" v-on:filled="fillHandler"></InputItem>
      </div>
      <div class="role">
        <span class="label" v-text="wording.WORDING_ADMIN_ROLE + '：'"></span>
        <div class="options">
          <Radio class="admin" :label="role.title" v-for="role in roles" :key="role.role" :value="role.role" name="role" v-on:selected="selectedHandler"></Radio>
        </div>
      </div>
      <div class="btn--save" v-text="wording.WORDING_ADMIN_MEMBER_EDITOR_SAVE" @click="save"></div>
      <div class="btn--set" v-if="shouldShowBtnSet">
        <div class="btn--set__confirm"></div>
        <div class="btn--set__cancel"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_EMAIL, WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_SAVE, WORDING_ADMIN_ROLE } from '../../constants'
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

  export default {
    components: {
      InputItem,
      Radio
    },
    computed: {
      title () {
        return this.wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER
      },
      roles () {
        return RoleList
      }
    },
    data () {
      return {
        typedEmail: null,
        selectedRole: null,
        shouldShowBtnSet: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_EMAIL,
          WORDING_ADMIN_MEMBER_EDITOR_SAVE,
          WORDING_ADMIN_ROLE
        }
      }
    },
    name: 'mamber-editor',
    methods: {
      fillHandler (key, value) {
        switch (key) {
          case 'email':
            this.typedEmail = value
            break
        }
      },
      save () {
        if (this.validate()) {
          register(this.$store, {
            email: this.typedEmail,
            role: this.selectedRole
          })
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
        // this.alertFlags = {}
        // this.alertMsgs = {}
        if (!this.typedEmail || !validator.isEmail(this.typedEmail)) {
          pass = false
          // this.alertFlags.mail = true
          // this.alertMsgs.mail = this.wording.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL
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
    mounted () {},
    props: [ 'shouldShow' ]
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
    &__form
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
        &.role
          > .label
            margin-right 11px
            width 50px
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
      // > .title
</style>