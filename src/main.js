import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './registerServiceWorker'
import './assets/css/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import components from '@/components/common'
import directives from './directives'
import filters from './filters'
import plugin from './plugin'
import Component from 'vue-class-component'

/* 网络请求接口 */
import * as $api from './http/api'
Vue.prototype.$api = $api

Vue.use(ElementUI)
Vue.use(directives)
Vue.use(filters)
Vue.use(plugin)
Vue.use(Component)
Vue.use(components)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
