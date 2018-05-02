<template>
  <div id="map-container" ref="map">
    <map-marker
      ref="marker"
      :isTimeInfoVisible="isTimeInfoVisible"/>
    <message 
      :message="message" 
      :iconName="'exclamation-circle'" 
      v-show="isMessageVisible"
      :delay="messageDelay"/>
  </div>
</template>

<script>
import { fillTheScreen } from '@/common/js/util.js'
import MapMarker from '@@/mapMarker/Marker'
import Message from '@@/message/Message'
import debounce from 'lodash.debounce'
import { mapState, mapMutations } from 'vuex'
const HEADER_HEIGHT = 86
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
    ...mapState([
      'address',
      'ipCity',
      'curCity',
      'locationInput'
    ])
  },
  methods: {
    _initMap() {
      // 使地图容器自适应窗口余下高度
      const target = this.$refs.map
       // 这里86是header的高度
      fillTheScreen({target, height: HEADER_HEIGHT})
      // 地图选项
      const mapOptions = {
        mapStyle: 'amap://styles/9243d6059d95b04e053596c4ab715c52'
      }
      /* eslint-disable no-undef */
      // 创建地图
      this.map = new AMap.Map(target, mapOptions)
      // 定位插件
      this.map.plugin('AMap.Geolocation', () => {
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 3000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false,        // 显示定位按钮，默认：true
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,    // 定位成功后将定位到的位置作为地图中心点，默认：true
          extensions: 'all',       // 定位成功后返回周边POI信息
          zoomToAccuracy: true
        })
        this.map.addControl(this.geolocation)
        // 通过ip信息获取当前城市
        this.geolocation.getCityInfo((status, result) => {
          if (status === 'complete') {
            const city = result.city
            this.setIpCity(city)
            this.updateCity(city)
            this._initMapSearchService(city)
          }
        })
        this._initMapGeolocation()
        this._initMapDragEvent()
        this.getCurrentPosition()
        // this._initSuggestedPois()
      })
    },
    // 注册化地图定位事件
    _initMapGeolocation() {
      AMap.event.addListener(this.geolocation, 'complete', this.onGeolocationComplete)
      AMap.event.addListener(this.geolocation, 'error', this.onGeolocationError)
    },
    _initMapDragEvent() {
      AMap.event.addListener(this.map, 'dragstart', this.onMapDragStart)
      AMap.event.addListener(this.map, 'dragend', this.onMapDragEnd)
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
        this._initSuggestedPois()
      })
    },
    _initSuggestedPois() {
      this.placeSearch.setType('生活服务')
      this.placeSearch.search('猫', (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const pois = result.poiList.pois
          this.changeSuggestedPois(pois)
        }
      })
    },
    getCurrentPosition() {
      this.geolocation.getCurrentPosition()
    },
    moveCenter(lngLat) {
      this.map.panTo(lngLat)
    },
    showMessage(message, delay = 2000) {
      this.message = message
      this.messageDelay = delay
      this.isMessageVisible = true
      setTimeout(() => {
        this.hideMessage()
      }, this.messageDelay)
    },
    hideMessage() {
      this.isMessageVisible = false
    },
    onGeolocationComplete(GeolocationResult) {
      if (GeolocationResult.info === 'SUCCESS') {
        this.lngLat = GeolocationResult.position
        const pois = GeolocationResult.pois
          ? GeolocationResult.pois.splice(0, 10)
          : [{name: '定位出错，请尝试手机'}]
        const address = {
          name: pois[0].name,
          lngLat: this.lngLat
        }
        // this.map.setZoom(16)
        // 设置当前地址
        this.changeAddress(address)
        // 设置附近的pois，即起点
        this.changeNearPois(pois)
        if (GeolocationResult.location_type === 'ip') {
          this.showMessage('当前为ip定位，结果可能不准确')
        }
      }
      this.$emit('geoComplete')
    },
    onGeolocationError(GeolocationError) {
      this.$emit('geoComplete')
      this.showMessage('定位失败，请刷新重试')
    },
    keywordSearch: debounce(function(val) {
      this.autoComplete.search(val, this.cb_autoComplete)
    }, 800),
    cb_autoComplete(status, result) {
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
      this.changeAddress({name: '正在获取撸猫地点'})
    },
    onMapDragEnd() {
      this.$refs.marker.isLoading = true
      this.isTimeInfoVisible = true
      this.$refs.marker.calculateTime()
      const center = this.map.getCenter()
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
    setPlaceSearchService(newCity) {
      this.placeSearch.setCity(newCity)
      this.placeSearch.setType('政府机构及社会团体')
      this.placeSearch.search(`${newCity}政府`, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const poi = result.poiList.pois[0]
          this.changeAddress({
            name: poi.name,
            lngLat: new AMap.LngLat(poi.location.lng, poi.location.lat),
            ifMove: true
          })
        }
      })
    },
    onCurCityChange(newCity) {
      this.setPlaceSearchService(newCity)
    },
    ...mapMutations([
      'setIpCity',
      'updateCity',
      'changeNearPois',
      'changeSuggestedPois',
      'changeSearchPois',
      'changeAddress',
      'showSearchingInfo',
      'hideSearchingInfo',
      'showSearchingErrorInfo',
      'hideSearchingErrorInfo'
    ])
  },
  watch: {
    address(newAddr) {
      if (!newAddr.lngLat) return
      const lngLat = newAddr.lngLat
      if (newAddr.ifMove) this.moveCenter(lngLat)
      this.getNearPois(lngLat)
    },
    curCity(newCity) {
      if (newCity !== this.ipCity) this.setPlaceSearchService(newCity)
    },
    locationInput(newVal) {
      this.hideSearchingErrorInfo()
      this.showSearchingInfo()
      newVal === ''
        ? this.hideSearchingInfo()
        : this.keywordSearch(newVal)
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
