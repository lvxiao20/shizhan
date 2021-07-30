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
import './assets/font_2671310_eulutyu9mcb/iconfont.css' 

// 配置axios
import axios from 'axios'

// 配置属性插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import VueAxios from 'vue-axios'
//配置路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
