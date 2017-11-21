<template>
  <div id="app">
    <v-header></v-header>
    <v-map ref="map"></v-map>
    <map-input @geoBtnClick="getLocation"></map-input>
    <List></List>
    <User></User>
    <LogIn></LogIn>
  </div>
</template>

<script>
import Header from '@@/header/Header'
import vMap from '@@/map/Map'
import MapInput from '@@/mapinput/MapInput'
import List from '@@/list/List'
import LogIn from '@@/userlogin/LogIn'
import User from '@@/user/User'
import util from '@/common/js/util.js'
export default {
  name: 'app',
  components: {
    'v-header': Header,
    'v-map': vMap,
    MapInput,
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
    }
  }
}
</script>

<style lang="scss">
@import './common/scss/base.scss';
</style>
