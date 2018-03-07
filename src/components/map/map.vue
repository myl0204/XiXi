<template>
  <div id="map-container" ref="map">
    <!-- <button class="btn" @click="getLocation">点我定位</button> -->
    <map-marker ref="marker" :timeInfoShowFlag="timeInfoShowFlag"></map-marker>
    <message 
      :message="'定位失败，请刷新重试'" 
      :iconName="'exclamation-circle'" 
      v-show="hasError"
      :delay="2000">
    </message>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import MapMarker from '@@/mapMarker/Marker'
import Message from '@@/message/Message'
import {fillTheScreen} from '@/common/js/util.js'
export default {
  data() {
    return {
      myLatLng: {},
      // address: '正在获取你的位置',
      from: 0,
      timeInfoShowFlag: true,
      hasError: false
    }
  },
  components: {
    Icon,
    MapMarker,
    Message
  },
  mounted() {
    this.$nextTick(() => {
      this._initMap()
    })
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    },
    address() {
      return this.$store.state.address
    }
  },
  methods: {
    // 切换猫种时，刷新“等候时间”，提升交互
    refreshTimeInfo() {
      this.timeInfoShowFlag = false
      setTimeout(() => {
        this.timeInfoShowFlag = true
      }, 200)
      this.$refs.marker.calculateTime()
    },
    // 初始化腾讯地图
    _initMap() {
      // 自适应高度
      const totalHeight = 86
      const target = this.$refs.map
      fillTheScreen({target, totalHeight})
      /* eslint-disable no-undef */
      // h5地图组件，前端定位。
      this.geolocation = new qq.maps.Geolocation()
      // 地址与经纬度互相转换
      this.locationToLatlng = new qq.maps.Geocoder()
      this.laglngToLocation = new qq.maps.Geocoder()
      // 定位城市(与curcity不同，该对象根据定位结果做出更改而不随用户点击更改)
      this.myCity = _DEFAULT_CITY && _DEFAULT_CITY.city ? _DEFAULT_CITY : undefined
      if (!this.myCity) {
        this.geolocation.getIpLocation((position) => {
          this.myCity = postion.city
          this.myLatLng = new qq.maps.LatLng(position.lag, position.lng)
          this.$store.commit('changeCity', position.city)
        }, () => {
          this.$store.commit('changeCity', '获取位置失败')
        })
      } else {
        this.$store.commit('changeCity', this.myCity.city)
      }
      // 初始化经纬度对象，以及地图选项
      this.myLatLng = new qq.maps.LatLng(_DEFAULT_CITY.lat, _DEFAULT_CITY.lng)
      let mapOptions = {
        disableDefaultUI: true,
        zoom: 16,
        center: this.myLatLng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      }
      // js API，初始化地图类
      this.map = new qq.maps.Map(this.$refs.map, mapOptions)
      // 监听地图拖动事件相关
      qq.maps.event.addListener(this.map, 'dragstart', this.mapDragstart)
      qq.maps.event.addListener(this.map, 'dragend', this.mapDragend)
    },
    // 精准定位，失败则采取ip定位
    getLocation() {
      this.geolocation.getLocation(this.getLocationSucceed, this.getIpLocation, {timeout: 3000})
    },
    getIpLocation() {
      this.geolocation.getIpLocation(this.getLocationSucceed, this.getLocationFailed, {timeout: 3000})
    },
    // 定位成功回调函数
    getLocationSucceed(position) {
      if (position.city) {
        this.$store.commit('changeCity', position.city)
      }
      // console.log(position)
      this.myLatLng = new qq.maps.LatLng(position.lat, position.lng)
      this.map.panTo(this.myLatLng)
      // this.map.panBy(63, 0)
      this.from = 1
      this.getAddress(this.myLatLng)
        .then((newAddr) => {
          this.$store.commit('changeAddress', newAddr)
        })
        .catch(() => {
          this.showErrorMessage()
        })
    },
    // 获取当前地点附近的poi，也就是从哪开始撸猫的可选地点
    getAddress(latLng) {
      return new Promise((resolve, reject) => {
        this.laglngToLocation.getAddress(latLng)
        // 成功回调
        this.laglngToLocation.setComplete((result) => {
          // console.log(result.detail.nearPois)
          // console.log(this.myLatLng)
          let pois = result.detail.nearPois
          // this.myAddress = {name: pois[0].name, latLng: pois[0].latLng}
          // this.$store.commit('changeAddress', {name: pois[0].name, latLng: pois[0].latLng})
          this.$store.commit('changePois', pois)
          resolve({name: pois[0].name, latLng: pois[0].latLng, from: this.from})
        })
        this.laglngToLocation.setError(() => {
          reject()
        })
      })
      // this.laglngToLocation.getAddress(latLng)
      // this.laglngToLocation.setComplete((result) => {
      //   // console.log(result.detail.nearPois)
      //   // console.log(this.myLatLng)
      //   let pois = result.detail.nearPois
      //   // this.address = {name: pois[0].name, latLng: pois[0].latLng}
      //   this.$store.commit('changeAddress', {name: pois[0].name, latLng: pois[0].latLng})
      //   this.$store.commit('changePois', pois)
      // })
    },
    // 移动地图到指定经纬度
    moveCenter(latLng) {
      this.map.panTo(latLng)
      // 不知为何地图中心点并不在视觉上的中心点，所以手动矫正
      // this.map.panBy(63, 0)
    },
    getLocationFailed() {
      alert('获取位置失败')
    },
    mapDragstart() {
      this.timeInfoShowFlag = false
      this.$store.commit('changeAddress', {name: '正在获取撸猫地点'})
    },
    mapDragend() {
      this.$refs.marker.isLoading = true
      this.timeInfoShowFlag = true
      this.$refs.marker.calculateTime()
      this.from = 1
      let center = this.map.getCenter()
      this.getAddress(center)
        .then((newAddr) => {
          this.$store.commit('changeAddress', newAddr)
          this.$refs.marker.isLoading = false
        })
        .catch(() => {
          this.showErrorMessage()
        })
    },
    showErrorMessage() {
      this.hasError = true
      setTimeout(() => {
        this.hasError = false
      }, 2000)
    }
  },
  watch: {
    // 当经纬度改变时，自动移动地图
    // myLatLng() {
    //   if (this.map) {
    //     this.map.panTo(this.myLatLng)
    //     this.map.panBy(63, 0)
    //   }
    // },
    curCity(newCity) {
      if (newCity === this.myCity.city) {
        this.getLocation()
      } else {
        let newAddress = newCity + '政府'
        // this.address = '正在获取你的位置'
        // this.locationToLatlng = new qq.maps.Geocoder()
        this.locationToLatlng.getLocation(newAddress)
        this.locationToLatlng.setComplete((result) => {
          // let {lat, lng} = result.detail.location
          this.myLatLng = result.detail.location
          this.from = 0
          this.getAddress(this.myLatLng)
            .then((newAddr) => {
              this.$store.commit('changeAddress', newAddr)
            })
            .catch(() => {
              this.showErrorMessage()
            })
        })
      }
    },
    // address发生变化，移动地图到当前address，并重新设置附近poi
    address(newAddr) {
      if (!newAddr.latLng) return
      let latLng = newAddr.latLng
      if (newAddr.from === 0) this.moveCenter(latLng)
      this.getAddress(latLng)
    }
  }
}
</script>

<style lang="scss">

  #map-container {
    width: 100%;
    // height: 100%;
    // bottom: 0;
    // height: 100%;
    text-align: center;
  }
</style>
