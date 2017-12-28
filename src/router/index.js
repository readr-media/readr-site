import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor)
}

// route-level code splitting
const Admin = () => import('../views/Admin.vue')
const Agreement = () => import('../views/Agreement.vue')
const GuestEditor = () => import('../views/GuestEditor.vue')
const Index = () => import('../views/index.vue')
const Login = () => import('../views/Login.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: Index },
      { path: '/admin', component: Admin },
      { path: '/agreement', component: Agreement },
      { path: '/guesteditor', component: GuestEditor },
      { path: '/login', component: Login }
    ]
  })
}
