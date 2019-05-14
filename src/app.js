import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
// import titleMetaMixin from './util/titleMeta'
import * as filters from './util/filters'

import ZHTW from 'src/locale/zh-TW'
import EN from 'src/locale/en'
import VueI18n from 'vue-i18n'
import VueMeta from 'vue-meta'
import VueLazyload from 'vue-lazyload'
import InfiniteLoading from 'vue-infinite-loading'

Vue.use(VueI18n)
Vue.use(VueMeta)
Vue.use(VueLazyload, {
  lazyComponent: true
})
Vue.use(InfiniteLoading, {
  props: {
    spinner: 'spiral'
  },
  slots: {
    noResults: '',
    noMore: ''
  }
})
Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

// Quill Editor
if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')

  const Block = VueQuillEditor.Quill.import('blots/block')
  const BlockEmbed = VueQuillEditor.Quill.import('blots/block/embed')
  class Hr extends BlockEmbed {
    static create (value) {
      const node = super.create(value)
      return node
    }
  }
  Hr.blotName = 'hr'
  Hr.tagName = 'hr'

  class Figcaption extends Block {
    static create () {
      let node = super.create()
      node.innerText = node.innerText || `請在此輸入圖說`
      return node
    }
  }
  Figcaption.blotName = 'figcaption'
  Figcaption.tagName = 'figcaption'

  VueQuillEditor.Quill.register({ 'formats/hr': Hr })
  VueQuillEditor.Quill.register({ 'formats/figcaption': Figcaption })
  Vue.use(VueQuillEditor)
}

// mixin for handling title
// Vue.mixin(titleMetaMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  const messages = {
    'zh-TW': ZHTW,
    'en': EN
  }
  const i18n = new VueI18n({
    locale: 'zh-TW', // set locale
    messages // set locale messages
  })

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, i18n, router, store }
}
