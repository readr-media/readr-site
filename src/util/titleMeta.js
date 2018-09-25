import { SITE_DOMAIN_DEV, } from '../constants'
// import { debug } from 'request/request';
let isTappaySDKLoaded = false
const debug = require('debug')('CLIENT:titleMeta')

function getMetaInfo (vm) {
  const { metaInfo, } = vm.$options
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
        this.$ssrContext.title = `${title} - Readr`
      }
      if (ogTitle) {
        this.$ssrContext.ogTitle = `${ogTitle} - Readr`
      }
      if (description) { 
        this.$ssrContext.description = description 
      }
      if (metaUrl) {
        this.$ssrContext.metaUrl = SITE_DOMAIN_DEV + metaUrl
      }
      if (metaImage) { 
        this.$ssrContext.metaImage = metaImage
      }
    }
  },
}

const updateMeta = metaInfo => {
  const title = metaInfo.title
  const ogTitle = metaInfo.ogTitle
  const description = metaInfo.description
  const metaUrl = metaInfo.metaUrl
  const metaImage = metaInfo.metaImage
  if (title) {
    document.title = `${title} - Readr`
  }
  if (ogTitle) {
    document.head.querySelector(`meta[property='og:title']`).content = `${ogTitle} - Readr`
  }
  if (description) {
    document.head.querySelector(`meta[name=description]`).content = description
    document.head.querySelector(`meta[property='og:description']`).content = description
  }
  if (metaUrl) {
    document.head.querySelector(`meta[property='og:url']`).content = SITE_DOMAIN_DEV + metaUrl
  }
  if (metaImage) {
    document.head.querySelector(`meta[property='og:image']`).content = metaImage
  }
}

const clientMetaInfoMixin = {
  mounted () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      updateMeta(metaInfo)
    }
  },
  updated () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      /** update current page's mata */
      updateMeta(metaInfo)

      /** If Tappays SDK needed. */
      const { isTappayNeeded, } = metaInfo

      if (isTappayNeeded && !isTappaySDKLoaded) {
        const script = document.createElement('script')
        script.onload = () => {
          debug('isTappaySDKLoaded', window.TPDirect)
          this.$store.dispatch('SET_TAPPAY_LOADED').then(() => {
            debug('SET_TAPPAY_LOADED: done!')
            isTappaySDKLoaded = true
          })
        }
        script.setAttribute('src', 'https://js.tappaysdk.com/tpdirect/v3')
        document.head.appendChild(script)
      }
    }
  },
}

export default process.env.VUE_ENV === 'server'
  ? serverMetaInfoMixin
  : clientMetaInfoMixin
