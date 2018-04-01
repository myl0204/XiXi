<template>
  <div class="content-wrapper">
    <v-map ref="map" @geoComplete="onGeoComplete"></v-map>
    <map-input ref="mapInput" @geoBtnClick="getLocation"></map-input>
    <!-- <List></List> -->
  </div>
</template>

<script>
import vMap from '../map/Map'
import MapInput from '@@/mapinput/MapInput'
// import List from '@@/list/List'
export default {
  beforeRouteEnter(to, from, next) {
    // 在进入content组件之前，“获取”等候时间
    next((context) => {
      context.$refs.map.$refs.marker.calculateTime()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.$refs.map.refreshTimeInfo()
    next()
  },
  methods: {
    getLocation() {
      this.$refs.map.geolocation.getCurrentPosition()
    },
    onGeoComplete() {
      this.$refs.mapInput.isGeo = false
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
