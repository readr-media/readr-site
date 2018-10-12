<template>
  <div>
    <div class="tappay-deposit__item title"><span v-text="$t('point.CLEAR_UP.TITLE.CARD_INFO')"></span></div>
    <div class="tappay-deposit__item">
      <div class="name"><span v-html="$t('point.CLEAR_UP.ITEM.CARD_NUMBER')"></span></div>
      <div class="tpfield" id="card-number"></div>
    </div>
    <div class="tappay-deposit__item__wrapper">
      <div class="tappay-deposit__item">
        <div class="name"><span v-text="$t('point.CLEAR_UP.ITEM.CCV')"></span></div>
        <div class="tpfield" id="card-ccv"></div>    
      </div>
      <div class="tappay-deposit__item">
        <div class="name"><span v-text="$t('point.CLEAR_UP.ITEM.EXPIRY')"></span></div>
        <div class="tpfield" id="card-expiration-date"></div>
      </div>
    </div>  
    <div class="tappay-deposit__item title"><span v-text="$t('point.CLEAR_UP.TITLE.OWNER')"></span></div>
    <div class="tappay-deposit__item">
      <div class="name"><span v-html="$t('point.CLEAR_UP.ITEM.CARD_OWNER')"></span></div>
      <div class="tpfield input"><input type="text" v-model="cardContactPerson"></div>
    </div>
    <div class="tappay-deposit__item__wrapper">
      <div class="tappay-deposit__item">
        <div class="name"><span v-html="$t('point.CLEAR_UP.ITEM.PHONE_NUMBER')"></span></div>
        <div class="tpfield input country">
          <select v-model="currCountry">
            <option v-for="{ code, name } in callingCodes" :value="name" v-text="`${name} ${code}`"></option>
          </select>
        </div>
        <div class="tpfield input"><input type="text" v-model="phoneNumber"></div>
      </div>
    </div>
    <div class="tappay-deposit__item title"><span v-text="$t('point.CLEAR_UP.TITLE.INVOICE_INFO')"></span></div>
    <template v-for="(item, key) in CARRIER_TYPE">
      <div class="tappay-deposit__item indent">
        <RadioItem class="admin" name="carrier_type"
          theme="checkbox"
          fontSize="0.875rem"
          :label="$t(`point.CLEAR_UP.INVOICE.CARRIER_TYPE.${key}.TITLE`)"
          :key="CARRIER_TYPE[ key ]"
          :value="CARRIER_TYPE[ key ]"
          :disabled="false"
          :currSelected.sync="carrierSelected"></RadioItem> 
      </div>  
      <div class="tappay-deposit__item indent depend-on" :class="{ active: carrierSelected == item }">
        <template v-if="key !== 'BUSINESS'">
          <div class="input">
            <input type="text" v-model="carrierNum"
              :placeholder="$t(`point.CLEAR_UP.INVOICE.CARRIER_TYPE.${key}.PLACEHOLDER`)">      
          </div>
        </template>
        <template v-else>
          <div class="input">
            <input type="text" v-model="businessTitle"
              :placeholder="$t('point.CLEAR_UP.INVOICE.CARRIER_TYPE.BUSINESS.PLACEHOLDER.TITLE')">      
          </div>        
          <div class="input">
            <input type="text" v-model="businessTaxNo"
              :placeholder="$t('point.CLEAR_UP.INVOICE.CARRIER_TYPE.BUSINESS.PLACEHOLDER.TAX_NO')">
          </div>
        </template>
      </div>  
    </template>
  </div>
