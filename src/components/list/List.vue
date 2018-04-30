<template>
  <transition name="slide-fade">
    <div class="list-wrapper" v-show="isListVisible">
      <list-input
        @onListHide="hideList"
        :listType="listType">
        <span class="cur-city" @click="toggleViewToBoth" :slot="citySlot">
          <span class="text">{{curCity}}</span>
          <span class="icon">
            <Icon name="angle-down"/>
          </span>
        </span>
        <div class="input location-input" :slot="inputSlot" @click="toggleViewToLocation">
          <input type="text" placeholder="你从哪开始撸猫" :value="locationInput">
        </div>
      </list-input>
      <component
        :is="listView"
        :allCity="allCity"
        @city-changed="onCityChange"
        ref="listContent"/>
    </div> 
  </transition>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import ListInput from '@@/listinput/ListInput'
import CityList from '@@/listcontent/CityList'
import LocationList from '@@/listcontent/LocationList'
import { mapState, mapMutations } from 'vuex'
const CITY_LIST = 0
const LOCATION_LIST = 1
const MIXINPUT_LIST = 2
const DEFALUT_LISTSUBTYPE = 0
export default {
  data() {
    return {
      allCity: [{}]
    }
  },
  created() {
    this.$http.get('/api/city.json')
      .then((res) => {
        this.allCity = res.data
      })
  },
  computed: {
    ...mapState([
      'curCity',
      'listType',
      'listSubtype',
      'isListVisible',
      'placeholder',
      'locationInput'
    ]),
    listView() {
      return this.listType === CITY_LIST || this.listType === MIXINPUT_LIST ? 'CityList' : 'LocationList'
    },
    citySlot() {
      return this.listType === CITY_LIST ? '' : this.listType === LOCATION_LIST ? 'city' : ''
    },
    inputSlot() {
      return this.listType === CITY_LIST ? '' : this.listType === MIXINPUT_LIST ? 'input' : ''
    }
  },
  methods: {
    ...mapMutations([
      'hideList',
      'updateCityInput',
      'toggleList'
    ]),
    clearInput() {
      this.updateCityInput('')
    },
    toggleViewToBoth() {
      this.toggleList({
        listType: MIXINPUT_LIST,
        placeholder: '城市中文名或拼音',
        listSubType: DEFALUT_LISTSUBTYPE
      })
    },
    toggleViewToLocation() {
      this.toggleList({
        listType: LOCATION_LIST,
        placeholder: '你从哪开始撸猫',
        listSubType: this.currentListSubType
      })
      // 清空cityinput内容
      this.clearInput()
    },
    onCityChange() {
      this.listType === CITY_LIST ? this.hideList() : this.$store.commit('toggleList', {
        placeholder: '从哪开始撸猫',
        listType: LOCATION_LIST,
        listSubType: this.currentListSubType
      })
    }
  },
  components: {
    Icon,
    ListInput,
    CityList,
    LocationList
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
    line-height: 40px;
    font-size: 12px;
    @include border-1px-right;
    .icon {
      position: relative;
      top: 3px;
      display: inline-block;
      padding-right: 4px;
    }
    .text {
      display: inline-block;
      padding: 0 5px 0 15px;
      font-size: 12px;
      line-height: 40px;
    }
  }
}
</style>
