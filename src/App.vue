<template>
  <div id="app">
    <!-- <v-header></v-header> -->
    <!-- <router-view></router-view> -->
    <!-- <v-map></v-map> -->
    <!-- <map-input :allCity="allCity"></map-input> -->
    <List></List>
  </div>
</template>

<script>
import Header from '@@/header/Header'
import vMap from '@@/map/Map'
import MapInput from '@@/mapinput/MapInput'
import City from '@@/city/City'
import List from '@@/list/List'
const SUC_CODE = 0

export default {
  name: 'app',
  components: {
    'v-header': Header,
    'v-map': vMap,
    MapInput,
    List
  },
  beforeMount() {
    let a = document.getElementById('box-wrapper')
    document.body.removeChild(a)
  }
}
</script>

<style lang="scss">

</style>
