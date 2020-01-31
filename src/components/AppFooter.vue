<template>
  <footer
    :class="[
      'footer',
      { 'footer--hide': shouldHideFooter }
    ]"
  >
    <div class="footer__left">
      <ul class="footer__links-icon-list links-icon-list">
        <li class="links-icon-list__list-item">
          <a
            :href="URL_FB_FANPAGE"
            class="link"
            target="_blank"
            rel="noopener"
            @click="sendGaEvent('click', 'footer_readr', 'fb')"
          >
            <img
              v-lazy="'/public/2.0/icons/fb.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_TWITTER"
            class="link"
            target="_blank"
            rel="noopener"
            @click="sendGaEvent('click', 'footer_readr', 'twitter')"
          >
            <img
              v-lazy="'/public/2.0/icons/twitter.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_IG"
            class="link"
            target="_blank"
            rel="noopener"
            @click="sendGaEvent('click', 'footer_readr', 'instagram')"
          >
            <img
              v-lazy="'/public/2.0/icons/ig.png'"
              alt=""
            >
          </a>
        </li>
        <li class="links-icon-list__list-item">
          <a
            :href="URL_MM"
            class="link"
            target="_blank"
            rel="noopener"
            @click="sendGaEvent('click', 'footer_readr', 'mirrormedia')"
          >
            <img
              v-lazy="'/public/2.0/icons/mm.png'"
              alt=""
            >
          </a>
        </li>
      </ul>
    </div>
    <div class="footer__right">
      <ul class="footer__links-list links-list">
        <li class="links-list__list-item">
          <router-link
            class="link"
            to="/about"
            @click.native="sendGaEvent('click', 'footer_readr', 'about')"
          >
            關於我們
          </router-link>
        </li>
        <li class="links-list__list-item">
          <router-link
            class="link"
            to="/agreement"
            @click.native="sendGaEvent('click', 'footer_readr', 'agreement')"
          >
            服務條款
          </router-link>
        </li>
        <li class="links-list__list-item">
          <router-link
            class="link"
            to="/privacy-rule"
            @click.native="sendGaEvent('click', 'footer_readr', 'privacy-rule')"
          >
            隱私政策
          </router-link>
        </li>
        <li class="links-list__list-item">
          <router-link
            class="link"
            to="/service-rule"
            @click.native="sendGaEvent('click', 'footer_readr', 'service-rule')"
          >
            智財政策
          </router-link>
        </li>
        <li class="links-list__list-item">
          <a
            class="link"
            href="mailto:readr@readr.tw"
            @click="sendGaEvent('click', 'footer_readr', 'contact us')"
          >
            聯絡我們
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { sendGaEvent } from 'src/util/comm'

import {
  URL_FB_FANPAGE,
  URL_TWITTER,
  URL_IG,
  URL_MM
} from 'src/constants'

export default {
  data () {
    return {
      URL_FB_FANPAGE,
      URL_TWITTER,
      URL_IG,
      URL_MM
    }
  },
  computed: {
    ...mapState({
      shouldHideFooter: state => state.UIAppFooter.shouldHide
    })
  },
  watch: {
    '$route.name': {
      handler (value) {
        this.SET_HIDE_FOOTER(value === 'report')
      },
      immediate: true
    }
  },
  mounted () {
    window.addEventListener('message', e => {
      // if (e.origin !== window.origin) { return }
      const { data = '' } = e
      switch (data) {
        case 'scrollReachBottom':
          this.SET_HIDE_FOOTER(false)
          break
        case 'scrollLeaveBottom':
          this.SET_HIDE_FOOTER(true)
          break
        default:
          break
      }
    })
  },
  methods: {
    ...mapMutations({
      SET_HIDE_FOOTER: 'UIAppFooter/SET_HIDE'
    }),
    sendGaEvent
  }
}
</script>

<style lang="stylus" scoped>
.footer
  padding 0 15px
  width 100%
  height 177px
  background-color white
  display flex
  justify-content center
  align-items center
  &--hide
    display none
  &__right
    margin 0 0 0 20px

.link
  font-size 14px
  font-weight 500
  color #444746
  display flex
  align-items center

.links-icon-list
  list-style none
  margin 0
  padding 0
  display flex
  justify-content center
  &__list-item
    display flex
    align-items center
    & + &
      margin 0 0 0 20px
    img
      width 30px
      height 30px

.links-list
  list-style none
  margin 0
  padding 0
  display flex
  align-items center
  border-left 1px solid #979797
  height 30px
  &__list-item
    display flex
    justify-content center
    align-items center
    margin 0 0 0 20px
</style>
