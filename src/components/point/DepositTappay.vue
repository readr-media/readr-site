<template>
  <div class="tappay-deposit" @click="showDeposit">
    <div class="tappay-deposit__container" v-show="active" @click.stop="cancelDefault">
      <div class="tappay-deposit__wrapper">
        <div class="tappay-deposit__header">
          <div class="leading"></div>
          <div class="leading-text"><span v-html="$t('point.DEPOSIT.DESCRIPTION')"></span></div>
        </div>
        <DepositTappayForm v-if="!isRememberedCardExisting" :isReadyToDeposit.sync="isReadyToDeposit"></DepositTappayForm>
        <DepositTappayCardRemember :card="cdtcLast4" v-else></DepositTappayCardRemember>
        <div class="tappay-deposit__item toolbox">
          <div class="remember">
            <input type="checkbox" :checked="isRememberActive" id="checkbox-remember" @click.stop="toggleRemember">
            <label v-text="$t('point.DEPOSIT.REMEMBER')" for="checkbox-remember"></label>
          </div>
          <div class="reset" v-if="isRememberedCardExisting" @click.stop="resetCardInfo">
            <span v-text="$t('point.DEPOSIT.RESET_CARD_INFO')"></span>
          </div>
        </div>
        <div class="go-deposit" :class="{ active: isReadyToDeposit, }" @click.stop="goDeposit">
          <span v-text="$t('point.DEPOSIT.CONFIRM_TO_PAY')"></span>
          <Spinner :show="isDepositing"></Spinner>
        </div>
        <div class="close" @click.stop="closeDeposit"></div>
        <div class="alert" v-show="alertFlag" @click.stop="cancelDefault"><span v-text="resultMessage"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Cookie from 'vue-cookie'
  import DepositTappayForm from 'src/components/point/DepositTappayForm.vue'
  import DepositTappayCardRemember from 'src/components/point/DepositTappayCardRemember.vue'
  import Spinner from 'src/components/Spinner.vue'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:DepositTappay')
  const deposit = (store, { objectId, points, token, remember, lastfour, } = {}) => store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
    params: {
      object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
      object_id: objectId,
      points: points,
      token,
      remember,
      lastfour,
    },
  })
  export default {
    name: 'DepositTappay',
    components: {
      DepositTappayForm,
      DepositTappayCardRemember,
      Spinner,
    },
    computed: {
      depositAmountOnce () {
        return get(this.$store, 'state.setting.DONATION_DEPOSIT_AMOUNT_ONCE', 100)
      },
      memberId () {
        return get(this.$store, 'state.profile.id')
      },
    },
    data () {
      return {
        alertFlag: false,
        cdtcLast4: null,
        isReadyToDeposit: false,
        isRememberActive: false,
        isDepositing: false,
        isRememberedCardExisting: true,
        resultMessage: '',
      }
    },
    methods: {
      goDeposit () {
        if (!this.isReadyToDeposit) { return }
        this.isReadyToDeposit = false
        this.isDepositing = true

        const cb = res => {
          if (res === 200) {
            /**
              * Deposited successfully. And go refresh current point.
              */
            this.$emit('fetchCurrentPoint')
            this.resultMessage = this.$t('point.DEPOSIT.SUCCESSFULLY')
            this.alertFlag = true
          } else {
            this.resultMessage = this.$t('point.DEPOSIT.INFAIL')
            this.alertFlag = true
            debug('res', res)
          }          
        }

        if (this.isRememberedCardExisting) {
          deposit(this.$store, {
            points: 0 - this.depositAmountOnce,
            remember: this.isRememberActive,
            lastfour: this.cdtcLast4,
          }).then(cb)
        } else {
          window.TPDirect && window.TPDirect.card.getPrime(result => {
            if (result.status !== 0) {
                debug('get prime error ' + result.msg)
                return
            }
            debug('get prime successfully: ' + result.card.prime)  
            this.isDepositing = false    
            deposit(this.$store, {
              points: 0 - this.depositAmountOnce,
              token: result.card.prime,
              remember: this.isRememberActive,
              lastfour: result.card.lastfour,
            }).then(cb)              
          })
        }
      },
      resetCardInfo () {
        this.isRememberedCardExisting = false
        this.isReadyToDeposit = false
        this.isRememberActive = false
      },
      showDeposit () {
        debug('show deposit')
        this.$emit('update:active', true)
      },
      toggleRemember () {
        this.isRememberActive = !this.isRememberActive
      },
      cancelDefault () { /** do nothing */ },
      closeDeposit () {
        debug('close deporit')
        this.$emit('update:active', false)
      },
      checkRememberedCard () {
        return new Promise(resolve => {
          /** fetch the remembered card info */
          this.cdtcLast4 = Cookie.get(`CDTC_LAST4_${this.memberId}`) || null
          debug('cdtcLast4', this.cdtcLast4)

          /** if the remembered card info exists, dont initialize the tappay */
          this.isRememberedCardExisting = this.cdtcLast4 ? true : false
          if (this.isRememberedCardExisting) {
            this.isReadyToDeposit = true
            this.isRememberActive = true
            resolve(true)
          } else {
            this.isReadyToDeposit = false
            this.isRememberActive = false
            resolve(false)
          }
        })
      }, 
    },
    mounted () {
      this.checkRememberedCard()
    },
    props: {
      active: {
        default: false,
      },
    },
    watch: {
      alertFlag () {
        if (this.alertFlag) {
          setTimeout(() => {
            this.alertFlag = false
            this.$emit('update:active', false)
          }, 3000)
        }
      },      
      isRememberActive () {
        debug('Mutation detected: toggleRemember', this.isRememberActive)
      },
    },
  }
