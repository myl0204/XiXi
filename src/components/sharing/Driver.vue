<template>
  <transition :name="transitionName + '-left'">
    <div class="owner" ref="owner"
      @touchstart="touchStart"
      @touchmove="move"
      @touchend="touchEnd"
    >
      <div class="pic">
        <img src="./cat2-1.jpg" alt="" width="100%">
        <div class="blur"></div>
        <div class="text-wrapper">
          <h2 class="title">轻松月赚1500</h2>
          <span>“出行之前看一眼</span>
          <div>&nbsp;&nbsp;&nbsp;顺路接单很简单”</div>
        </div>
      </div>
      <div class="button">成为顺风猫猫主</div>
    </div>
  </transition>
</template>

<script>
import { translate } from '@/common/js/util.js'
export default {
  props: {
    transitionName: {
      type: String,
      default: 'slide'
    }
  },
  mounted() {
    this.maxMoveDistance = window.innerWidth
    this.leftEl = this.$refs.owner.parentElement.querySelector('.out_of_screen-left')
  },
  data() {
    return {
      touch: {},
      touchStartTime: 0,
      touchEndTime: 0,
      currentDistance: 0,
      totalDiff: 0
    }
  },
  methods: {
    touchStart(ev) {
      // console.log(ev.currentTarget, ev.currentTarget)
      let touch = ev.changedTouches[0]
      this.touch.x1 = touch.pageX
      this.touchStartTime = Date.now()
    },
    move(ev) {
      let touch = ev.changedTouches[0]
      this.touch.x2 = touch.pageX
      let diff = this.touch.x2 - this.touch.x1
      this.totalDiff = diff + this.currentDistance
      if (this.totalDiff < 0) {
        this.totalDiff = 0
      } else if (this.totalDiff > this.maxMoveDistance) {
        this.totalDiff = this.maxMoveDistance
      }
      let el = ev.currentTarget
      // let leftEl = el.parentElement.querySelector('.right-hidden')
      translate(el, this.totalDiff, 0)
      translate(this.leftEl, this.totalDiff, 0)
    },
    touchEnd(ev) {
      let touch = ev.changedTouches[0]
      this.touch.x2 = touch.pageX
      let diff = this.touch.x2 - this.touch.x1
      this.touchEndTime = Date.now()
      this.totalDiff = diff + this.currentDistance
      this.currentDistance = this.totalDiff
      let el = ev.currentTarget
      let touchTime = this.touchEndTime - this.touchStartTime
      // 当滑动距离超过一半或者快速滑动一段距离时，就进行完整的滑动
      // 快速滑动的数据是自己尝试的，体验可能不是很好^ ^
      if (this.totalDiff > this.maxMoveDistance / 2 || (touchTime < 150 && this.totalDiff > this.maxMoveDistance / 10)) {
        // this.$store.commit('updateDistance', this.currentDistance)
        translate(el, this.maxMoveDistance, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
        translate(this.leftEl, this.maxMoveDistance, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
        this.$emit('dragedSlide') // 通知父组件进行路由切换
      } else {
        this.totalDiff = this.currentDistance = 0
        translate(el, this.totalDiff, 0)
        translate(this.leftEl, this.totalDiff, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/var.scss';
.owner {
  // height: 100%;
  transform: translateZ(0);
  .pic {
    position: relative;
    .text-wrapper {
      position: fixed;
      bottom: 90px;
      right: 20px;
      .title {
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 700;
      }
    }
    .blur {
    position: absolute;
    background: white;
    width: 100%;
    height: 30px;
    bottom: -6px;
    filter: blur(4px)
    }
  }    
  

  .button {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
    height: 30px;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    background-color: $theme-color;
    color: white;
  }
  &.slide-left-enter, &.slide-left-leave-to {
    transform: translateX(100%)
  }
  &.slide-left-enter-active, &.slide-left-leave-active {
    transition: transform linear .2s
  }
}
</style>
