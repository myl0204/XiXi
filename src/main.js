// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
// import router from './router'
/* eslint-disable no-unused-vars */
import 'vue-awesome/icons'

Vue.config.productionTip = false
Vue.prototype.$http = axios
// console.log(Vue.prototype)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App }
})
