import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './assets/css/golbole.css'
import axios from './network/axios'

// 引入 table-tree插件
import TreeTable from 'vue-table-with-tree-grid'
// 注册全局组件
Vue.component('tree-table',TreeTable);


Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
