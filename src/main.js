import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './assets/css/golbole.css'
import axios from './network/axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入其样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 将富文本编辑器 全局注册
Vue.use(VueQuillEditor)

// 全局挂载 axios 封装
Vue.prototype.$http = axios

// 引入 table-tree插件
import TreeTable from 'vue-table-with-tree-grid'
// 注册全局组件
Vue.component('tree-table', TreeTable)

// 注册全局 过滤器

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  //  getMonth()从 0开始 加1
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
