<template>
  <div class="input-wrapper">
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
      <div class="address address-from">
        <span class="dot"></span>
        <span class="text">{{myAddress}}</span>
      </div>
      <div class="address address-to">
        <span class="dot"></span>
        <span class="text">你要在哪撸猫<span class="mic"><span class="icon"><Icon name="microphone"></Icon></span></span></span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
const TIME_TYPE_NOW = 0
export default {
  props: {
    address: {
      type: String,
      default: '正在获取你的地点'
    }
  },
  data() {
    return {
      nowFlag: true
      // myAddress: this.address
    }
  },
  computed: {
    myAddress() {
      return this.address
    }
  },
  methods: {
    changeTimeType(type) {
      if (type === TIME_TYPE_NOW) {
        this.$refs['active-circle'].style.transform = ''
        this.nowFlag = true
        // this.$refs.appointment.style.transform = 'rotateX(90deg)'
        // this.$refs['time-type'].style.transform = 'translateY(0px)'
      } else {
        this.$refs['active-circle'].style.transform = 'translateX(100%)'
        this.nowFlag = false
        // this.$refs.appointment.style.transform = 'rotateX(0)'
        // this.$refs['time-type'].style.transform = 'translateY(-50px)'
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
.input-wrapper {
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: 2%;
  z-index: 50;
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
    .text {
      display: inline-block;
      width: 50px;
      text-align: center;
      font-size: 12px;
      background: transparent;
      z-index: 1;
      &.active {
        position: absolute;
        height: 30px;
        border-radius: 14px;
        background-color: #fff;
        transition: all .3s linear;
        z-index: 0;
      }
    }
  }
  .input-location {
    position: relative;
    width: 100%;
    // display: flex;
    // flex-flow: column;
    // height: 100px;
    margin-top: 5px;
    border-radius: 1px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .1), -1px -1px 1px rgba(0, 0, 0, .1);
    background-color: #fff;
    transform-style: preserve-3d;
    .appointment {
      // position: absolute;
      // top: -50%;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      // transition: all .3s;
      transform-origin: center top;
      // z-index: -1;
      // transform: rotateX(90deg);
      @include border-1px-bottom;
      &.rotate-in-enter-active, &.rotate-in-leave-active {
        transition: all .3s
      }
      &.rotate-in-enter, &.rotate-in-leave-to {
        transform: rotateX(90deg);
        height: 0px;
      }
      // &.rotate-in-leave-to {
      //   transform: rotateX(90deg);
      // }
    }
    .address {
      display: flex;
      align-items: center;
      flex: 1 1 0;
      line-height: 50px;
      font-size: 14px;
      .dot {
        width: 5px;
        height: 5px;
        margin: 0 15px;
        border-radius: 2.5px;
      }
      .text {
        flex: 1 1 0;
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
