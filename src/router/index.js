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
const PublicPage = () => import('../views/PublicPage.vue')
const PublicPageWithAside = () => import('../views/PublicPageWithAside.vue')
const PublicPageNotFound = () => import('../views/PublicPageNotFound.vue')
const PublicProfile = () => import('../views/PublicProfile.vue')
const PublicSearch = () => import('../views/PublicSearch.vue')
const PublicServerError = () => import('../views/PublicServerError.vue')
const PublicSetPassword = () => import('../views/PublicSetPassword.vue')
const PublicComment = () => import('../views/PublicComment.vue')
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
    { path: '/post/:postId?', component: PublicHome, alias: '/', },
    { path: '/hot', component: PublicHome, },
    { path: '/about', component: PublicAbout, },
    { path: '/admin/:panel?/:tool?', component: ManageAdmin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: PublicAgreement, },
    { path: '/editor/:panel?/:tool?', component: ManageEditor, meta: { permission: 'editor', }, },
    { path: '/editors', component: PublicEditors, },
    { path: '/guesteditor/:panel?/:tool?', component: ManageGuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: PublicLogin, },
    { path: '/member/:panel?/:tool?', component: ManageMember, meta: { permission: 'member', }, },
    { path: '/series/:slug/:subItem?', component: PublicPageWithAside, },
    { path: '/profile/:id', component: PublicProfile, },
    { path: '/search/:keyword', component: PublicSearch, },
    { path: '/series-list', component: PublicPage, },
    { path: '/tag/:tagId', component: PublicPageWithAside, props: { hasLeading: false, }, },
    { path: '/setup/:type', component: PublicSetPassword, },
    { path: '/comment', component: PublicComment, props: (route) => ({ resourceURL: route.query.resource_url, }), },
    { path: '/404', component: PublicPageNotFound, },
    { path: '/500', component: PublicServerError, },
    // { path: '/videos', component: PublicVideos },
  ],
})

export function createRouter () {
  return router
}
