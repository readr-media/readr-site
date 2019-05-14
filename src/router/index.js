import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

const AppHome = () => import('../views/AppHome.vue')
const AppPost = () => import('../views/AppPost.vue')
const AppReport = () => import('../views/AppReport.vue')

const PublicPageNotFound = () => import('../views/PublicPageNotFound.vue')
const PublicServerError = () => import('../views/PublicServerError.vue')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { y: 0 }
    }
  },
  routes: [
    { name: 'home', path: '/', component: AppHome },
    { name: 'post', path: '/post/:postId?', component: AppPost },
    { name: 'report', path: '/report/:slug', component: AppReport },
    { path: '/404', component: PublicPageNotFound },
    { path: '/500', component: PublicServerError },
    { path: '*', component: PublicPageNotFound }
  ]
})

export function createRouter () {
  return router
}
