<template>
  <div class="content-wrapper">
    <v-map
      ref="map"
      @geoComplete="onGeoComplete"/>
    <map-input
      ref="mapInput"
      :isGeo="isGeo"
      @geoBtnClick="getLocation"/>
  </div>
</template>

<script>
import vMap from '@@/map/Map'
import MapInput from '@@/mapinput/MapInput'
export default {
  name: 'vContent',
  beforeRouteEnter(to, from, next) {
    // 在进入content组件之前，“获取”等候时间
    next((context) => {
      context.$refs.map.$refs.marker.calculateTime()
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 切换猫种时刷新等待时间
    this.$refs.map.refreshTimeInfo()
    next()
  },
  data() {
    return {
      isGeo: false
    }
  },
  methods: {
    getLocation() {
      this.isGeo = true
      this.$refs.map.geolocation.getCurrentPosition()
    },
    onGeoComplete() {
      this.isGeo = false
    }
  },
  components: {
    vMap,
    MapInput
  }
}
</script>

<style>
</style>
