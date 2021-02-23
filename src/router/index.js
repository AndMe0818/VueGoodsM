import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login/Login.vue'
import Home from '../views/Home/Home.vue'
Vue.use(VueRouter)

const routes = [
  // 重定向回到登录
  { path: '/', redirect: '/login'},
  {path: '/login', component: Login },
  {path: '/home', component: Home },
 

]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
