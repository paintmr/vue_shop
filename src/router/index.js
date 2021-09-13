import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/', redirect: '/login'// 只要用戶訪問根路徑，就重定向到login
  },
  {
    path: '/login', component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
