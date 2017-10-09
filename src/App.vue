<template>
  <div id="app">
    <v-header></v-header>
    <!-- <router-view></router-view> -->
    <v-map></v-map>
  </div>
</template>

<script>
import Header from '@@/header/Header'
import vMap from '@@/map/Map'
export default {
  name: 'app',
  components: {
    'v-header': Header,
    'v-map': vMap
  }
}
</script>

<style lang="scss">

</style>
