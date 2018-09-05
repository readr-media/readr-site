<template>
  <div class="tappay-deposit" @click="showDeposit">
    <div class="tappay-deposit__container" v-show="active" @click.stop="cancelDefault">
      <div class="tappay-deposit__wrapper">
        <div class="tappay-deposit__header">
          <div class="leading"></div>
          <div class="leading-text"><span v-html="$t('point.DEPOSIT.DESCRIPTION')"></span></div>
        </div>
        <div class="tappay-deposit__item">
          <div class="name"><span v-html="$t('point.DEPOSIT.ITEM.CARD_NUMBER')"></span></div>
          <div class="tpfield" id="card-number"></div>
        </div>
        <div class="tappay-deposit__item__wrapper">
          <div class="tappay-deposit__item">
            <div class="name"><span v-text="$t('point.DEPOSIT.ITEM.CCV')"></span></div>
            <div class="tpfield" id="card-ccv"></div>    
          </div>
          <div class="tappay-deposit__item">
            <div class="name"><span v-text="$t('point.DEPOSIT.ITEM.EXPIRY')"></span></div>
            <div class="tpfield" id="card-expiration-date"></div>
          </div>
        </div>
        <div class="tappay-deposit__item remember">
          <div>
            <input type="checkbox" :checked="isRememberActive" @click.stop="toggleRemember" id="checkbox-remember">
            <label v-text="$t('point.DEPOSIT.REMEMBER')" for="checkbox-remember"></label>
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
  import Spinner from 'src/components/Spinner.vue'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:DepositTappay')
  const deposit = (store, { objectId, points, token, remember, } = {}) => store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
    params: {
      object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
      object_id: objectId,
      points: points,
      token,
      remember,
    },
  })
  export default {
    name: 'DepositTappay',
    components: {
      Spinner,
    },
    computed: {
      depositAmountOnce () {
        return get(this.$store, 'state.setting.DONATION_DEPOSIT_AMOUNT_ONCE', 100)
      },
      isTappayLoaded () {
        return get(this.$store, 'state.isTappayLoaded', false)
      },      
    },
    data () {
      return {
        alertFlag: false,
        isReadyToDeposit: false,
        isRememberActive: false,
        isTappayInitialized: false,
        isDepositing: false,
        resultMessage: '',
      }
    },
    methods: {
      goDeposit () {
        if (!this.isReadyToDeposit) { return }
        this.isReadyToDeposit = false
        this.isDepositing = true
        window.TPDirect && window.TPDirect.card.getPrime(result => {
          if (result.status !== 0) {
              debug('get prime error ' + result.msg)
              return
          }
          debug('get prime 成功，prime: ' + result.card.prime)  
          this.isDepositing = false    
          deposit(this.$store, {
            points: 0 - this.depositAmountOnce,
            token: result.card.prime,
            remember: this.isRememberActive,
          }).then(res => {
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
          })              
        })
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
      initialTappay () {
        window.TPDirect.setupSDK('12498', 'app_hGqUFjfjhoSQBRTpgGXwmn2c3EI8zDapohyPxhpyyyClar0ryq6XNEkJC7HT', 'sandbox')      
        window.TPDirect.card.setup({
          fields: {
            number: {
              element: '#card-number',
              placeholder: this.$t('point.DEPOSIT.PLACEHOLDER.CARD_NUMBER'),
            },
            ccv: {
              element: '#card-ccv',
              placeholder: this.$t('point.DEPOSIT.PLACEHOLDER.CCV'),
            },
            expirationDate: {
              element: document.getElementById('card-expiration-date'),
              placeholder: this.$t('point.DEPOSIT.PLACEHOLDER.EXPIRY'),
            },
          },
          styles: {
            'input': { 'color': 'gray', },
            'input.cvc': {},
            'input.expiration-date': {},
            'input.card-number': {},
            ':focus': {},
            '.valid': { 'color': 'black', },
            '.invalid': { 'color': 'red', },
            '@media screen and (max-width: 400px)': {
              'input': { 'color': '#66afe9', },
            },
          },
        })
        window.TPDirect.card.onUpdate(update => {
          if (update.canGetPrime) {
            debug('no wrong data.')
            this.isReadyToDeposit = true
          } else {
            this.isReadyToDeposit = false
          }
          if (update.hasError) {
            debug('invalid data found.')
          }

          if (update.status.number === 2) {
            debug('invalid card number')
          } else if (update.status.number === 0) {
            debug('card number: passed.')
          } else {
            debug('wating to fill card number.')
          }

          if (update.status.expiry === 2) {
            debug('incalid expiry')
          } else if (update.status.expiry === 0) {
            debug('expiry: passed')
          } else {
            debug('watiing to fill card expiry')
          }

          if (update.status.cvc === 2) {
            debug('incalid cvc')
          } else if (update.status.cvc === 0) {
            debug('cvc: passed')
          } else {
            debug('watiing to fill card cvc')
          }
        })
      },    
    },
    mounted () {},
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
      isTappayLoaded () {
        debug('Mutation detected: isTappayLoaded.')
        if (this.isTappayInitialized) { return }
        this.isTappayLoaded && this.initialTappay()
        this.isTappayInitialized = true
      },
      isRememberActive () {
        debug('Mutation detected: toggleRemember', this.isRememberActive)
      },
    },
  }
</script>
<style lang="stylus" scoped>
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
      .tpfield
        flex 1
      &.remember
        font-size 0.75rem
        justify-content flex-end
        input
          margin-right 5px
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