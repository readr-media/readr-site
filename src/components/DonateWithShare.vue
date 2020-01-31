<template>
  <div class="donate-share">
    <p>喜歡這篇文章嗎？<br>歡迎贊助我們，或是分享讓更多人看到，你的支持，是我們繼續產出的動力</p>
    <div class="donate-share__btns">
      <a
        class="donate"
        target="_blank"
        @click="handleClickDonate()"
      >
        <div>
          <img
            src="/public/2.0/icons/donate-black.png"
            alt="贊助"
          >
          <span>贊助</span>
        </div>
      </a>
      <div class="share">
        <a
          :href="createShareUrl('fb', url)"
          class="facebook"
          target="_blank"
          @click="sendGaEvent('click', `${$route.name}_readr`, 'share-fb')"
        >
          <img
            src="/public/2.0/icons/fb-simple.png"
            alt="分享至 facebook"
          >
        </a>
        <a
          :href="createShareUrl('line', url)"
          class="line"
          target="_blank"
          @click="sendGaEvent('click', `${$route.name}_readr`, 'share-line')"
        >
          <img
            src="/public/2.0/icons/line.png"
            alt="分享至 line"
          >
        </a>
        <button
          id="donate-share-copy"
          class="copy"
          @click="sendGaEvent('click', `${$route.name}_readr`, 'share-copylink')"
        >
          <img
            src="/public/2.0/icons/link.png"
            alt="複製連結"
          >
          <span>複製成功</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ClipboardJS from 'clipboard'
import { createShareUrl } from 'src/util/post/share'
import { sendGaEvent } from 'src/util/comm'

export default {
  name: 'DonateWithShare',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      clipboard: undefined
    }
  },
  mounted () {
    this.initClipboard()
  },
  destroyed () {
    this.clipboard.destroy()
  },
  methods: {
    createShareUrl,
    handleClickDonate () {
      this.$emit('donate')
      sendGaEvent('click', `${this.$route.name}_readr`, 'donate')
    },
    initClipboard () {
      this.clipboard = new ClipboardJS('#donate-share-copy', {
        text () {
          const url = document.location.href.split('?')[0]
          return `${url}?rref=copylinkshare`
        }
      })
      this.clipboard.on('success', () => {
        document.querySelector('.copy').classList.add('show')
        setTimeout(() => { document.querySelector('.copy').classList.remove('show') }, 2000)
      })
    },
    sendGaEvent
  }
}
</script>
<style lang="stylus" scoped>
  .donate-share
    p
      width 90%
      margin 0 auto
      line-height 1.6
      br
        display none
    button, a
      position relative
      background-color transparent
      border none
      > *
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
    &__btns
      display flex
      justify-content space-between
      margin-top 1em
      > *
        width calc(50% - .2em)
      a.donate
        padding-top calc(50% - 0.2em)
        background-color #d6c721
        > div
          display flex
          flex-direction column
          align-items center
          text-align center
          img
            width 50px
            height auto
          span
            margin-top .5em
    .share
      display flex
      flex-direction column
      button, a
        flex 1
        &:nth-of-type(2)
          margin .2em 0
        &.facebook, &.line, &.copy
          img
            width 40px
        &.facebook
          background-color #3a5a98
        &.line
          background-color #00b901
        &.copy
          position relative
          background-color #444746
          > span
            position absolute
            top calc(100% - 15px)
            left 50%
            transform translateX(-50%)
            width 70px
            padding .2em 0
            background-color #fff
            border 1px solid #444746
            border-radius 4px
            visibility hidden
          &.show
            > span
              visibility visible
              animation popup 2s forwards

@media (min-width: 768px)
  .donate-share
    p
      width 100%
      br
        display inline
    button, a
      height 40px
    &__btns
      a.donate
        width calc((100% - 1.2em) / 4)
        padding-top 0
        > div
          img
            width 20px
          span
            display none
    .share
      flex 1
      flex-direction row
      margin-left .4em
      button, a
        &:nth-of-type(2)
          margin 0 .4em
        &.facebook
          img
            width 30px
        &.line, &.copy
          img
            width 35px
</style>
