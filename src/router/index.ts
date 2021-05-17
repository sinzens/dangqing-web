import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'BasicModel',
        component: () => import('../views/BasicModel.vue')
      },
      {
        path: 'BatchTable',
        component: () => import('../views/BatchTable.vue')
      },
      {
        path: 'AtdPathTable',
        component: () => import('../views/AtdPathTable.vue')
      },
      {
        path: 'DtaPathTable',
        component: () => import('../views/DtaPathTable.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