</template>
<script>
  import PhoneNumber from 'awesome-phonenumber'
  import RadioItem from 'src/components/form/RadioItem.vue'
  import validator from 'validator'
  import { get, map, filter, } from 'lodash'
  import { countries, } from 'country-data'

  const CARRIER_TYPE = {
    EMAIL: 2,
    PHONE: 0,
    NATURAL: 1,
    BUSINESS: 3,
  }
  const debug = require('debug')('CLIENT:DepositTappayForm')
  export default {
    name: 'DepositTappayForm',
    components: {
      RadioItem,
    },
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
      me () {
        return get(this.$store, 'state.profile', {})
      },
    },
    data () {
      return {
        CARRIER_TYPE,
        businessTitle: '',
        businessTaxNo: '',
        businessAddress: '-',
        cardContactPerson: '',
        currCountry: 'TW',
        carrierSelected: 2,
        carrierNum: '',
        isTappayInitialized: false,
        isCardInfoValid: false,
        phoneNumber: '',
      }
    },
    methods: {
      get,
      phoneNumberChanged () {
        this.$emit('update:phone', PhoneNumber( this.phoneNumber, this.currCountry).getNumber())
      },
      businessInfoChanged () {
        this.$emit('update:businessInfo', {
          businessTitle: this.businessTitle,
          businessTaxNo: this.businessTaxNo,
          businessAddress: this.businessAddress,          
        })
      },
      carrierInfoChanged () {
        this.$emit('update:carrierInfo', {
          carrierNum: this.carrierNum,
          carrierType: this.carrierSelected === 3 ? undefined : `${this.carrierSelected}`,
          category: this.carrierSelected === 3 ? 2 : 1,
        })
      },
      initialTappay () {
        window.TPDirect.setupSDK(get(this.configTappay, 'APP_ID', ''), get(this.configTappay, 'SECRET', ''), get(this.configTappay, 'ENV', 'sandbox'))      
        window.TPDirect.card.setup({
          fields: {
            number: {
              element: '#card-number',
              placeholder: this.$t('point.CLEAR_UP.PLACEHOLDER.CARD_NUMBER'),
            },     
            ccv: {
              element: '#card-ccv',
              placeholder: this.$t('point.CLEAR_UP.PLACEHOLDER.CCV'),
            },
            expirationDate: {
              element: document.getElementById('card-expiration-date'),
              placeholder: this.$t('point.CLEAR_UP.PLACEHOLDER.EXPIRY'),
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
        let isPassed = true

        if (!this.isCardInfoValid
          || validator.isEmpty(this.cardContactPerson)
          || validator.isEmpty(this.phoneNumber)
          || !PhoneNumber( this.phoneNumber, this.currCountry).isValid()) {
          isPassed = false
        }

        switch (this.carrierSelected) {
          case 0: {
            const exp_carrier_num_phone = /^\/[A-Z0-9.+-]{7}$/
            if (!exp_carrier_num_phone.test(this.carrierNum)) { isPassed = false }
            break
          }
          case 1: {
            const exp_carrier_num_natural = /^[A-Z]{2}[0-9]{14}$/
            if (!exp_carrier_num_natural.test(this.carrierNum)) { isPassed = false }
            break            
          }  
          case 2: {
            if (!this.carrierNum || !validator.isEmail(this.carrierNum)) { isPassed = false }
            break            
          }
          case 3: {
            const exp_taxno = /^[0-9]{8}$/
            if (!this.businessTitle
              || !this.businessAddress
              || validator.isEmpty(this.businessTitle)
              || validator.isEmpty(this.businessAddress)
              || !exp_taxno.test(this.businessTaxNo)) {
              isPassed = false
            }
            break
          }
        }

        this.$emit('update:isReadyToDeposit', isPassed)
      }, 
    },
    mounted () {
      this.isTappayLoaded && !this.isTappayInitialized && this.initialTappay()
      this.carrierNum = get(this.me, 'mail', '')
      this.carrierInfoChanged()
      this.businessInfoChanged()
    },
    props: {
      businessInfo: {},
      carrierInfo: {},
      carHolder: {},
      isReadyToDeposit: {
        default: false,
      },
      phone: {},
      status: {},
    },
    watch: {
      isTappayLoaded () {
        debug('Mutation detected: isTappayLoaded.')
        if (this.isTappayInitialized) { return }
        this.isTappayLoaded && this.initialTappay()
      },
      businessTitle () {
        this.businessInfoChanged()
        this.validate()
      },
      businessTaxNo () {
        this.businessInfoChanged()
        this.validate()
      },
      businessAddress () {
        this.businessInfoChanged()
        this.validate()
      },      
      carrierSelected () {
        if (this.carrierSelected === 2) {
          this.carrierNum = get(this.me, 'mail', '')
        } else {
          this.carrierNum = ''
        }        
        this.carrierInfoChanged()
        this.validate()
      },
      carrierNum () {
        this.carrierInfoChanged()
        this.validate()
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