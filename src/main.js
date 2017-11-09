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

// const SUC_CODE = 0
// let allCity
// axios.get('/api/citylist')
// .then((res) => {
//   if (res.status >= 200 && res.status < 300 || res.status === 304) {
//     if (res.data.errno === SUC_CODE) {
//       allCity = res.data.data
//     }
//   }
// })
/* eslint-disable new-cap */
const store = new Vuex.Store({
  state: {
    curCity: '获取城市中',
    address: '正在获取你的地点',
    listShowFlag: true,
    pHolder: '',
    listType: 0,
    cityInput: '',
    locationInput: ''
    // allCity: allCity
  },
  mutations: {
    changeCity(state, newCity) {
      state.curCity = newCity
    },
    changeAddress(state, newAddr) {
      state.address = newAddr
    },
    showList(state, payload) {
      state.listShowFlag = true
      state.pHolder = payload.pHolder
    },
    hideList(state) {
      state.listShowFlag = false
      state.pHolder = ''
    },
    toggleList(state, payload) {
      state.listType = payload.listType
      state.pHolder = payload.pHolder
    },
    cityInputChanged(state, newVal) {
      state.cityInput = newVal
    },
    locationInputChanged(state, newVal) {
      state.locationInput = newVal
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
