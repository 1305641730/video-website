import Vue from 'vue'
import App from './App.vue'

import router from './router'
import ElementUI from 'element-ui'
import moment from 'moment'
import store from './store.js'
// 引入 elementui 样式表
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$moment = moment
// 汉化
moment.locale('zh-cn')

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
