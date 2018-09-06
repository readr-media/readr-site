<template>
  <div>
    <div class="tappay-deposit__item">
      <div class="name"><span v-html="$t('point.DEPOSIT.ITEM.CARD_NUMBER')"></span></div>
      <div class="content"><span v-text="`${$t('point.DEPOSIT.CENSORED.CARD_NUMBER')} ${card}`"></span></div>
    </div>
    <div class="tappay-deposit__item__wrapper">
      <div class="tappay-deposit__item">
        <div class="name"><span v-text="$t('point.DEPOSIT.ITEM.CCV')"></span></div>
        <div class="content"><span v-text="$t('point.DEPOSIT.CENSORED.CCV')"></span></div>    
      </div>
      <div class="tappay-deposit__item">
        <div class="name"><span v-text="$t('point.DEPOSIT.ITEM.EXPIRY')"></span></div>
        <div class="content"><span v-text="$t('point.DEPOSIT.CENSORED.EXPIRY')"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'DepositTappayCardRemember',
    methods: {},
    mounted () {},
    props: {
      card: {
        default: '****',
      },
    },
  }
</script>
<style lang="stylus" scoped></style>