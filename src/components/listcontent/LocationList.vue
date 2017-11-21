<template>
  <div class="location-list" ref="listWrapper">
    <ul v-if="listSubType === 1 && !validInput">
      <li 
        class="location-item"
        v-for="(poi, index) in nearPois" 
        :key="poi.id" 
        ref="list" 
        @click="changeCurrentLocation($event, index)"
        @touchstart="highlightPoi($event)"
        @touchend="normalizePoi($event)"
      >
        {{poi.name}}
      </li>
    </ul>
    <ul v-else-if="listSubType === 2 && !validInput">
      <li 
        class="location-item"
        v-for="(poi, index) in suggestedPois" 
        :key="poi.id" 
        ref="list"
        @click="changeDestination($event, index)"
        @touchstart="highlightPoi($event)"
        @touchend="normalizePoi($event)"
      >
        {{poi.name}}
      </li>
    </ul>
    <ul v-else>
      <li 
        class="location-item"
        v-for="(poi, index) in pois" 
        :key="poi.id" 
        ref="list" 
        @click="changeLocation($event, index)"
        @touchstart="highlightPoi($event)"
        @touchend="normalizePoi($event)"
      >
        {{poi.name}}
      </li>
    </ul>
    <div class="info" v-show="infoShowFlag">
      <div class="row">
        <span class="icon">
          <Icon name="circle-o-notch" spin></Icon>
        </span>
        <span class="text">正在查找……</span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import debounce from 'lodash.debounce'
export default {
  mounted() {
    this.scroll = new BScroll(this.$refs.listWrapper, {
      click: true,
      bonce: false
    })
    /* eslint-disable no-undef */
    this.initSearchService()
    this.initSuggestedPois()
  },
  data() {
    return {
      infoShowFlag: false,
      pois: [],
      suggestedPois: [], // 当前address建议的pois,终点
      searchCount: 0
    }
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    },
    input() {
      return this.$store.state.locationInput
    },
    listSubType() {
      return this.$store.state.listSubType
    },
    // 当前address附近的pois,起点
    nearPois() {
      return this.$store.state.nearPois
    },
    // 有效输入，过滤例如'   '这种输入
    validInput() {
      return this.input.replace(/\s/g, '')
    }
  },
  methods: {
    highlightPoi(ev) {
      ev.target.classList.add('active')
    },
    normalizePoi(ev) {
      ev.target.classList.remove('active')
    },
    search: debounce(function(val) {
      this.searchService.search(val)
    }, 300),
    searchCompleted(result) {
      if (this.searchCount === 0) {
        this.suggestedPois = result.detail.pois
      }
      console.log(result)
      this.searchCount++
      this.pois = result.detail.pois
      this.infoShowFlag = false
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    initSearchService() {
      console.log(this.curCity)
      this.searchService = new qq.maps.SearchService({
        complete: this.searchCompleted,
        autoExtend: false,
        location: this.curCity,
        pageCapacity: 20
      })
    },
    initSuggestedPois() {
      this.searchCount = 0
      this.searchService.search(this.curCity)
    },
    changeCurrentLocation(ev, index, pois) {
      if (!pois) {
        pois = this.nearPois
      }
      let poi = pois[index]
      let address = {
        name: poi.name,
        latLng: poi.latLng
      }
      this.$store.commit('changeCustomAddress', address)
      this.$store.commit('hideList')
    },
    changeDestination(ev, index) {
      this.$store.commit('hideList')
    },
    changeLocation(ev, index) {
      if (this.listSubType === 1) {
        this.changeCurrentLocation(ev, index, this.pois)
      } else {
        this.changeDestination(ev, index)
      }
    }
  },
  watch: {
    input(newVal) {
      this.infoShowFlag = true
      // 去除空格部分
      newVal = newVal.replace(/\s/g, '')
      if (newVal === '') {
        setTimeout(() => {
          this.infoShowFlag = false
        }, 300)
      } else {
        this.search(newVal)
      }
    },
    curCity(newCity) {
      this.searchService.setLocation(newCity)
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';
.location-list {
  position: fixed;
  top: 50px;
  left: 2%;
  right: 2%;
  bottom: 0;
  background-color: #fff;
  box-shadow: 1px -1px 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2);
  overflow: hidden;
  .location-item {
    position: relative;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    @include border-1px-bottom;
    &.active {
      background-color: rgba(230, 230, 230, 0.5);
    }
  }
  .info {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 10;
    .row {
      padding: 20px;
      height: 60px;
      line-height: 60px;
      @include border-1px-bottom;
      .icon {
        // animation: rotate_circle 1s infinite;
      }
    }
  }
}
// @keyframes rotate_circle {
//   from {
//     transform: rotate(0deg)
//   }

//   to {
//     transform: rotate(360deg)
//   }
// }
</style>
