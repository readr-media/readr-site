<template>
  <div class="readr-deposit" @click="deposit">
    <div class="readr-deposit__modal" v-show="isLoading">
      <div class="readr-deposit__spinner">
        <Spinner :show="isLoading"></Spinner>
      </div>
    </div>
    <div class="readr-deposit__alert" v-show="alertFlag"><span v-text="reaultMessage"></span></div>
  </div>
</template>
<script>
  import Spinner from 'src/components/Spinner.vue'
  import preventScroll from 'prevent-scroll'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:Deposit')
  const deposit = (store, { objectId, points, token, } = {}) => store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
    params: {
      object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
      object_id: objectId,
      points: points,
      token,
    },
  })

  export default {
    name: 'Deposit',
    components: {
      Spinner,
    },
    computed: {
      temProjecId () {
        /**
         * vomit a proj id for now, this is really weird and waiting to revise.
         */
        return get(this.$store, 'state.pointHistories.0.objectId')
      },
    },
    data () {
      return {
        alertFlag: false,
        handler: undefined,
        isActive: false,
        isLoading: false,
        reaultMessage: '',
      }
    },
    methods: {
      deposit (e) {
        this.isLoading = true
        const open = () => {
          return this.handler.open({
            name: 'Readr',
            description: this.$t('point.DEPOSIT.DESCRIPTION'),
            zipCode: true,
            amount: 10000,
          })
        }
        if (this.handler) {
          open()
        } else {
          const key = get(this.$store, 'state.setting.STRIPE_KEY', '')
          if (window.StripeCheckout && key) {
            this.handler = window.StripeCheckout.configure({
              key,
              image: '/public/icons/creditcard.png',
              // zipCode: true,
              currency: 'TWD',
              locale: 'en',
              panelLabel: this.$t('point.DEPOSIT.CONFIRM_TO_PAY'),
              token: (token) => {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                this.isLoading = false
                deposit(this.$store, {
                  objectId: this.temProjecId,
                  points: -100,
                  token: token.id,
                }).then(res => {
                  if (res === 200) {
                    /**
                     * Deposited successfully. And go refresh current point.
                     */
                    this.$emit('fetchCurrentPoint')
                    this.reaultMessage = this.$t('point.DEPOSIT.SUCCESSFULLY')
                    this.alertFlag = true
                  } else {
                    this.reaultMessage = this.$t('point.DEPOSIT.INFAIL')
                    this.alertFlag = true
                    debug('res', res)
                  }
                })
              },
              opened: () => {
                this.isLoading = false
                this.isActive = true
              },     
              closed: () => {
                this.isActive = false
              },        
            })
            open()
          }
        }
        e.preventDefault()              
      },
      setupHandler () {
        window.addEventListener('popstate', () => {
          debug('Going to close something.')
          this.handler && this.handler.close()
        })        
      },
    },
    mounted () {
      this.setupHandler()
    },
    watch: {
      alertFlag () {
        if (this.alertFlag) {
          setTimeout(() => {
            this.alertFlag = false
          }, 3000)
        }
      },
      isActive () {
        if (this.isActive) {
          preventScroll.on()
        } else {
          preventScroll.off()
        }
      },       
    },
  }
</script>
<style lang="stylus">
  .readr-deposit
    &__modal
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh
      background-color rgba(0,0,0,0.7)
      z-index 9999
      display flex
      justify-content center
      align-items center
    &__spinner
      width 100%
      height 10%
      display flex
      justify-content center
      align-items center
    &__alert
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