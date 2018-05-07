import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ipCity: '暂无城市信息',
    curCity: '获取城市中',
    address: {
      name: '正在获取你的地点',
      lngLat: {}
    },
    nearPois: [],
    searchPois: [],
    suggestedPois: [],
    isSearchingInfoVisible: false,
    isSearchingErrorInfoVisible: false,
    isListVisible: false,
    placeholder: '',
    listType: 1,
    listSubType: 0,
    cityInput: '',
    locationInput: '',
    isUserVisible: false,
    currentUser: '',
    logInStep: 0
  },
  mutations: {
    setIpCity(state, city) {
      state.ipCity = city
    },
    updateCity(state, newCity) {
      state.curCity = newCity
    },
    changeAddress(state, payload) {
      state.address = payload
    },
    changeNearPois(state, newPois) {
      state.nearPois = newPois
    },
    changeSearchPois(state, newPois) {
      state.searchPois = newPois
    },
    changeSuggestedPois(state, newPois) {
      state.suggestedPois = newPois
    },
    showSearchingInfo(state) {
      state.isSearchingInfoVisible = true
    },
    hideSearchingInfo(state) {
      state.isSearchingInfoVisible = false
    },
    showSearchingErrorInfo(state) {
      state.isSearchingErrorInfoVisible = true
    },
    hideSearchingErrorInfo(state) {
      state.isSearchingErrorInfoVisible = false
    },
    showList(state) {
      state.isListVisible = true
    },
    hideList(state) {
      state.isListVisible = false
    },
    toggleList(state, payload) {
      state.listType = payload.listType
      state.placeholder = payload.placeholder
      state.listSubType = payload.listSubType
    },
    updateCityInput(state, newVal) {
      state.cityInput = newVal
    },
    locationInputChanged(state, newVal) {
      state.locationInput = newVal
    },
    showUser(state) {
      state.isUserVisible = true
    },
    hideUser(state) {
      state.isUserVisible = false
    },
    changeUser(state, newUser) {
      state.currentUser = newUser
    },
    changeLogInStepTo(state, step) {
      state.logInStep = step
    }
  }
})