</script>
<style lang="stylus">
  .tappay-deposit  
    &__container
      cursor auto
      width 100vw
      height 100vh
      position fixed
      top 0
      left 0
      background-color rgba(0,0,0,0.7)
      z-index 9999
      display flex
      justify-content center
      align-items center 
    &__wrapper     
      width 320px
      height 528px
      padding 25px
      background-color #fff
      display flex
      justify-content center
      flex-direction column
      position relative
      .close
        width 45px
        height 45px
        background-image url(/public/icons/shutdown.jpg)
        background-repeat no-repeat
        background-size contain
        background-position center center
        position absolute
        top 0
        right 0
        cursor pointer
        &:hover
          box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
      .go-deposit
        color #fff
        cursor not-allowed
        width 100%
        height 35px
        background-color #d3d3d3
        display flex
        justify-content center
        align-items center
        border-radius 2px
        margin-top 40px
        &.active
          background-color #ddcf21
          color #fff
          cursor pointer
    &__header
      display flex
      flex-direction column
      justify-content center
      align-items center
      position relative
      .leading
        width 64px
        height 50px
        background-image url(/public/icons/creditcard.png)
        background-position center center
        background-size contain
        background-repeat no-repeat
        background-color #fff
        margin-bottom 14px
        position relative
        z-index 2
      &::before
        content ''
        width 100%
        height 10px
        background-color #ddcf21
        top 30px
        left 0
        display block
        position absolute
        z-index 1
      .leading-text
        font-size 0.75rem
        line-height 30px
        margin-bottom 40px
        color #444746
        text-align center
        span
          border-bottom 1px solid #000
          padding-bottom 3px
    &__item
      display flex
      align-items center
      width 100%
      margin 10px 0
      &__wrapper
        display flex
        > div:not(:first-child)
          margin-left 10px
          .name
            width auto
      .name
        font-size 0.9375rem
        width 50px
        margin-right 10px
        text-align justify
      .content
        font-size 0.75rem
        border-bottom 1px solid #d3d3d3
        flex 1
      .tpfield
        flex 1
      &.toolbox
        font-size 0.75rem
        justify-content space-between
        .remember
          input
            margin-right 5px
        .reset
          font-weight 300
          border-bottom 1px solid #b3b3b3
          padding-bottom 1px
          color #b3b3b3
          cursor pointer
          &:hover
            color #000
    .tpfield
      height 20px
      width 100%
      border-bottom 1px solid #d3d3d3
      margin 5px 0
      padding 5px
      border-radius 2px
    .tappay-field-focus
      border-color #66afe9
      outline 0
      -webkit-box-shadow inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)
      box-shadow inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)
    .alert
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh      
      display flex
      justify-content center
      align-items center
      z-index 9999
      background-color rgba(0,0,0,0.7)
      span
        background-color rgba(250,250,250,0.9)
        box-shadow 0 0 5px rgba(42,42,42,0.5)
        border-radius 2px
        display flex
        justify-content center
        align-items center
        height 50px
        width 250px
</style>