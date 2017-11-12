<template>
  <div class="location-list" ref="listWrapper">
    <ul>
      <li 
        class="location-item"
        v-for="poi in pois" 
        :key="poi.id" 
        ref="list" 
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
  // props: {
  //   Poi: {
  //     type: Object
  //   }
  // },
  mounted() {
    this.scroll = new BScroll(this.$refs.listWrapper, {
      click: true,
      bonce: false
    })
    /* eslint-disable no-undef */
    this.initSearchService()
  },
  data() {
    return {
      infoShowFlag: false,
      pois: []
    }
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    },
    input() {
      return this.$store.state.locationInput
    }
  },
  methods: {
    highlightPoi(ev) {
      ev.target.classList.add('active')
    },
    normalizePoi(ev) {
      ev.target.classList.remove('active')
    },
    test(obj) {
      this.pois = obj.detail.pois
      this.infoShowFlag = false
      // console.log(this.pois)
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    search: debounce(function(val) {
      this.searchService.search(val)
    }, 300),
    initSearchService() {
      this.searchService = new qq.maps.SearchService({
        complete: this.test,
        autoExtend: false,
        location: this.curCity,
        pageCapacity: 20
      })
    }
  },
  watch: {
    input(newVal) {
      this.infoShowFlag = true
      this.search(newVal)
    },
    curCity(newCity) {
      this.searchService.setLocation(newCity)
      console.log(this.searchService, 2)
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
    height: 40px;
    line-height: 40px;
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
