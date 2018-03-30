<template>
  <div class="invite">
    <div class="invite__container">
      <div class="invite__title" v-text="$t('INVITATION.TITLE')"></div>
      <div class="invite__form">
        <div class="item title" v-text="$t('INVITATION.EMAIL_ADSRESS')"></div>
        <div class="item input" v-text="$t('INVITATION.EMAIL_EXAMPLE')"></div>
      </div>
      <div class="invite__btn" v-text="$t('INVITATION.BTN_CANCEL')"></div>
      <div class="invite__btn" v-text="$t('INVITATION.BTN_SUBMIT')"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Invite',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped></style>