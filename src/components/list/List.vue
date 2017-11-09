<template>
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
    <component :is="listView"></component>
  </div> 
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import ListInput from '@@/listinput/ListInput'
import CityList from '@@/listcontent/CityList'
const CITY_INPUT = 0
const LOCATION_INPUT = 1
const BOTH_INPUT = 2
export default {
  data() {
    return {
      // listShowFlag: fals
      // citySlot: '',
      listView: CityList
    }
  },
  computed: {
    listType() {
      return this.$store.state.listType
    },
    listShowFlag() {
      return this.$store.state.listShowFlag
    },
    pHolder() {
      return this.$store.state.pHolder
    },
    citySlot() {
      return this.listType === CITY_INPUT ? '' : this.listType === LOCATION_INPUT ? 'city' : ''
    },
    inputSlot() {
      return this.listType === CITY_INPUT ? '' : this.listType === BOTH_INPUT ? 'input' : ''
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
        listType: BOTH_INPUT,
        pHolder: '城市中文名或拼音'
      })
    },
    toggleViewToLocation() {
      this.$store.commit('toggleList', {
        listType: LOCATION_INPUT,
        pHolder: '你从哪开始撸猫'
      })
      // 清空cityinput内容
      this.$store.commit('cityInputChanged', '')
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
