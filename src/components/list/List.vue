<template>
  <transition name="slide-fade" @after-enter="afterEnter">
    <div class="list-wrapper" v-show="listShowFlag">
      <list-input
        @onListHide="hideList"
        :listType="listType">
        <span class="cur-city" @click="toggleViewToBoth" :slot="citySlot">
          <span class="text">杭州</span>
          <span class="icon">
            <Icon name="angle-down"></Icon>
          </span>
        </span>
        <div class="input location-input" :slot="inputSlot" @click="toggleViewToLocation">
          <input type="text" placeholder="你从哪开始撸猫" :value="locationInput">
        </div>
      </list-input>
      <component :is="listView" @city-changed="chooseCity" ref="listContent"></component>
    </div> 
  </transition>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import ListInput from '@@/listinput/ListInput'
import CityList from '@@/listcontent/CityList'
import LocationList from '@@/listcontent/LocationList'
const CITY_LIST = 0
const LOCATION_LIST = 1
const MIXINPUT_LIST = 2
export default {
  data() {
    return {
      // listShowFlag: fals
      // citySlot: '',
      // listView: CityList
    }
  },
  computed: {
    listType() {
      return this.$store.state.listType
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
        pHolder: '城市中文名或拼音'
      })
    },
    toggleViewToLocation() {
      this.$store.commit('toggleList', {
        listType: LOCATION_LIST,
        pHolder: '你从哪开始撸猫'
      })
      // 清空cityinput内容
      this.$store.commit('cityInputChanged', '')
    },
    chooseCity() {
      console.log(`choose`)
      this.listType === CITY_LIST ? this.hideList() : this.$store.commit('toggleList', {
        pHolder: '从哪开始撸猫',
        listType: LOCATION_LIST
      })
    },
    afterEnter() {
      console.log('afterEnter')
      console.log(this.$refs)
      this.$refs.listContent.scroll.refresh()
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
