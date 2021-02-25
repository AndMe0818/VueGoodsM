import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login/Login.vue'
import Home from '../views/Home/Home.vue'
import Welcome from '../views/Home/Welcome.vue'
import User from '../views/Home/User.vue'
Vue.use(VueRouter)

const routes = [
  // 重定向回到登录
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  //  to 表示去访问的路径
  // from 表示 从哪来
  // next 是个函数，表示放行   next() 放行  next('/xxx')强制跳转
  if (to.path === '/login') return next()
  // 如果不是 login
  const tokenStr = window.sessionStorage.getItem('token')
  if (tokenStr) return next()
  next('/login')
})

export default router
