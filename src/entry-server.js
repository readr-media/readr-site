import { filter, get, } from 'lodash'
import { ROLE_MAP, } from './constants'
import { createApp, } from './app' 
import { getProfile, } from './util/services'

const debug = require('debug')('READR:entry-server')
const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, i18n, router, store, } = createApp()

    const { url, cookie, initmember, } = context
    const { route, } = router.resolve(url)
    const { fullPath, } = route

    if (fullPath !== url) {
      return reject({ url: fullPath, })
    }

    const preRouteInit = cookie ? [
      getProfile(cookie),
    ] : [ new Promise((rslv) => rslv()), ]

    Promise.all(preRouteInit).then((res) => {
      const role = get(filter(ROLE_MAP, { key: get(res, [ 0, 'profile', 'role', ]), }), [ 0, 'route', ], 'visitor')
      const permission = get(route, [ 'meta', 'permission', ])
      const isInitMember = get(route, [ 'path', ]) === '/initmember'
      debug('role:', role)
      debug('permission:', permission)
      debug('url', url)

      let targUrl
      if ((permission && (role === 'visitor' || (permission !== role && permission !== 'member'))) || (isInitMember && !initmember)) {
        store.state.unauthorized = true
        if (!cookie) {
          router.push('/login')
          targUrl = '/login'
          store.state.targ_url = '/login'
        } else {
          router.push('/')
          targUrl = '/'
          store.state.targ_url = '/'
        }
      } else {
        router.push(url)
        targUrl = url
      }

      // wait until router has resolved possible async hooks
      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents(targUrl)
        // const matchedComponents = get(route, [ 'matched' ], [])
        // no matched routes
        if (!matchedComponents.length) {
          return reject({ code: 404, })
        }
        // Call fetchData hooks on components matched by the route.
        // A preFetch hook dispatches a store action and returns a Promise,
        // which is resolved when the action is complete and store state has been
        // updated.
        const jobs = matchedComponents.map(({ asyncData, }) => asyncData && asyncData({
          i18n,
          store,
          route: router.currentRoute,
        }))
        Promise.all(jobs).then(() => {
          isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
          // After all preFetch hooks are resolved, our store is now
          // filled with the state needed to render the app.
          // Expose the state on the render context, and let the request handler
          // inline the state in the HTML response. This allows the client-side
          // store to pick-up the server-side state without having to duplicate
          // the initial data fetching on the client.
          context.state = store.state
          resolve(app)
        }).catch(reject)
      }, reject)
    })
  })
}
