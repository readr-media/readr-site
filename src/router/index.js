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
const Editor = () => import('../views/Editor.vue')
const GuestEditor = () => import('../views/GuestEditor.vue')
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Post = () => import('../views/Post.vue')
const SetPassword = () => import('../views/SetPassword.vue')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/admin', component: Admin, meta: { permission: 'admin' }},
    { path: '/agreement', component: Agreement },
    { path: '/editor', component: Editor, meta: { permission: 'editor' }},
    { path: '/guesteditor', component: GuestEditor, meta: { permission: 'guesteditor' }},
    { path: '/login', component: Login },
    { path: '/initmember', component: SetPassword },
    { path: '/post/:id', component: Post }
  ]
})

export function createRouter () {
  return router
}
