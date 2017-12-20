// import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
// import { PROJECTS } from '../constants'

Vue.use(Router)

// route-level code splitting
const Index = () => import('../views/index.vue')
const Login = () => import('../views/Login.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: Index },
      { path: '/login', component: Login }
    ]
  })
}
