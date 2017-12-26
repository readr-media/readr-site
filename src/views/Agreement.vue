<template>
  <div class="agreement">
    <app-header></app-header>
    <div class="terms">
      <div class="terms__nav">
        <div class="terms__nav__item" :class="{ active: activeItem === i }" v-for="(item, i) in termsItems" v-text="item.title" @click="navClickHandler(i)"></div>
      </div>
      <div class="terms__content" v-text="content"></div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import Header from '../components/Header.vue'
  import { AGREEMENT_CONTENT } from '../constants/agreement'
  import { WORDING_AGREEMENT_TERMS_AND_SERVICE, WORDING_AGREEMENT_IPR, WORDING_AGREEMENT_PRIVACY } from '../constants'

  export default {
    components: {
      'app-header': Header
    },
    computed: {
      content () {
        return _.get(this.termsItems, [ this.activeItem, 'content' ], '')
      }
    },
    data () {
      return {
        termsItems: [
          { item: 'termsAndService', title: WORDING_AGREEMENT_TERMS_AND_SERVICE, content: AGREEMENT_CONTENT },
          { item: 'IPR', title: WORDING_AGREEMENT_IPR, content: AGREEMENT_CONTENT },
          { item: 'privacy', title: WORDING_AGREEMENT_PRIVACY, content: AGREEMENT_CONTENT }
        ],
        activeItem: 0
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
      &__nav
        width 100%
        &__item
          width 233px
          height 45px
          display inline-flex
          justify-content center
          align-items center
          color #808080
          font-size 0.9375rem
          cursor pointer
          &.active
            background-color #ddcf21
            color #fff
      &__content
        border 5px solid #d8ca21
        padding 37.5px 27.5px
        font-size 0.625rem
        line-height 1rem
        color #000
  @media (min-width 700px)
    .agreement
      .terms
        max-width 700px
</style>