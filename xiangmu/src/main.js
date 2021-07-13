import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 配置element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入全局样式表
import './assets/css/global.css'

//导入字体图标
import './assets/font_2671310_jaole5x9p2/iconfont.css' 

// 配置axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
