import Vue from 'vue'
import 'es6-promise/auto'
import { ROLE_MAP, } from './constants'
import { createApp, } from './app'
import { filter, get, } from 'lodash'
import { getProfile, } from './util/services'
import ProgressBar from './components/ProgressBar.vue'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

const debug = require('debug')('CLIENT:entry-client')
let isInitializedStatus = 0

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteEnter (to, from, next) {
    debug('router link enter somewhere.', to, from)
    debug('isInitialized is true', isInitializedStatus)
    if (isInitializedStatus === 1) {
      isInitializedStatus = 2
      next()
    } else {
      const permission = get(to, [ 'meta', 'permission', ])
      if (permission) {
        getProfile()
        .then((profile) => {
          const role = get(filter(ROLE_MAP, { key: get(profile, 'role'), }), [ 0, 'route', ], 'visitor')
          if (permission !== 'member' && permission !== role) {
            /** User doesn't have the right to go to route "to". So, go back to route "from" */
            debug(`User doesn't have the right to go to route "to". So, go back to route "from"`)
            next(from)
          } else {
            /** User approved to go to route "to". */
            debug(`User approved to go to route "to".`)
            next()
          }
        })
        .catch(() => {
          /** Cookie doesn't exist or fetching the profile in fail. So, go back to route "from". */
          debug(`Cookie doesn't exist or fetching the profile in fail. So, go back to route "/login".`)
          next('/login')
        })
      } else {
        /** Route "to" doesn't have any permission setting. So, go to route "to" without problem. */
        debug('Route "from" doesnt have any permission setting.')
        next()
      }
    }
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
  isInitializedStatus = 1
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
