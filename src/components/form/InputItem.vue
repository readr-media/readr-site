<template>
  <div class="input-item" :class="{ alert: alertFlag }">
    <input :type="type" :placeholder="placeHolder" @change="valueChange" ref="input" @focus="focus" @focusout="focusout" @keyup="keyup">
    <span class="input-item__alert" @click="doFucus"></span>
    <span class="input-item__msg" v-text="alertMsg" v-if="alertMsgShow"></span>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    name: 'input-item',
    methods: {
      doFucus () {
        this.$refs['input'].focus()
      },
      focus () {
        this.$emit('inputFocus', this.inputKey)
      },
      focusout () {
        this.$emit('inputFocusOut', this.inputKey)
      },
      keyup () {
        console.log('key up')
        this.$emit('removeAlert', this.inputKey)
      },
      valueChange () {
        this.$emit('filled', this.inputKey, this.$refs['input'].value)
      }
    },
    mounted () {},
    props: [ 'inputKey', 'type', 'placeHolder', 'alertFlag', 'alertMsg', 'alertMsgShow' ]
  }
</script>
<style lang="stylus" scoped>
  input-width = calc(100% - 20px)
  input-width-alert = calc(100% - 20px - 35px - 1.5px)
  .input-item
    margin 10px 0
    position relative
    &.alert
      margin calc(10px - 1.5px) 0
      > input
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-left 1.5px solid #ddcf21
        height 35px
        width input-width-alert
        outline: none
      .input-item__alert
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-right 1.5px solid #ddcf21
        height 35px
        width calc(35px - 1.5px)
        background-image url(/public/icons/exclamation.png)
        background-position center center
        background-size 22px 22px
        background-repeat no-repeat
        display inline-block
      .input-item__msg
        display block
    > input
      border none
      width input-width
      height 35px
      font-size calc((18 / 16) * 1rem)
      padding 0 10px
      vertical-align top
      background-color #ffffff
      &::-webkit-input-placeholder
        color #bdbdbd
      &.alert
        border 1.5px solid #ddcf21
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-left 1.5px solid #ddcf21
        height 35px
        width calc(100% - 10px - 44px - 1.5px)
    &__alert
      background-color #fff
      display inline-block
      height 35px
      width 0
      display none
    &__msg
      background-color #ddcf21
      padding 10px
      position absolute
      width 150px
      min-height 10px
      left calc(100% + 17.5px)
      top 0
      z-index 20
      font-size calc((10 / 16) * 1rem)
      line-height calc((10 / 16) * 1.4rem)
      text-align left
      color #000
      font-weight 300
      box-shadow 1px 1px 1px rgba(0, 0, 0, 0.4)
      display none
      &::before
        content ''
        border-width 7.5px 17.5px 7.5px 0
        border-color transparent rgba(0, 0, 0, 0.4) transparent transparent
        border-style solid
        position absolute
        left -17.5px
        top 8.5px
        display block
      &::after
        content ''
        border-width 7.5px 17.5px 7.5px 0
        border-color transparent #ddcf21 transparent transparent
        border-style solid
        position absolute
        left -17.5px
        top 7.5px
        display block


</style>