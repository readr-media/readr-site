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
const Editors = () => import('../views/Editors.vue')
const GuestEditor = () => import('../views/GuestEditor.vue')
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Post = () => import('../views/Post.vue')
const ProjectsList = () => import('../views/ProjectsList.vue')
const Search = () => import('../views/Search.vue')
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
    { path: '/editors', component: Editors },
    { path: '/guesteditor', component: GuestEditor, meta: { permission: 'guesteditor' }},
    { path: '/login', component: Login },
    { path: '/post/:id', component: Post },
    { path: '/projects', component: ProjectsList },
    { path: '/search', component: Search },
    { path: '/setup/:type', component: SetPassword },
  ]
})

export function createRouter () {
  return router
}
