<template>
  <div class="tappay-deposit">
    <div class="tappay-deposit__container" v-show="active" @click.stop="cancelDefault">
      <div class="tappay-deposit__wrapper">
        <div class="tappay-deposit__header">
          <div class="leading"></div>
          <div class="leading-text">
            <div class="leading-text--wrapper">
              <span v-text="$t('point.CLEAR_UP.DESCRIPTION_PREFIX')"></span>
              <span v-text="amount" class="value"></span>
              <span v-text="$t('point.CLEAR_UP.DESCRIPTION_INFIX')"></span>
              <span v-text="amount" class="value"></span>
              <span v-text="$t('point.CLEAR_UP.DESCRIPTION_POSTFIX')"></span> 
              <!--span v-text="$t('point.CLEAR_UP.DESCRIPTION_CREADIT_ONLY')"></span-->
            </div>
          </div>
        </div>

        <DepositTappayForm
          :status="active"
          :isReadyToDeposit.sync="isReadyToDeposit"
          :phone.sync="phoneNumber"
          :carrierInfo.sync="carrierInfo"
          :businessInfo.sync="businessInfo"
          :cardHolder.sync="cardHolder"></DepositTappayForm>
        <div class="go-deposit" :class="{ active: isReadyToDeposit, }" @click.stop="goDeposit">
          <span v-text="$t('point.CLEAR_UP.CONFIRM_TO_PAY')"></span>
          <Spinner :show="isDepositing"></Spinner>
        </div>
        <div class="close" @click.stop="closeDeposit"></div>
        <div class="alert" v-show="alertFlag" @click.stop="cancelDefault"><span v-text="resultMessage"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  // import Cookie from 'vue-cookie'
  import DepositTappayForm from 'src/components/point/DepositTappayForm.vue'
  import Spinner from 'src/components/Spinner.vue'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:DepositTappay')
  const deposit = (store, {
    points,
    token,
    invoiceItem,
    member_phone,
    member_name,
  } = {}) => store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
    params: {
      object_type: POINT_OBJECT_TYPE.CLEAR_UP || 3,
      // object_id: 0,
      points: points,
      token,
      member_name,
      member_phone,
      invoiceItem,
    },
  })

  const switchOffTappay = store => store.dispatch('SWITCH_OFF_TAPPAY_PANEL', { active: false, })
  // const switchOffDonate = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})

  export default {
    name: 'DepositTappay',
    components: {
      DepositTappayForm,
      Spinner,
    },
    computed: {
      active () {
        return get(this.$store, 'state.clearUpPointsFlag.active', false)
      },
      amount () {
        return get(this.$store, 'state.clearUpPointsFlag.item.amount', 0)
      },
      callback () {
        return get(this.$store, 'state.clearUpPointsFlag.item.callback', () => {})
      },
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
        businessInfo: {},
        cardHolder: '',
        cdtcLast4: null,
        carrierInfo: {},
        phoneNumber: '',
        isReadyToDeposit: false,
        isDepositing: false,
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
            this.resultMessage = this.$t('point.CLEAR_UP.SUCCESSFULLY')
            this.alertFlag = true
            this.callback()
          } else {
            this.resultMessage = this.$t('point.CLEAR_UP.INFAIL')
            this.alertFlag = true
            debug('res', res)
          }          
        }

        window.TPDirect && window.TPDirect.card.getPrime(result => {
          if (result.status !== 0) {
            debug('get prime error ' + result.msg)
            return
          }
          debug('get prime successfully: ' + result.card.prime)  
          this.isDepositing = false  
          
          deposit(this.$store, {
            invoiceItem: {
              businessTitle: get(this.businessInfo, 'businessTitle'),
              businessTaxNo: get(this.businessInfo, 'businessTaxNo'),
              businessAddress: get(this.businessInfo, 'businessAddress'),        
              carrierType: get(this.carrierInfo, 'carrierType'),
              carrierNum: get(this.carrierInfo, 'carrierNum'),
              category: get(this.carrierInfo, 'category'),
              lastFourNum: result.card.lastfour,
            },
            points: 0 - this.amount,
            token: result.card.prime,
            member_name: this.cardHolder,
            member_phone: this.phoneNumber,
          }).then(cb)              
        })
      },
      cancelDefault () { /** do nothing */ },
      closeDeposit () {
        debug('close deporit')
        switchOffTappay(this.$store)
      },
    },
    mounted () {},
    watch: {
      alertFlag () {
        if (this.alertFlag) {
          setTimeout(() => {
            this.alertFlag = false
            switchOffTappay(this.$store)
          }, 3000)
        }
      },
      phoneNumber () {
        debug('Mutation detected: phoneNumber', this.phoneNumber)
      },
      cardHolder () {
        debug('Mutation detected: cardHolder', this.cardHolder)
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
      min-height 528px
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
        &--wrapper
          display inline
          border-bottom 1px solid #000
          padding-bottom 3px
        font-size 0.75rem
        line-height 30px
        margin-bottom 40px
        color #444746
        text-align center
        span
          &.value
            margin 0 5px
    &__item
      display flex
      align-items center
      width 100%
      margin 2px 0
      &__wrapper
        display flex
        > div:not(:first-child)
          margin-left 10px
          .name
            width auto
      &.depend-on
        display none
        &.active
          display block
      &.indent
        padding-left 20px
        margin 10px 0
        .input
          padding-left 25px
          width 100%
          font-size 0.75rem
          & + .input
            margin-top 10px
          input
            width 100%
            outline none
            padding 2px 5px
            color #808080
            &::-webkit-input-placeholder
              color #bdbdbd
              font-weight 100
      &.title
        font-size 1.125rem
        font-weight bold
        line-height normal
        margin 20px 0 10px
        &:first-child
          margin-top 0
      .name
        font-size 0.875rem
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
      // margin 2px 0
      padding 5px
      border-radius 2px
      &.input, &.slect
        display flex
        justify-content center
        align-items center
        border-bottom none
        input, select
          vertical-align middle
          outline none
          border none
          width 100%
          color #808080          
        input
          border-bottom 1px solid #d3d3d3
        
        select
          height 30px
          width 130%
          font-size 0.75rem
          background-color transparent
          background-image none
          appearance none
          outline none
          cursor pointer
          position relative
          z-index 2          
        &.country
          width 70px
          flex none
          border-bottom 1px solid #d3d3d3
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