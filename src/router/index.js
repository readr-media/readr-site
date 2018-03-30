import Vue from 'vue'
import Router from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import { ReadrPerm, } from '../util/services'

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
const Member = () => import('../views/Member.vue')
const PageNotFound = () => import('../views/PageNotFound.vue')
const Profile = () => import('../views/Profile.vue')
const ProjectsList = () => import('../views/ProjectsList.vue')
const Search = () => import('../views/Search.vue')
const ServerError = () => import('../views/ServerError.vue')
const SetPassword = () => import('../views/SetPassword.vue')
// const Videos = () => import('../views/Videos.vue')

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: (to, from) => {
    const keepPosition = [
      {
        from: '/',
        to: '/post/:postId',
      },
      {
        from: '/hot',
        to: '/post/:postId',
      },
      {
        from: '/post/:postId',
        to: '/',
      },
      {
        from: '/post/:postId',
        to: '/hot',
      },
    ]
    .map(route =>({ from: pathToRegexp(route.from), to: pathToRegexp(route.to), }))
    .reduce((acc, cur) => acc || (cur.from.test(from.path) && cur.to.test(to.path)), false)

    if (!keepPosition) {
      return { y: 0, }
    }
  },
  routes: [
    { path: '/', component: Home, alias: '/hot', meta: { permission: 'member', }, },
    { path: '/admin', component: Admin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: Agreement, },
    { path: '/editor', component: Editor, meta: { permission: 'editor', }, },
    { path: '/editors', component: Editors, meta: { permission: 'member', }, },
    { path: '/guesteditor', component: GuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: Login, },
    { path: '/member', component: Member, meta: { permission: 'member', }, },
    { path: '/post/:postId', component: Home, meta: { permission: 'member', }, },
    { path: '/profile/:id', component: Profile, meta: { permission: 'member', }, },
    { path: '/projects', component: ProjectsList, meta: { permission: 'member', }, },
    { path: '/search/:keyword', component: Search, meta: { permission: 'member', }, },
    { path: '/setup/:type', component: SetPassword, },
    { path: '/404', component: PageNotFound, },
    { path: '/500', component: ServerError, },
    // { path: '/videos', component: Videos },
  ],
})

export function createRouter () {
  return router
}
