import Vue from 'vue'
import 'es6-promise/auto'
import { ROLE_MAP, } from './constants'
import { createApp, } from './app'
import { filter, get, } from 'lodash'
import ProgressBar from './components/ProgressBar.vue'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

const debug = require('debug')('CLIENT:entry-client')
let isInitialized = false

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteEnter (to, from, next) {
    debug('router link enter somewhere.', to, from)
    next(vm => {
      debug('isInitialized is true', isInitialized)
      if (!isInitialized) {
        isInitialized = true        
      } else {
        const role = get(filter(ROLE_MAP, { key: get(vm, '$store.state.profile.role'), }), [ 0, 'route', ], 'visitor')
        const permission = get(to, [ 'meta', 'permission', ])
        debug('role/permission', role, permission)
        if (permission && (role === 'visitor' || (permission !== role && permission !== 'member'))) {
          debug('Forbidden to go "to".')
          next(from)
        }
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    debug('router link to somewhere.', to.fullPath)
    const { asyncData, } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      }).then(next).catch(next)
    } else {
      next()
    }
  },
})

const { app, i18n, router, store, } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

if (store.state.unauthorized) {
  debug('entry-client resolved.')
  delete store.state.unauthorized
  router.push(store.state.targ_url)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to, i18n, })))
      .then(() => {
        bar.finish()
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

// service worker
if ('https:' === location.protocol && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}
