<template>
  <div class="agreement">
    <app-header></app-header>
    <div class="terms">
      <Tab :tabs="tabs">
        <div slot="0">{{ agreementContent }}</div>
        <div slot="1">NA</div>
        <div slot="2">NA</div>
      </Tab>
    </div>
  </div>
</template>
<script>
  import { AGREEMENT_CONTENT } from '../constants/agreement'
  import { WORDING_AGREEMENT_TERMS_AND_SERVICE, WORDING_AGREEMENT_IPR, WORDING_AGREEMENT_PRIVACY } from '../constants'
  import Header from '../components/Header.vue'
  import Tab from '../components/Tab.vue'

  export default {
    components: {
      'app-header': Header,
      Tab
    },
    data () {
      return {
        agreementContent: AGREEMENT_CONTENT,
        tabs: [
          WORDING_AGREEMENT_TERMS_AND_SERVICE,
          WORDING_AGREEMENT_IPR,
          WORDING_AGREEMENT_PRIVACY
        ]
      }
    },
    name: 'agreement',
    methods: {
      navClickHandler (itemIndex) {
        this.activeItem = itemIndex
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .agreement
    width 100%
    .terms
      width 100%
      margin 32px auto
      
  @media (min-width 950px)
    .agreement
      .terms
        max-width 950px
</style>