import Vue from 'vue'
import Router from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import { ReadrPerm, } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

// route-level code splitting
const ManageAdmin = () => import('../views/ManageAdmin.vue')
const ManageEditor = () => import('../views/ManageEditor.vue')
const ManageGuestEditor = () => import('../views/ManageGuestEditor.vue')
const ManageMember = () => import('../views/ManageMember.vue')
const PublicAbout = () => import('../views/PublicAbout.vue')
const PublicAgreement = () => import('../views/PublicAgreement.vue')
const PublicEditors = () => import('../views/PublicEditors.vue')
const PublicHome = () => import('../views/PublicHome.vue')
const PublicLogin = () => import('../views/PublicLogin.vue')
const PublicPageNotFound = () => import('../views/PublicPageNotFound.vue')
const PublicProfile = () => import('../views/PublicProfile.vue')
const PublicProjects = () => import('../views/PublicProjects.vue')
const PublicSearch = () => import('../views/PublicSearch.vue')
const PublicServerError = () => import('../views/PublicServerError.vue')
const PublicSetPassword = () => import('../views/PublicSetPassword.vue')
// const PublicVideos = () => import('../views/PublicVideos.vue')

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
    { path: '/post/:postId?', component: PublicHome, meta: { permission: 'member', }, alias: '/', },
    { path: '/hot', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/about', component: PublicAbout, meta: { permission: 'member', }, },
    { path: '/admin', component: ManageAdmin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: PublicAgreement, },
    { path: '/editor', component: ManageEditor, meta: { permission: 'editor', }, },
    { path: '/editors', component: PublicEditors, meta: { permission: 'member', }, },
    { path: '/guesteditor', component: ManageGuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: PublicLogin, },
    { path: '/member', component: ManageMember, meta: { permission: 'member', }, },
    { path: '/post/:postId', component: PublicHome, meta: { permission: 'member', }, },
    { path: '/profile/:id', component: PublicProfile, meta: { permission: 'member', }, },
    { path: '/projects', component: PublicProjects, meta: { permission: 'member', }, },
    { path: '/search/:keyword', component: PublicSearch, meta: { permission: 'member', }, },
    { path: '/setup/:type', component: PublicSetPassword, },
    { path: '/404', component: PublicPageNotFound, },
    { path: '/500', component: PublicServerError, },
    // { path: '/videos', component: PublicVideos },
  ],
})

export function createRouter () {
  return router
}
