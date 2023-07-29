import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'default-passive-events' // 解决谷歌滑动警告问题
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import PageWrap from '@/components/PageWrap' // 容器自适应
import Pagination from "@/components/el-pagination";  // 分页封装
import Print from 'vue-print-nb'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control


 
Vue.use(ElementUI, { size: 'small' })

Vue.component('PageWrap', PageWrap)
Vue.component('myPagination', Pagination)
Vue.use(Print)


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
