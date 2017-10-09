<template>
  <div id="map-container" ref="map">
    <button class="btn" @click="getLocation">点我定位</button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    succ(pos) {
      console.log(pos)
    },
    error(err) {
      console.log(err.code)
    },
    test2() {
      navigator.geolocation.getCurrentPosition(this.succ, this.error)
    },
    init() {
      /* eslint-disable no-undef */
      this.geolocation = new qq.maps.Geolocation()
      console.log(_DEFAULT_CITY)
      this.myLatlng = new qq.maps.LatLng(_DEFAULT_CITY.lat, _DEFAULT_CITY.lng)
      let myOptions = {
        disableDefaultUI: true,
        zoom: 15,
        center: this.myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      }
      this.map = new qq.maps.Map(this.$refs.map, myOptions)
      this.getLocation()
      // this.getl()
    },
    _getLocation() {
      return new Promise((resolve, reject) => {
        console.log(this, 0)
        if (navigator.geolocation) {
          resolve(this.moveCenter, this.test3)
        } else {
          reject('浏览器不支持')
        }
      })
    },
    getLocation() {
      this._getLocation().then((sucCb, errCb) => {
        console.log(this, 1)
        this.geolocation.getLocation(sucCb, errCb)
      }, (err) => {
        alert(err)
      })
    },
    // getl() {
    //   this.geolocation.getLocation(this.moveCenter, this.test3)
    // },
    // getIpLocation(sucCb, errCb) {
    //   this.geolocation.getIpLocation(sucCb, errCb)
    // },
    moveCenter(position) {
      this.myLatlng = new qq.maps.LatLng(position.lat, position.lng)
      this.map.panTo(this.myLatlng)
    },
    test3() {
      console.log('no')
    }
  }
}
</script>

<style lang="scss">
  #map-container {
    position: fixed!important;
    left: 0;
    top: 80px;
    bottom: 0;
    width: 100%;
    .btn {
      // width: 200px;
      // height: 200px;
      position: relative;
      z-index: 10;
    }
  }
</style>
