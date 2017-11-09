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
        <Icon name="times-circle" class="icon"></Icon>
      </span>
      <span class="text" @click="hideList">取消</span>
    </span>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
const CITY_INPUT = 0
const LOCATION_INPUT = 1
const BOTH_INPUT = 2
export default {
  props: {
    listType: {
      type: Number,
      defalut: 0
    }
  },
  data() {
    return {
      // input: '',
      iconShowFlag: true
    }
  },
  computed: {
    pHolder() {
      return this.$store.state.pHolder
    },
    input() {
      return this.listType === CITY_INPUT || this.listType === BOTH_INPUT ? this.$store.state.cityInput : this.$store.state.locationInput
    }
  },
  methods: {
    clearInput() {
      this.input = ''
    },
    hideList() {
      this.$emit('onListHide')
    },
    inputChanged(ev) {
      if (this.listType === CITY_INPUT || this.listType === BOTH_INPUT) {
        this.$store.commit('cityInputChanged', ev.target.value)
      } else if (this.listType === LOCATION_INPUT) {
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 36px;
  background-color: #fff;
  box-shadow: 0 2px 1px rgba(0, 0, 0, .2);
  // box-sizing: border-box;
  z-index: 30;
  .input {
    // 这里用padding来撑开高度的话会遮挡父级的box-shadow。
    // width: 100%;
    flex: 1 1 0;
    width: 100px;
    height: 36px;
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
    // position: absolute;
    // right: 0px;
    // top: 0;
    // flex: 0 1 1;
    height: 36px;
    line-height: 36px;
    font-size: 0;
    color: gray;
    .icon {
      position: relative;
      display: inline-block;
      height: 100%;
      margin-right: 4px;
    }
    .text {
      vertical-align: top;
      display: inline-block;
      height: 100%;
      padding-left: 7px;
      padding-right: 15px;
      font-size: 12px;
      line-height: 36px;
      @include border-1px-left
    }
  }
}
</style>
