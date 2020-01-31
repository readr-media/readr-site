import Vue from 'vue'
import 'es6-promise/auto'
// import { ROLE_MAP } from './constants'
import { createApp } from './app'
import { get } from 'lodash'
import { getToken, removeToken } from './util/services'
import ProgressBar from './components/ProgressBar.vue'
// import(/* webpackChunkName: "trace-worker" */ './trace-worker.js')

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

const debug = require('debug')('CLIENT:entry-client')
const { UserAgent } = require('express-useragent')
const { app, i18n, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

const expLocalhost = /localhost/
const expDev = /(dev)|(localhost)/
const expMobile = /^m/
const useragent = new UserAgent().parse(navigator.userAgent)
const { HOST, HOST_MOBILE } = get(store, 'state.setting')
const { host, pathname, search } = location

if (!expLocalhost.test(host)) {
  debug('STAGE:', expDev.test(host) ? 'DEV' : 'PROD')
  debug('CURR HOST:', host)
  if (HOST && HOST_MOBILE) {
    if ((useragent.isMobile || useragent.isTablet) && !expMobile.test(host)) {
      /** Redirect to mobile version */
      debug('GOING TO', `${HOST_MOBILE}${pathname}${search}`)
      location.replace(`${HOST_MOBILE}${pathname}${search}`)
    } else if (useragent.isDesktop && expMobile.test(host)) {
      /** Redirect to desktop version */
      debug('GOING TO', `${HOST}${pathname}${search}`)
      location.replace(`${HOST}${pathname}${search}`)
    } else {
      debug('WELL, DO NOTHING!')
    }
  }
}

// import Comments from 'readr-comment'
// Vue.use(Comments)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteEnter (to, from, next) {
    const cookie = getToken()
    debug('cookie:', cookie)
    const permission = get(to, [ 'meta', 'permission' ])
    const preRouteInit = cookie
      ? !get(store, 'state.DataUser.profile.role') || !get(store, 'state.DataUser.isLoggedIn')
        ? [
          store.dispatch('DataUser/CHECK_LOGIN_STATUS', { params: { cookie } }).then(() => debug('CHECKT LOGGIN STATUS')),
          store.dispatch('DataUser/GET_PROFILE', { params: { cookie } }).then(() => debug('FETCH DATA'))
        ]
        : [ new Promise((resolve) => resolve()) ]
      : [ new Promise((resolve) => resolve()) ]

    debug('router link enter somewhere.', to, from)
    debug('permission', permission)
    debug('cookie', cookie)
    Promise.all([
      ...preRouteInit
    ]).then(() => {
      debug(get(store, 'state.DataUser.profile.role'))
      debug(get(store, 'state.DataUser.isLoggedIn'))
      if (permission) {
        if (!cookie) {
          store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: 'on', message: '', to: to.path })
        } else {
          next()
        }
      } else {
        /** Route "to" doesn't have any permission setting. So, go to route "to" without problem. */
        debug(`Route "to" doesn't have any permission setting. So, go to route "to" without problem.`)
        next()
      }
    }).catch(errInfo => {
      debug('errInfo', errInfo)
      const domain = get(store, 'state.setting.DOMAIN')
      removeToken(domain).then(() => location.replace('/login?t=FADR42345FADS3'))
    })
  },
  beforeRouteUpdate (to, from, next) {
    debug('router link to somewhere.', to.fullPath)
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
        router: this.$router
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

debug('store.state.server_url', store.state.server_url)
debug('pathname', pathname)
if (store.state.server_url !== pathname) {
  router.push(store.state.server_url)
}
store.state.useragent = useragent

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
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to, i18n })))
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
if (location.protocol === 'https:' && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
  navigator.serviceWorker.ready.then(() => debug('Ready!', navigator.serviceWorker))
  navigator.serviceWorker.addEventListener('message', event => debug('Got Msg from dervice-worker!' + event.data))
}
