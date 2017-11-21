<template>
  <transition name="slide-fade" @after-enter="afterEnter">
    <div class="list-wrapper" v-show="listShowFlag">
      <list-input
        @onListHide="hideList"
        :listType="listType">
        <span class="cur-city" @click="toggleViewToBoth" :slot="citySlot">
          <span class="text">{{curCity}}</span>
          <span class="icon">
            <Icon name="angle-down"></Icon>
          </span>
        </span>
        <div class="input location-input" :slot="inputSlot" @click="toggleViewToLocation">
          <input type="text" placeholder="你从哪开始撸猫" :value="locationInput">
        </div>
      </list-input>
      <component :is="listView" :allCity="listType === 1 ? '' : allCity" @city-changed="chooseCity" ref="listContent"></component>
    </div> 
  </transition>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import ListInput from '@@/listinput/ListInput'
import CityList from '@@/listcontent/CityList'
import LocationList from '@@/listcontent/LocationList'
const SUC_CODE = 0
const CITY_LIST = 0
const LOCATION_LIST = 1
const MIXINPUT_LIST = 2
const DEFALUT_LISTSUBTYPE = 0
const LOCATION_TO_LISTSUBTYPE = 2
export default {
  data() {
    return {
      allCity: [{}]
    }
  },
  created() {
    this.$http.get('/api/citylist')
      .then((res) => {
        if (res.status >= 200 && res.status < 300 || res.status === 304) {
          if (res.data.errno === SUC_CODE) {
            this.allCity = res.data.data
          }
        }
      })
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    },
    listType() {
      return this.$store.state.listType
    },
    listSubType() {
      return this.$store.state.listSubType
    },
    listView() {
      return this.listType === CITY_LIST || this.listType === MIXINPUT_LIST ? CityList : LocationList
    },
    listShowFlag() {
      return this.$store.state.listShowFlag
    },
    pHolder() {
      return this.$store.state.pHolder
    },
    citySlot() {
      return this.listType === CITY_LIST ? '' : this.listType === LOCATION_LIST ? 'city' : ''
    },
    inputSlot() {
      return this.listType === CITY_LIST ? '' : this.listType === MIXINPUT_LIST ? 'input' : ''
    },
    locationInput() {
      return this.$store.state.locationInput
    }
  },
  methods: {
    hideList() {
      this.$store.commit('hideList')
    },
    toggleViewToBoth() {
      this.$store.commit('toggleList', {
        listType: MIXINPUT_LIST,
        pHolder: '城市中文名或拼音',
        listSubType: DEFALUT_LISTSUBTYPE
      })
    },
    toggleViewToLocation() {
      this.$store.commit('toggleList', {
        listType: LOCATION_LIST,
        pHolder: '你从哪开始撸猫',
        listSubType: this.currentListSubType
      })
      // 清空cityinput内容
      this.$store.commit('cityInputChanged', '')
    },
    chooseCity() {
      this.listType === CITY_LIST ? this.hideList() : this.$store.commit('toggleList', {
        pHolder: '从哪开始撸猫',
        listType: LOCATION_LIST,
        listSubType: this.currentListSubType
      })
    },
    afterEnter() {
      this.$refs.listContent.scroll.refresh()
      // 当前列表子类型
      this.currentListSubType = this.listSubType
      // 每次打开类型为“到哪去”的LocationList，都执行一次初始化搜索
      // 在List组件或者LocationList组件中监听curCity的变化无法使LocationList组件执行相关动作
      // 因为改变city时，LocationList组件并没有被引用。
      if (this.listSubType === LOCATION_TO_LISTSUBTYPE) {
        this.$refs.listContent.infoShowFlag = true
        this.$refs.listContent.searchService.setLocation(this.curCity)
        this.$refs.listContent.initSuggestedPois()
      }
    }
  },
  components: {
    Icon,
    ListInput
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';
.list-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 30;
  &.slide-fade-enter, &.slide-fade-leave-to {
    transform: translateY(70vh);
    opacity: 0;
  }
  &.slide-fade-enter-active, &.slide-fade-leave-active {
    transition: all .15s linear
  }
  .cur-city {
    padding-top: 3px;
    padding-right: 5px;
    font-size: 12px;
    @include border-1px-right;
    .icon {
      position: relative;
      display: inline-block;
      // height: 100%;
      top: 3px;
      padding-right: 4px;
    }
    .text {
      display: inline-block;
      // height: 100%;
      padding: 0 5px 0 15px;
      font-size: 12px;
      line-height: 36px;
    }
  }
}
</style>
