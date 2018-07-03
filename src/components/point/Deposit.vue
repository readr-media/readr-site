<template>
  <div class="readr-deposit" @click="deposit"></div>
</template>
<script>
  import { get, } from 'lodash'
  const debug = require('debug')('CLIENT:Deposit')

  export default {
    name: 'Deposit',
    data () {
      return {
        handler: undefined,
      }
    },
    methods: {
      deposit (e) {
        const open = () => this.handler.open({
            name: 'Readr',
            description: this.$t('point.DEPOSIT.DESCRIPTION'),
            zipCode: true,
            amount: 0,
        })
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
              token: function(token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                debug('token', token)
              },
            })
            open()
          }
        }
        e.preventDefault()              
      },
      setupHandler () {
        window.addEventListener('popstate', function() {
          debug('Going to close something.')
          this.handler && this.handler.close()
        })        
      },
    },
    mounted () {
      this.setupHandler()
    },
  }
</script>