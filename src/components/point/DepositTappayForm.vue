<template>
  <div>
    <div class="tappay-deposit__item title"><span v-text="$t('point.DEPOSIT.TITLE.CARD_INFO')"></span></div>
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
    <div class="tappay-deposit__item title"><span v-text="$t('point.DEPOSIT.TITLE.OWNER')"></span></div>
    <div class="tappay-deposit__item">
      <div class="name"><span v-html="$t('point.DEPOSIT.ITEM.CARD_OWNER')"></span></div>
      <div class="tpfield input"><input type="text" v-model="cardContactPerson"></div>
    </div>
    <div class="tappay-deposit__item__wrapper">
      <div class="tappay-deposit__item">
        <div class="name"><span v-html="$t('point.DEPOSIT.ITEM.PHONE_NUMBER')"></span></div>
        <div class="tpfield input country">
          <select v-model="currCountry">
            <option v-for="{ code, name } in callingCodes" :value="name" v-text="`${name} ${code}`"></option>
          </select>
        </div>
        <div class="tpfield input"><input type="text" v-model="phoneNumber"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import PhoneNumber from 'awesome-phonenumber'
  import validator from 'validator'
  import { get, map, filter, } from 'lodash'
  import { countries, } from 'country-data'

  const debug = require('debug')('CLIENT:DepositTappayForm')
  export default {
    name: 'DepositTappayForm',
    computed: {
      callingCodes () {
        return filter(map(get(countries, 'all'), c => ({ code: get(c, 'countryCallingCodes.0'), name: get(c, 'alpha2', ''), })), c => {
          return get(c, 'code') && get(c, 'name')
        })
      },
      configTappay () {
        return get(this.$store, 'state.setting.TAPPAY')
      },
      depositAmountOnce () {
        return get(this.$store, 'state.setting.DONATION_DEPOSIT_AMOUNT_ONCE', 100)
      },      
      isTappayLoaded () {
        return get(this.$store, 'state.isTappayLoaded', false)
      },
    },
    data () {
      return {
        isTappayInitialized: false,
        isCardInfoValid: false,
        currCountry: 'TW',
        phoneNumber: '',
        cardContactPerson: '',
      }
    },
    methods: {
      get,
      phoneNumberChanged () {
        this.$emit('update:phone', PhoneNumber( this.phoneNumber, this.currCountry).getNumber())
      },
      initialTappay () {
        window.TPDirect.setupSDK(get(this.configTappay, 'APP_ID', ''), get(this.configTappay, 'SECRET', ''), get(this.configTappay, 'ENV', 'sandbox'))      
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
            this.isCardInfoValid = true
          } else {
            this.isCardInfoValid = false
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
      validate () {
        if (this.isCardInfoValid
          && !validator.isEmpty(this.cardContactPerson)
          && !validator.isEmpty(this.phoneNumber)
          && PhoneNumber( this.phoneNumber, this.currCountry).isValid()) {
          this.$emit('update:isReadyToDeposit', true)
        } else {
          this.$emit('update:isReadyToDeposit', false)
        }
      }, 
    },
    mounted () {
      this.isTappayLoaded && !this.isTappayInitialized && this.initialTappay()
      // debug('countrynames.getAllNames()', countries)
      // debug('countrynames.getAllNames()', this.callingCodes)
    },
    props: {
      isReadyToDeposit: {
        default: false,
      },
      phone: {},
      carHolder: {},
      status: {},
    },
    watch: {
      isTappayLoaded () {
        debug('Mutation detected: isTappayLoaded.')
        if (this.isTappayInitialized) { return }
        this.isTappayLoaded && this.initialTappay()
      },
      cardContactPerson () {
        debug('Mutation detected: cardContactPerson', this.cardContactPerson)
        this.$emit('update:cardHolder', this.cardContactPerson)
        this.validate()
      },
      isCardInfoValid () {
        this.validate()
      },
      currCountry () {
        this.phoneNumberChanged()
        this.validate()
      },
      phoneNumber () {
        this.phoneNumberChanged()
        this.validate()
      },
      status () {
        this.validate()
      },
    },
  }
</script>