import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入路由守卫组件
import '@/router/premit'

// 引入自定义图标组件
import './icon'

// 全局引入按钮权限
import { buttonPermission } from './utils/buttonPermission'
Vue.prototype.btnPerm = buttonPermission

Vue.use(ElementUI)
Vue.use(VueCompositionApi)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
