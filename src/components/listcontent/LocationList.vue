<template>
  <div class="location-list" ref="listWrapper">
    <ul v-if="listSubType === 1 && !validInput">
      <li 
        class="location-item"
        v-for="(poi, index) in nearPois" 
        :key="poi.id" 
        ref="list" 
        @click="changeCurrentLocation(index)"
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
        @click="changeDestination(index)"
        @touchstart="highlightPoi($event)"
        @touchend="normalizePoi($event)"
      >
        {{poi.name}}
      </li>
    </ul>
    <ul v-else>
      <!-- 用户有输入时 -->
      <li 
        class="location-item"
        v-for="(poi, index) in searchPois" 
        :key="poi.id" 
        ref="list" 
        @click="changeLocation(index)"
        @touchstart="highlightPoi($event)"
        @touchend="normalizePoi($event)"
      >
        {{poi.name}}
      </li>
    </ul>
    <div class="info-error" v-show="isSearchingErrorInfoVisible"><p class="text">暂无结果，换个词试试吧！</p></div>
    <div class="info" v-show="isSearchingInfoVisible">
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
// import debounce from 'lodash.debounce'
export default {
  mounted() {
    this.scroll = new BScroll(this.$refs.listWrapper, {
      click: true,
      bonce: false
    })
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
    searchPois() {
      return this.$store.state.searchPois
    },
    suggestedPois() {
      return this.$store.state.suggestedPois
    },
    // 有效输入，过滤例如'   '这种输入
    validInput() {
      return this.input.replace(/\s/g, '')
    },
    isSearchingInfoVisible() {
      return this.$store.state.isSearchingInfoVisible
    },
    isSearchingErrorInfoVisible() {
      return this.$store.state.isSearchingErrorInfoVisible
    }
  },
  methods: {
    highlightPoi(ev) {
      ev.target.classList.add('active')
    },
    normalizePoi(ev) {
      ev.target.classList.remove('active')
    },
    changeCurrentLocation(index) {
      const lngLat = this.nearPois[index].location
      const address = {
        name: this.nearPois[index].name,
        lngLat,
        ifMove: true
      }
      this.$store.commit('changeAddress', address)
      this.$store.commit('locationInputChanged', '')
      this.$store.commit('hideList')
    },
    changeDestination(index) {
      this.$store.commit('hideList')
    },
    changeLocation(index) {
      if (this.listSubType === 1) {
        this.changeCurrentLocation(index, this.searchPois)
      } else {
        this.changeDestination(index)
      }
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
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @include border-1px-bottom;
    &.active {
      background-color: rgba(230, 230, 230, 0.5);
    }
  }
  .info-error {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: #fff;
    z-index: 21;
    .text {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%)
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
