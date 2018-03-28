<template>
  <div class="agreement">
    <!-- <app-header></app-header> -->
    <div class="agreement__container">
      <aside class="agreement__aside">
        <AppAsideNav/>
      </aside>
      <main class="agreement__main">
        <div class="terms">
          <Tab :tabs="tabs">
            <div slot="0">{{ agreementContent }}</div>
            <div slot="1">NA</div>
            <div slot="2">NA</div>
          </Tab>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
  import { AGREEMENT_CONTENT, } from '../constants/agreement'
  // import AppHeader from '../components/AppHeader.vue'
  import Tab from '../components/Tab.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'

  export default {
    components: {
      // 'app-header': AppHeader,
      Tab,
      AppAsideNav,
    },
    data () {
      return {
        agreementContent: AGREEMENT_CONTENT,
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
<style lang="stylus" scoped>
  .agreement
    width 100%
    background-color #e6e6e6
    min-height 100vh
    &__container
      max-width 1200px
      width 100%
      margin auto
      padding 25px 0
      display flex
    &__aside
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__main
      margin-left 93.5px
      width 100%
    .terms
      width 100%
      margin 32px auto
      background-color white
      
  @media (min-width 950px)
    .agreement
      .terms
        max-width 950px
</style>