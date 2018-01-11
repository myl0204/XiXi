<template>
  <div class="content-wrapper">
    <v-map ref="map"></v-map>
    <map-input @geoBtnClick="getLocation"></map-input>
    <!-- <List></List> -->
  </div>
</template>

<script>
import vMap from '@@/map/Map'
import MapInput from '@@/mapinput/MapInput'
// import List from '@@/list/List'
export default {
  methods: {
    getLocation() {
      this.$refs.map.getLocation()
    }
  },
  components: {
    vMap,
    MapInput
    // List
  }
}
</script>

<style>
/* .content-wrapper {
  position: fixed;
  top: 84px;
  bottom: 0;
  left: 0;
  right: 0;
} */
</style>
