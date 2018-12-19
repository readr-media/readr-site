import Vue from 'vue'
import Router from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import { ReadrPerm, } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

// route-level code splitting
const AboutContentPoints = () => import('src/components/about/AboutContentPoints.vue')
const EmbedPoll = () => import('../views/EmbedPoll.vue')
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
const PublicProjectList = () => import('../views/PublicProjectList.vue')
const PublicProject = () => import('../views/PublicProject.vue')
const PublicProfile = () => import('../views/PublicProfile.vue')
const PublicSearch = () => import('../views/PublicSearch.vue')
const PublicServerError = () => import('../views/PublicServerError.vue')
const PublicSetPassword = () => import('../views/PublicSetPassword.vue')
const PublicTag = () => import('../views/PublicTag.vue')
const PublicComment = () => import('../views/PublicComment.vue')
const PublicLoginPanel = () => import('../views/PublicLoginPanel.vue')
const PublicPlugins = () => import('../views/PublicPlugins.vue')
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
    { path: '/about/:subpath?',
      component: PublicAbout,
      children: [
        {
          path: 'points',
          component: AboutContentPoints,
        },
      ],
    },
    { path: '/admin/:panel?/:tool?', component: ManageAdmin, meta: { permission: 'admin', }, },
    { path: '/agreement', component: PublicAgreement, },
    { path: '/editor/:panel?/:tool?', component: ManageEditor, meta: { permission: 'editor', }, },
    { path: '/editors', component: PublicEditors, },
    { path: '/guesteditor/:panel?/:tool?', component: ManageGuestEditor, meta: { permission: 'guesteditor', }, },
    { path: '/login', component: PublicLogin, },
    { path: '/login-panel', component: PublicLoginPanel, },
    { path: '/member/:panel?/:tool?', component: ManageMember, meta: { permission: 'member', }, },
    { path: '/series/:slug/:subItem?', component: PublicProject, },
    { path: '/embed/poll/:id', component: EmbedPoll, },
    { path: '/profile/:id', component: PublicProfile, },
    { path: '/search/:keyword', component: PublicSearch, },
    { path: '/series-list', component: PublicProjectList, },
    { path: '/tag/:tagId', component: PublicTag, },
    { path: '/setup/:type', component: PublicSetPassword, },
    { path: '/comment', component: PublicComment, props: (route) => ({ resourceURL: route.query.resource_url, }), },
    { path: '/plugins/:pluginName', component: PublicPlugins, },
    { path: '/404', component: PublicPageNotFound, },
    { path: '/500', component: PublicServerError, },
    // { path: '/videos', component: PublicVideos },
    { path: '*', component: PublicPageNotFound, },
  ],
})

export function createRouter () {
  return router
}
