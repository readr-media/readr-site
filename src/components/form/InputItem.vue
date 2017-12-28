<template>
  <div class="input-item" :class="{ alert: alertFlag }">
    <input :disabled="disabled" :type="type" :placeholder="placeHolder" @change="valueChange" ref="input" @focus="focus" @focusout="focusout" @keyup="keyup">
    <span class="input-item__alert" @click="doFucus"></span>
    <span class="input-item__msg" :class="{ long: isTooLong }" v-text="alertMsg" v-if="alertMsgShow"></span>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isTooLong: false
      }
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
        this.$emit('removeAlert', this.inputKey)
      },
      valueChange () {
        this.$emit('filled', this.inputKey, this.$refs['input'].value)
      }
    },
    mounted () {
      this.initValue && (this.$refs['input'].value = this.initValue)
    },
    props: [ 'inputKey', 'type', 'placeHolder', 'alertFlag', 'alertMsg', 'alertMsgShow', 'disabled', 'initValue' ],
    watch: {
      alertMsg: function () {
        const len = this.alertMsg ? this.alertMsg.length : 0
        this.isTooLong = len > 10
      }
    }
  }
</script>
<style lang="stylus" scoped>
  // input-width = calc(100% - 20px)
  input-width-alert = calc(100% - 20px - 35px - 1.5px)
  .input-item
    margin 15px 0
    position relative
    &.admin
      height 14px
      width 100%
      > input
        border-bottom 1px solid #d3d3d3
        height 14px
        padding 0
        color #000
        font-size 0.625rem
    &.alert
      margin calc(10px - 1.5px) 0
      > input
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-left 1.5px solid #ddcf21
        height 35px
        width calc(100% - 35px)
      .input-item__alert
        border-top 1.5px solid #ddcf21
        border-bottom 1.5px solid #ddcf21
        border-right 1.5px solid #ddcf21
        background-image url(/public/icons/exclamation.png)
        background-position center center
        background-size 22px 22px
        background-repeat no-repeat
        display inline-block
      .input-item__msg
        display block
    > input
      border none
      width 100%
      height 35px
      font-size calc((18 / 16) * 1rem)
      padding 0 10px
      vertical-align top
      background-color #ffffff
      outline none
      &::-webkit-input-placeholder
        color #bdbdbd
    &__alert
      background-color #fff
      display inline-block
      height 35px
      width 35px
      display none
    &__msg
      background-color #ddcf21
      padding 10px
      position absolute
      // width 150px
      white-space nowrap
      min-height 30px
      left calc(100% + 17.5px)
      top 0
      z-index 20
      font-size 0.625rem
      line-height calc((10 / 16) * 1.4rem)
      text-align left
      color #000
      font-weight 300
      box-shadow 1px 1px 1px rgba(0, 0, 0, 0.4)
      display none
      &.long
        width 140px
        white-space normal
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