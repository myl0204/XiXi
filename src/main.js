// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
// import router from './router'
/* eslint-disable no-unused-vars */
import 'vue-awesome/icons'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(Vuex)
/* eslint-disable new-cap */
const store = new Vuex.Store({
  state: {
    curCity: '获取城市中'
  },
  mutations: {
    changeCity(state, city) {
      state.curCity = city
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  store,
  template: '<App/>',
  components: { App }
})
