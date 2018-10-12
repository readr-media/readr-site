<template>
  <section class="tab-hide-profile">
    <div class="tab-hide-profile__info">
      <img src="/public/icons/hide-profile.svg" alt="">
      <p v-text="$t('PROFILE.HIDE_PROFILE')"></p>
    </div>
  </section>
</template>

<style lang="stylus" scoped>
.tab-hide-profile
  border 5px solid #d8ca21
  background-color white
  height 200px
  display flex
  justify-content center
  align-items center
  &__info
    display flex
    flex-direction column
    justify-content center
    align-items center
    img
      width 128px
    p
      font-size 18px
      font-weight 600
      text-align center
      color #000000
      margin 20px 0 0 0
</style>

