<template>
  <div class="list-input">
    <slot name="city"></slot>
    <!-- 逻辑都在以下input里处理 -->
    <div class="input city-input">
      <input 
        type="text" 
        autofocus
        :placeholder="pHolder" 
        :value="input" 
        @input="inputChanged($event)"
        ref="input">
    </div>
    <slot name="input"></slot>
    <span class="cancel">
      <span class="icon" @click="clearInput" v-show="input.length && listType !== 2">
        <Icon name="times-circle"></Icon>
      </span>
      <span class="text" @click="hideList">取消</span>
    </span>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
const CITY_LIST = 0
const LOCATION_LIST = 1
const MIXINPUT_LIST = 2
export default {
  props: {
    listType: {
      type: Number,
      defalut: 0
    }
  },
  data() {
    return {
      iconShowFlag: true
    }
  },
  computed: {
    pHolder() {
      return this.$store.state.pHolder
    },
    input() {
      return this.listType === CITY_LIST || this.listType === MIXINPUT_LIST ? this.$store.state.cityInput : this.$store.state.locationInput
    }
  },
  methods: {
    clearInput() {
      this.listType === CITY_LIST || this.listType === MIXINPUT_LIST ? this.$store.commit('cityInputChanged', '') : this.$store.commit('locationInputChanged', '')
    },
    hideList() {
      this.clearInput()
      this.$emit('onListHide')
    },
    inputChanged(ev) {
      if (this.listType === CITY_LIST || this.listType === MIXINPUT_LIST) {
        this.$store.commit('cityInputChanged', ev.target.value)
      } else if (this.listType === LOCATION_LIST) {
        this.$store.commit('locationInputChanged', ev.target.value)
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
.list-input {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 40px;
  background-color: #fff;
  box-shadow: 0 2px 1px rgba(0, 0, 0, .2);
  // box-sizing: border-box;
  z-index: 30;
  .input {
    // 这里用padding来撑开高度的话会遮挡父级的box-shadow。
    // width: 100%;
    flex: 1 1 0;
    width: 100px;
    height: 100%;
    padding: 0px 15px;
    font-size: 12px;
    // line-height: 14px;
    &.location-input {
      @include border-1px-left
    }
    input {
      width: 100%;
      height: 100%;
      caret-color: #ff9800;
      &:focus {
        border: none;
        outline: none
      }
    }
    
  }
  .cancel {
    height: 100%;
    line-height: 40px;
    font-size: 0;
    color: gray;
    .icon {
      position: relative;
      display: inline-block;
      height: 100%;
      margin-right: 8px;
      .fa-icon {
        height: 100%
      }
    }
    .text {
      vertical-align: top;
      display: inline-block;
      height: 100%;
      padding-left: 7px;
      padding-right: 15px;
      font-size: 12px;
      line-height: 40px;
      @include border-1px-left
    }
  }
}
</style>
