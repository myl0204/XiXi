<template>
  <div id="app">
    <v-header></v-header>
    <v-map></v-map>
    <map-input></map-input>
    <List></List>
  </div>
</template>

<script>
import Header from '@@/header/Header'
import vMap from '@@/map/Map'
import MapInput from '@@/mapinput/MapInput'
import List from '@@/list/List'

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
  },
  methods: {
    test() {
      this.$store.commit('showList', {})
    }
  }
}
</script>

<style lang="scss">

</style>
