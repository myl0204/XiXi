<template>
  <div id="map-container" ref="map">
    <map-marker ref="marker" :isTimeInfoVisible="isTimeInfoVisible"></map-marker>
    <message 
      :message="message" 
      :iconName="'exclamation-circle'" 
      v-show="isMessageVisible"
      :delay="messageDelay">
    </message>
  </div>
</template>

<script>
import { fillTheScreen } from '@/common/js/util.js'
import MapMarker from '@@/mapMarker/Marker'
import Message from '@@/message/Message'
import debounce from 'lodash.debounce'
export default {
  mounted() {
    this.$nextTick(() => {
      this._initMap()
    })
  },
  data() {
    return {
      isTimeInfoVisible: true,
      isMessageVisible: false,
      message: '',
      messageDelay: 2000
    }
  },
  computed: {
    address() {
      return this.$store.state.address
    },
    locationInput() {
      return this.$store.state.locationInput
    }
  },
  methods: {
    _initMap() {
      // 使地图容器自适应窗口余下高度
      const target = this.$refs.map
      const totalHeight = 86 // 这里86是header的高度
      fillTheScreen({target, totalHeight})
      // 地图选项
      const mapOptions = {
        mapStyle: 'amap://styles/9243d6059d95b04e053596c4ab715c52'
      }
      /* eslint-disable no-undef */
      // 创建地图
      this.map = new AMap.Map(target, mapOptions)
      // 获取按钮偏移量
      const x = window.innerWidth
      const y = window.innerHeight
      const offSetX = x / 50
      const offsetY = y / 50 + 105 + 34 + 5
      // 定位插件
      this.map.plugin('AMap.Geolocation', () => {
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 3000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        // 显示定位按钮，默认：true
          buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(offSetX, offsetY), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,    // 定位成功后将定位到的位置作为地图中心点，默认：true
          extensions: 'all'       // 定位成功后返回周边POI信息
          // noIpLocate: 1,
          // GeoLocationFirst: true
          // zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        this.map.addControl(this.geolocation)
        // 通过ip信息获取当前城市
        this.geolocation.getCityInfo((status, result) => {
          if (status === 'complete') {
            const city = result.city
            this.setIpCity(city)
            this.changeCity(city)
            this._initMapSearchService(city)
          }
        })
        // 注册定位事件
        AMap.event.addListener(this.geolocation, 'complete', this.onGeolocationComplete)
        AMap.event.addListener(this.geolocation, 'error', this.onGeolocationError)
        this.geolocation.getCurrentPosition()
        // 注册地图拖拽事件
        AMap.event.addListener(this.map, 'dragstart', this.onMapDragStart)
        AMap.event.addListener(this.map, 'dragend', this.onMapDragEnd)
      })
    },
    // 初始化地图搜索相关服务
    _initMapSearchService(city) {
      this.map.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Geocoder'], () => {
        this.placeSearch = new AMap.PlaceSearch({city})
        this.autoComplete = new AMap.Autocomplete({city})
        this.geocoder = new AMap.Geocoder({
          city,
          extensions: 'all'
        })
        this.placeSearch.setType('生活服务')
        this.placeSearch.search('猫', (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const pois = result.poiList.pois
            this.changeSuggestedPois(pois)
          }
        })
      })
    },
    moveCenter(lngLat) {
      this.map.panTo(lngLat)
    },
    showMessage(message, delay = 2000) {
      this.message = message
      this.messageDelay = delay
      this.isMessageVisible = true
      setTimeout(() => {
        this.isMessageVisible = false
      }, delay)
    },
    onGeolocationComplete(GeolocationResult) {
      this.lngLat = GeolocationResult.position
      const pois = GeolocationResult.pois.splice(0, 10)
      const address = {
        name: pois[0].name,
        lngLat: this.lngLat
      }
      this.map.setZoom(16)
      // 设置当前地址
      this.changeAddress(address)
      // 设置附近的pois，即起点
      this.changeNearPois(pois)
      if (GeolocationResult.location_type === 'ip') {
        this.showMessage('当前为ip定位，结果可能不准确')
      }
    },
    onGeolocationError(GeolocationError) {
      this.showMessage('定位失败，请刷新重试')
    },
    test: debounce(function(val) {
      this.autoComplete.search(val, this.cb_autoComplete)
    }, 800),
    cb_autoComplete(status, result) {
      // console.log(status)
      if (status === 'complete') {
        // 过滤掉没有location信息的无效地点
        const pois = result.tips.filter((item) => {
          return item.location
        })
        this.changeSearchPois(pois)
      } else {
        this.showSearchingErrorInfo()
      }
      this.hideSearchingInfo()
    },
    // 获取用户所选点的附近撸猫点
    getNearPois(lngLat, ifGetName = false) {
      // const center = this.map.getCenter()
      // 通过经纬度信息获取周边poi
      this.geocoder.getAddress(lngLat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const pois = result.regeocode.pois.splice(0, 10)
          // 按距离排序
          pois.sort((a, b) => {
            return a.distance - b.distance
          })
          if (ifGetName) {
            this.changeAddress({
              name: pois[0].name,
              lngLat
            })
            this.$refs.marker.isLoading = false
          } else {
            this.changeNearPois(pois)
          }
        }
      })
    },
    onMapDragStart() {
      this.isTimeInfoVisible = false
      this.$store.commit('changeAddress', {name: '正在获取撸猫地点'})
    },
    onMapDragEnd() {
      this.$refs.marker.isLoading = true
      this.isTimeInfoVisible = true
      this.$refs.marker.calculateTime()
      let center = this.map.getCenter()
      this.getNearPois(center, true)
    },
    // 切换猫种时，刷新“等候时间”，提升交互
    refreshTimeInfo() {
      this.isTimeInfoVisible = false
      setTimeout(() => {
        this.isTimeInfoVisible = true
      }, 200)
      this.$refs.marker.calculateTime()
    },
    setIpCity(city) {
      this.$store.commit('setIpCity', city)
    },
    changeCity(city) {
      this.$store.commit('changeCity', city)
    },
    changeNearPois(pois) {
      this.$store.commit('changeNearPois', pois)
    },
    changeSuggestedPois(pois) {
      this.$store.commit('changeSuggestedPois', pois)
    },
    changeSearchPois(pois) {
      this.$store.commit('changeSearchPois', pois)
    },
    changeAddress(address) {
      this.$store.commit('changeAddress', address)
    },
    showSearchingInfo() {
      this.$store.commit('showSearchingInfo')
    },
    hideSearchingInfo() {
      this.$store.commit('hideSearchingInfo')
    },
    showSearchingErrorInfo() {
      this.$store.commit('showSearchingErrorInfo')
    },
    hideSearchingErrorInfo() {
      this.$store.commit('hideSearchingErrorInfo')
    }
  },
  watch: {
    address(newAddr) {
      if (!newAddr.lngLat) return
      const lngLat = newAddr.lngLat
      if (newAddr.ifMove) this.moveCenter(lngLat)
      this.getNearPois(lngLat)
    },
    locationInput(newVal) {
      this.hideSearchingErrorInfo()
      this.showSearchingInfo()
      if (newVal === '') {
        this.hideSearchingInfo()
      } else {
        this.test(newVal)
      }
    }
  },
  components: {
    MapMarker,
    Message
  }
}
</script>

<style lang="scss">
#map-container {
  .amap-controls {
    .amap-geolocation-con {
      z-index: 1!important;
    }
  }
  .amap-logo {
    z-index: 1;
  }
  .amap-copyright {
    z-index: 1
  }
}
</style>
