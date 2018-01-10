import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor)
}

// route-level code splitting
const Admin = () => import('../views/Admin.vue')
const Agreement = () => import('../views/Agreement.vue')
const GuestEditor = () => import('../views/GuestEditor.vue')
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/admin', component: Admin, meta: { requiresAuth: true, permission: 'admin' }},
    { path: '/agreement', component: Agreement },
    { path: '/guesteditor', component: GuestEditor, meta: { requiresAuth: true }},
    { path: '/login', component: Login }
  ]
})

router.beforeEach((to, from, next) => {
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  // }
  next()
})

export function createRouter () {
  return router
}
