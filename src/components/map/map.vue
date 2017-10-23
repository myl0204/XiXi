<template>
  <div id="map-container" ref="map">
    <!-- <button class="btn" @click="getLocation">点我定位</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      myLatLng: {},
      address: '正在获取撸猫地点'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    }
  },
  methods: {
    init() {
      /* eslint-disable no-undef */
      // h5地图组件，前端定位。
      this.geolocation = new qq.maps.Geolocation()
      // 地址与经纬度转换
      this.locationToLatlng = new qq.maps.Geocoder()
      this.laglngToLocation = new qq.maps.Geocoder()
      // 定位城市(与curcity不同，该对象根据定位结果做出更改而不随用户点击更改)
      this.myCity = _DEFAULT_CITY && _DEFAULT_CITY.city ? _DEFAULT_CITY : undefined
      if (!this.myCity) {
        this.geolocation.getIpLocation((position) => {
          this.myCity = postion
          this.myLatLng = new qq.maps.LatLng(position.lag, position.lng)
          this.$store.commit('changeCity', position.city)
        }, () => {
          this.$store.commit('changeCity', '获取位置失败')
        })
      } else {
        this.$store.commit('changeCity', this.myCity.city)
      }
      this.myLatLng = new qq.maps.LatLng(_DEFAULT_CITY.lat, _DEFAULT_CITY.lng)
      let mapOptions = {
        disableDefaultUI: true,
        zoom: 15,
        center: this.myLatLng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      }
      // js API，初始化地图类
      this.map = new qq.maps.Map(this.$refs.map, mapOptions)
      this._initGetLocBtn()

      // this.getLocation() 首次调用已经通过watch curCity来调用，不用再重复调用了
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
    getLocation() {
      this.geolocation.getLocation(this.moveCenter, this.getIpLocation)
    },
    getIpLocation() {
      this.geolocation.getIpLocation(this.moveCenter, this.getLocationFailed)
    },
    moveCenter(position) {
      this.myLatLng = new qq.maps.LatLng(position.lat, position.lng)
      this.map.panTo(this.myLatLng)
      this.getAddress()
    },
    getAddress() {
      this.laglngToLocation.getAddress(this.myLatLng)
      this.laglngToLocation.setComplete((result) => {
        this.address = result.detail.nearPois[0].name
      })
    },
    getLocationFailed() {
      alert('获取位置失败')
    }
  },
  watch: {
    myLatLng() {
      // console.log(`map,latlng`)
      if (this.map) {
        // console.log(`map true`)
        this.map.panTo(this.myLatLng)
      }
      // this.map.panTo(this.myLatLng)
    },
    curCity(newCity) {
      // console.log(newCity, this.myCity)
      if (newCity === this.myCity.city) {
        console.log(`watch内`)
        this.getLocation()
      } else {
        let newAddress = newCity + '市政府'
        this.locationToLatlng = new qq.maps.Geocoder()
        this.locationToLatlng.getLocation(newAddress)
        this.locationToLatlng.setComplete((result) => {
          let {lat, lng} = result.detail.location
          console.log(`watch curCity` + lat, lng)
          this.myLatLng = new qq.maps.LatLng(lat, lng)
          console.log(lat, lng)
        })
      }
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
