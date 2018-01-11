<template>
  <div id="app" @touchmove.prevent="touchmove">
    <v-header></v-header>
    <!-- <router-link to="/"></router-link> -->
    <router-view></router-view>
    <!-- <v-map ref="map"></v-map> -->
    <!-- <map-input @geoBtnClick="getLocation"></map-input> -->
    <List></List>
    <User></User>
    <LogIn></LogIn>
  </div>
</template>

<script>
import Header from '@@/header/Header'
import LogIn from '@@/userlogin/LogIn'
import User from '@@/user/User'
import List from '@@/list/List'
import util from '@/common/js/util.js'
import router from '@/router/index.js'
router.push({name: 'content', params: {catType: 'fast'}})
export default {
  name: 'app',
  router,
  components: {
    'v-header': Header,
    // 'v-map': vMap,
    // MapInput,
    List,
    User,
    LogIn
  },
  created() {
    const cookie = util.getCookie()
    let user = cookie.uid
    if (user) {
      this.$store.commit('changeUser', user)
    }
  },
  beforeMount() {
    let a = document.getElementById('box-wrapper')
    document.body.removeChild(a)
  },
  methods: {
    getLocation() {
      this.$refs.map.getLocation()
    },
    touchmove() {

    }
  }
}
</script>

<style lang="scss">
@import './common/scss/base.scss';
</style>
