import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index'
import index from '../views/index/index'
import layout from '../views/layout/index'
import my from '../views/my/index'
import search from '../views/search/index'
import searchResult from '../views/searchResult/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/layout',
    component: layout,
    children: [
      {
        path: '/index',
        component: index
      },
      {
        path: '/my',
        component: my
      },
      {
        path: '/search',
        component: search
      }
    ]
  },
  {
    path: '/searchResult',
    component: searchResult
  }
]

const router = new VueRouter({
  routes
})

export default router
