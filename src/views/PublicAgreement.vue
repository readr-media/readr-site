<template>
  <div class="agreement">
    <div class="agreement__container">
      <div class="terms">
        <Tab :tabs="tabs">
          <div slot="0" v-html="AGREEMENT_CONTENT" class="terms__member"></div>
          <div slot="1" v-html="IPR_CONTENT" class="terms__member"></div>
          <div slot="2" v-html="PRIVACY_CONTENT" class="terms__member"></div>
        </Tab>
      </div>
    </div>
  </div>
</template>
<script>
  import { AGREEMENT_CONTENT, IPR_CONTENT, PRIVACY_CONTENT, } from '../constants/agreement'
  import Tab from '../components/Tab.vue'

  export default {
    components: {
      Tab,
    },
    data () {
      return {
        AGREEMENT_CONTENT,
        IPR_CONTENT,
        PRIVACY_CONTENT,
        tabs: [
          this.$t('agreement.WORDING_AGREEMENT_TERMS_AND_SERVICE'),
          this.$t('agreement.WORDING_AGREEMENT_IPR'),
          this.$t('agreement.WORDING_AGREEMENT_PRIVACY'),
        ],
      }
    },
    name: 'agreement',
    methods: {
      navClickHandler (itemIndex) {
        this.activeItem = itemIndex
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus">
  .agreement
    margin 0 auto
    &__container
      width 100%
      padding-top 22.5px
    .terms
      width 100%
      background-color white
      &__member
        max-width 610px
        margin 0 auto
        h3
          margin 40px 0
          font-size 20px
          letter-spacing .5px
        p
          margin 30px 0
          font-size 15px
          line-height 1.6
          letter-spacing .5px
          text-align justify
          > span
            margin 5px 0
            display block
      
  @media (min-width 950px)
    .agreement
      .terms
        max-width 950px
</style>