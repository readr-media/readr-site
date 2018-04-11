<template>
  <div class="invite" :class="{ off: !isOn, hide: quota <= 0, 'overflow-hide': !find(emailAlert, { flag: true }) }" :style="inviteStyle">
    <div class="invite__container" :class="{ sent: isSent }">
      <template v-if="isOn">
        <div class="invite__icon"></div>
        <div class="invite__title" v-text="$t('INVITATION.TITLE')"></div>
        <div class="invite__form">
          <div class="item title" v-text="$t('INVITATION.EMAIL_ADDRESS')"></div>
          <div class="item__container" v-for="i in activeItemsCount">
            <TextItem class="item input"
              :alert.sync="emailAlert[ i ]"
              :height="'25px'"
              :border="'solid 1px #d3d3d3'"
              :disabled="isSent || isProcessing"
              :backgroundColor="inputBackgroundColor"
              :fontSize="'0.75rem'"
              :placeHolder="$t('INVITATION.EMAIL_EXAMPLE')"
              :value.sync="emails[ i ]"
              :key="`email${i}`"></TextItem>
            <Spinner class="spinner" :show="isProcessing" height="22px"></Spinner> 
            <!--img class="check" v-else-if="emailsStatus[ i ] && emailsStatus[ i ].status === 2" src="/public/icons/check.png"-->
          </div>
          <div class="item" @click="addItem" v-if="quota > activeItemsCount "><div class="add-item"></div></div>
        </div>
        <div class="invite__btn__container">
          <div class="invite__btn" @click="switchOffInvite" :class="{ disabled: isProcessing }">
            <span v-text="$t('INVITATION.BTN_CANCEL')"></span>
          </div>
          <div class="invite__btn" @click="goInvite" :class="{ disabled: isProcessing || !find(emails, email => email) }">
            <span v-text="$t('INVITATION.BTN_SUBMIT')"></span>
          </div>
        </div>      
      </template>
      <template v-else>
        <div class="invite__sent">
          <div class="invite__icon"></div>
          <span v-text="$t('INVITATION.SENT')" v-if="isSent"></span>
          <span v-text="$t('INVITATION.TITLE')" v-else></span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/Spinner.vue'
  import TextItem from 'src/components/form/TextItem.vue'
  import validator from 'validator'
  import { filter, find, get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:Invite')
  const turnOffInvitation = (store, { params, }) => {
    return store.dispatch('INVITATION_SWITCH_OFF', {
      params,
    })
  }
  const fetchQuota = (store) => {
    return store.dispatch('FETCH_INVITATIONO_QUOTA')
  }
  const invite = (store, params) => {
    return store.dispatch('INVITE', {
      params,
    })
  }

  export default {
    name: 'Invite',
    components: {
      Spinner,
      TextItem,
    },
    computed: {
      activeItemsCount () {
        return this.inviteableCount
      },
      inputBackgroundColor () {
        return this.isProcessing ? '#f6f6f6' : undefined
      },
      isOn () {
        return get(this.$store, 'state.invitation_switch_status')
      },
      inviteStyle () {
        return {
          height: this.isOn ? `${ 40 * this.activeItemsCount + 275 }px` : '140px',
        }
      },
      quota () {
        return get(this.$store, 'state.invitation_quota')
      },
    },
    data () {
      return {
        inviteableCount: 0,
        emails: {},
        emailAlert: {},
        emailsStatus: {},
        isSent: false,
        isProcessing: false,
      }
    },
    methods: {
      addItem () {
        if (this.isProcessing) { return }
        this.activeItemsCount += 1
      },
      find,
      goInvite () {
        debug('Go invite and create inviting process.')
        if (!find(this.emails, email => email)) { return }
        this.isProcessing = true
        if (this.validate()) {
          invite(this.$store, {
            emails: filter(this.emails, email => email),
          }).then(() => {
            return fetchQuota(this.$store).then(() => {
              debug('INVITE DONE')
              this.isSent = true
              this.isProcessing = false
              turnOffInvitation(this.$store, {})
            })
          })
        } else {
          this.isProcessing = false
        }
      },
      switchOffInvite () {
        turnOffInvitation(this.$store, {})
      },
      validate () {
        let pass = true
        map(this.emails, (email, index) => {
          if (email && !validator.isEmail(email)) {
            pass = false
            this.emailAlert[ index ] = {
              flag: true,
              msg: this.$t('INVITATION.EMAIL_VALIDATE_IN_FAIL'),
            }
            debug('Mail wrong', email)
          }
          debug('email', email)
        })
        return pass
      },
    },
    mounted () {},
    watch: {
      isOn: function () {
        if (this.isOn === true) {
          this.isSent = false
        }
      },
      quota: function () {
        this.inviteableCount = this.quota > 3 ? 3 : this.quota
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .invite
    background-color #fff
    margin-bottom 40px
    display flex
    transition all 0.5s
    height 0
    // min-height 375px
    // height auto
    &.hide
      display none
    &.overflow-hide
      overflow hidden
    &.off
      // height 90px
      // min-height 90px
      min-height 140px
      overflow hidden
      // &.sent
      //   min-height 140px

    &__icon
      height 35px
      background-image url(/public/icons/invitation.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      margin-bottom 10px
    &__container
      padding 30px 75px 30px
      width 100%
      &.sent
        padding 30px 75px
    &__title
      font-family PingFangTC
      font-size 1.5rem
      font-weight 300
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #000000
      
    &__form
      margin 35px auto
      .title
        font-family PingFangTC
        font-size 0.9375rem
        font-weight 500
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align left
        color #000000
      .input
        margin 15px 0
      .item
        &__container
          position relative
          > .spinner, .check
            position absolute
            right 0
            top 0
        .add-item
          height 20px
          width 20px
          border 1px solid #d3d3d3
          border-radius 50%
          color #d3d3d3
          position relative
          cursor pointer
          overflow hidden
          &:before
            content '+'
            width 100%
            height 100%
            display flex
            justify-content center
            align-items center
            position absolute
            top -1px
            left 0
          &:hover
            background-color #ddcf21
            border none
            &:before
              color #fff

    &__btn
      background-color #ddcf21
      width 47%
      text-align center
      padding 2px
      color #fff
      cursor pointer
      font-size 0.9375rem
      height 22px
      &:hover
        background-color #b2b093
      &.disabled
        background-color #cecece
        cursor not-allowed
        
      &__container
        display flex
        justify-content space-between
    &__sent
      font-family PingFangTC
      font-size 1.5rem
      font-weight 300
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #000000
</style>