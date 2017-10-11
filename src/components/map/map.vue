<template>
  <div id="map-container" ref="map">
    <!-- <button class="btn" @click="getLocation">点我定位</button> -->
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
    init() {
      /* eslint-disable no-undef */
      this.geolocation = new qq.maps.Geolocation() // h5地图组件
      // console.log(_DEFAULT_CITY)
      this.myLatlng = new qq.maps.LatLng(_DEFAULT_CITY.lat, _DEFAULT_CITY.lng)
      let myOptions = {
        disableDefaultUI: true,
        zoom: 15,
        center: this.myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      }
      this.map = new qq.maps.Map(this.$refs.map, myOptions) // js API
      this._initGetLocBtn()
      this.getLocation()
    },
    _initGetLocBtn() {
      let locBtn = document.createElement('button')
      locBtn.className = 'btn'
      locBtn.innerText = 'dianwo'
      locBtn.index = 1
      locBtn.addEventListener('click', () => {
        this.getLocation()
      })
      this.map.controls[qq.maps.ControlPosition.LEFT_TOP].push(locBtn)
    },
    _getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          resolve(this.moveCenter, this.getLocationFailed)
        } else {
          reject('浏览器不支持')
        }
      })
    },
    getLocation() {
      this._getLocation().then((sucCb, errCb) => {
        this.geolocation.getLocation(sucCb, errCb)
        this.map.setZoom(15)
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
      this.map.panTo(this.myLatlng, 1000)
    },
    getLocationFailed() {
      alert('获取位置失败')
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
    z-index: -1;
    .btn {
      // width: 200px;
      // height: 200px;
      position: relative;
      z-index: 10;
    }
  }
</style>
