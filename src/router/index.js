import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/access/Roles.vue'

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
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 为路由对象添加beforeEach导航守卫
// to 将要访问的路径； from 从哪个路径跳转而来； next是一个函数，表示放行，去执行下面的内容。
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页面，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
