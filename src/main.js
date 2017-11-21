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
    customAddress: {
      name: '',
      latLng: {}
    },
    nearPois: [],
    listShowFlag: false,
    pHolder: '',
    listType: 1,
    listSubType: 0,
    cityInput: '',
    locationInput: '',
    userShowFlag: false,
    currentUser: '',
    logInStep: 0
  },
  mutations: {
    changeCity(state, newCity) {
      state.curCity = newCity
    },
    changeAddress(state, newAddr) {
      state.address = newAddr
    },
    changeCustomAddress(state, newAddr) {
      state.customAddress = newAddr
    },
    changePois(state, newPois) {
      state.nearPois = newPois
    },
    showList(state) {
      state.listShowFlag = true
    },
    hideList(state) {
      state.listShowFlag = false
    },
    toggleList(state, payload) {
      state.listType = payload.listType
      state.pHolder = payload.pHolder
      state.listSubType = payload.listSubType
    },
    cityInputChanged(state, newVal) {
      state.cityInput = newVal
    },
    locationInputChanged(state, newVal) {
      state.locationInput = newVal
    },
    showUser(state) {
      state.userShowFlag = true
    },
    hideUser(state) {
      state.userShowFlag = false
    },
    // showLogIn(state) {
    //   state.logInShowFlag = true
    //   // state.uid = uid
    // },
    hideLogIn(state) {
      state.logInShowFlag = false
    },
    changeUser(state, newUser) {
      state.currentUser = newUser
    },
    changeLogInStepTo(state, step) {
      state.logInStep = step
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
