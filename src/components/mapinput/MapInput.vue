<template>
  <div class="input-wrapper">
    <span class="btn" @click="clickGeoBtn">
      <Icon name="spinner" spin v-if="isGeo"></Icon>
      <Icon name="location-arrow" v-else></Icon>
    </span>
    <div class="time-type" ref="time-type">
      <span class="text" @click="changeTimeType(0)">现在</span>
      <span class="text" @click="changeTimeType(1)">预约</span>
      <span class="text active" ref="active-circle"></span>
      <!-- <div class="appointment" v-show="!nowFlag"><span class="icon"><Icon name="clock-o"></Icon></span>预约时间</div> -->
    </div>
    <div class="input-location">
      <transition name="rotate-in">
        <div class="appointment" ref="appointment" v-show="!nowFlag"><span class="icon"><Icon name="clock-o"></Icon></span>预约时间</div>
      </transition>
      <div class="address address-from" 
        @touchstart="highlight($event)" 
        @touchend="normalize($event)"
        @click="showLocationList(locationListTypeFrom)">
        <span class="dot"></span>
        <span class="text">{{myAddress.name}}</span>
      </div>
      <div class="address address-to" 
        @touchstart="highlight($event)" 
        @touchend="normalize($event)"
        @click="showLocationList(locationListTypeTo)">
        <span class="dot"></span>
        <span class="text">你要在哪撸猫<span class="mic"><span class="icon"><Icon name="microphone"></Icon></span></span></span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
const TIME_TYPE_NOW = 0
const LOCATION_LIST = 1
/* eslint-disable no-unused-vars */
const LOCATION_FROM_LISTSUBTYPE = 1
const LOCATION_TO_LISTSUBTYPE = 2
import { mapMutations } from 'vuex'
export default {
  props: {
    isGeo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowFlag: true,
      addressFromHighlight: false,
      addresstoHighlight: false,
      locationListTypeFrom: {
        listSubType: LOCATION_FROM_LISTSUBTYPE,
        placeholder: '从哪开始撸猫'
      },
      locationListTypeTo: {
        listSubType: LOCATION_TO_LISTSUBTYPE,
        placeholder: '去哪撸猫'
      }
    }
  },
  computed: {
    myAddress() {
      return this.$store.state.address
    }
  },
  methods: {
    clickGeoBtn() {
      this.$emit('geoBtnClick')
    },
    changeTimeType(timieType) {
      if (timieType === TIME_TYPE_NOW) {
        this.$refs['active-circle'].style.transform = ''
        this.nowFlag = true
      } else {
        this.$refs['active-circle'].style.transform = 'translateX(100%)'
        this.nowFlag = false
      }
    },
    highlight(ev) {
      ev.currentTarget.classList.add('active')
    },
    normalize(ev) {
      ev.currentTarget.classList.remove('active')
    },
    // showLocationList() {
    //   this.$store.commit('showList')
    // },
    showLocationList(type) {
      let {listSubType, placeholder} = type
      this.$store.commit('showList')
      this.$store.commit('toggleList', {
        listType: LOCATION_LIST,
        placeholder,
        listSubType
      })
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin.scss';
.input-wrapper {
  position: fixed;
  left: 2%;
  right: 2%;
  bottom: 2%;
  .btn {
    position: absolute;
    top: -60px;
    width: 18px;
    height: 18px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #dedede;
    z-index: 10;
  }
  .time-type {
    position: absolute;
    top: -32px;
    display: flex;
    padding: 2px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px 15px 15px 0;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .1), -1px -1px 1px rgba(0, 0, 0, .1);
    background-color: #ececec;
    transition: all .3s;
    z-index: -2;
    .text {
      display: inline-block;
      width: 50px;
      text-align: center;
      font-size: 12px;
      background: transparent;
      &.active {
        position: absolute;
        left: 2px;
        height: 30px;
        border-radius: 14px;
        background-color: #fff;
        transition: all .3s linear;
        z-index: -1;
      }
    }
  }
  .input-location {
    position: relative;
    width: 100%;
    margin-top: 5px;
    border-radius: 1px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .1), -1px -1px 1px rgba(0, 0, 0, .1);
    background-color: #fff;
    transform-style: preserve-3d;
    .appointment {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 14px;
      transform-origin: center top;
      @include border-1px-bottom;
      &.rotate-in-enter-active, &.rotate-in-leave-active {
        transition: all .3s
      }
      &.rotate-in-enter, &.rotate-in-leave-to {
        transform: rotateX(90deg);
        height: 0px;
      }
      .icon {
        margin-right: 3px;
      }
    }
    .address {
      display: flex;
      align-items: center;
      flex: 1 1 0;
      line-height: 50px;
      font-size: 14px;
      &.active {
        background-color: rgba(230, 230, 230, .5)
      };
      .dot {
        width: 5px;
        height: 5px;
        margin: 0 15px;
        border-radius: 2.5px;
      }
      .text {
        flex: 1 1 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .address-from {
      .dot {
        background-color: green
      }
      .text {
        @include border-1px-bottom;
      }
    }
    .address-to {
      .dot {
        background-color: #ff8125
      }
      .text {
        position: relative;
        color: #cecece;
        .mic {
          position: absolute!important;
          bottom: 0;
          right: 0;
          padding: 0 25px;
          @include border-1px-left;
          .icon {
            position: relative;
            top: 3px;
          }
        }
      }
    }
  }
}
</style>
