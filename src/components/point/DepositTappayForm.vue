<template>
  <div>
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
  </div>
</template>
<script>
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:DepositTappayForm')
  export default {
    name: 'DepositTappayForm',
    computed: {
      isTappayLoaded () {
        return get(this.$store, 'state.isTappayLoaded', false)
      },
    },
    data () {
      return {
        isTappayInitialized: false,
      }
    },
    methods: {
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
            this.$emit('update:isReadyToDeposit', true)
          } else {
            this.$emit('update:isReadyToDeposit', false)
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
        this.isTappayInitialized = true
      },      
    },
    mounted () {
      this.isTappayLoaded && !this.isTappayInitialized && this.initialTappay()
    },
    props: {
      isReadyToDeposit: {
        default: false,
      },
    },
    watch: {
      isTappayLoaded () {
        debug('Mutation detected: isTappayLoaded.')
        if (this.isTappayInitialized) { return }
        this.isTappayLoaded && this.initialTappay()
      },
    },
  }
</script>