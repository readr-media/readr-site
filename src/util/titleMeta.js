import { SITE_FULL, SITE_NAME } from '../constants'
// import { debug } from 'request/request';
let isTappaySDKLoaded = false
const debug = require('debug')('CLIENT:titleMeta')

function getMetaInfo (vm) {
  const { metaInfo } = vm.$options
  if (metaInfo) {
    return typeof metaInfo === 'function'
      ? metaInfo.call(vm)
      : metaInfo
  }
}

const serverMetaInfoMixin = {
  created () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      const title = metaInfo.title
      const ogTitle = metaInfo.ogTitle
      const description = metaInfo.description
      const metaUrl = metaInfo.metaUrl
      const metaImage = metaInfo.metaImage

      if (title) {
        this.$ssrContext.title = `${title} - ${SITE_NAME}`
      } else {
        this.$ssrContext.title = SITE_NAME
      }
      if (ogTitle) {
        this.$ssrContext.ogTitle = `${ogTitle} - ${SITE_NAME}`
      } else {
        this.$ssrContext.ogTitle = SITE_NAME
      }
      if (description) {
        this.$ssrContext.description = description
      }
      if (metaUrl) {
        this.$ssrContext.metaUrl = `${SITE_FULL}${metaUrl}`
      }
      if (metaImage) {
        this.$ssrContext.metaImage = metaImage
      } else {
        this.$ssrContext.metaImage = `${SITE_FULL}/public/og-image.jpg`
      }
    }
  }
}

const updateMeta = (metaInfo, vm) => {
  const title = metaInfo.title
  const ogTitle = metaInfo.ogTitle
  const description = metaInfo.description
  const metaUrl = metaInfo.metaUrl
  const metaImage = metaInfo.metaImage
  if (title) {
    document.title = `${title} - ${SITE_NAME}`
  } else {
    document.title = SITE_NAME
  }
  if (ogTitle) {
    document.head.querySelector(`meta[property='og:title']`).content = `${ogTitle} - ${SITE_NAME}`
  } else {
    document.head.querySelector(`meta[property='og:title']`).content = SITE_NAME
  }
  if (description) {
    document.head.querySelector(`meta[name=description]`).content = description
    document.head.querySelector(`meta[property='og:description']`).content = description
  }
  if (metaUrl) {
    document.head.querySelector(`meta[property='og:url']`).content = `${SITE_FULL}${metaUrl}`
  }
  if (metaImage) {
    document.head.querySelector(`meta[property='og:image']`).content = metaImage
  } else {
    document.head.querySelector(`meta[property='og:image']`).content = `${SITE_FULL}/public/og-image.jpg`
  }

  /** If Tappays SDK needed. */
  const { isTappayNeeded } = metaInfo

  if (isTappayNeeded && !isTappaySDKLoaded) {
    const script = document.createElement('script')
    script.onload = () => {
      debug('isTappaySDKLoaded', window.TPDirect)
      vm.$store.dispatch('SET_TAPPAY_LOADED').then(() => {
        debug('SET_TAPPAY_LOADED: done!')
        isTappaySDKLoaded = true
      })
    }
    script.setAttribute('src', 'https://js.tappaysdk.com/tpdirect/v3')
    document.head.appendChild(script)
  }
}

const clientMetaInfoMixin = {
  mounted () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      updateMeta(metaInfo, this)
    }
  },
  updated () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      /** update current page's mata */
      updateMeta(metaInfo, this)
    }
  }
}

export default process.env.VUE_ENV === 'server'
  ? serverMetaInfoMixin
  : clientMetaInfoMixin
