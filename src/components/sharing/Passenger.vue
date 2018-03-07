<template>
  <transition :name="transitionName + '-right'">
    <div class="customer" ref="customer"
      @touchstart="touchStart"
      @touchmove="move"
      @touchend="touchEnd"
    >
      我要撸猫我要撸猫我要撸猫我要撸猫
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
    this.rightEl = this.$refs.customer.parentElement.querySelector('.right-hidden')
  },
  data() {
    return {
      touch: {},
      currentDistance: 0,
      totalDiff: 0,
      touchStartTime: 0,
      touchEndTime: 0
    }
  },
  methods: {
    touchStart(ev) {
      let touch = ev.changedTouches[0]
      this.touch.x1 = touch.pageX
      this.touchStartTime = Date.now()
    },
    move(ev) {
      let touch = ev.changedTouches[0]
      this.touch.x2 = touch.pageX
      let diff = this.touch.x2 - this.touch.x1
      this.totalDiff = diff + this.currentDistance
      if (this.totalDiff > 0) {
        this.totalDiff = 0
      } else if (-this.totalDiff > this.maxMoveDistance) {
        this.totalDiff = -this.maxMoveDistance
      }
      let el = ev.currentTarget
      // let rightEl = el.parentElement.querySelector('.right-hidden')
      translate(el, this.totalDiff, 0)
      translate(this.rightEl, this.totalDiff, 0)
    },
    touchEnd(ev) {
      // let el = this.$refs.customer
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
      if (-this.totalDiff > this.maxMoveDistance / 2 || (touchTime < 150 && -this.totalDiff > this.maxMoveDistance / 10)) {
        // this.$store.commit('updateDistance', this.currentDistance)
        translate(el, -this.maxMoveDistance, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
        translate(this.rightEl, -this.maxMoveDistance, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
        this.$emit('dragedSlide')
      } else {
        this.totalDiff = this.currentDistance = 0
        translate(el, this.totalDiff, 0)
        translate(this.rightEl, this.totalDiff, 0, {
          transitionTimingFunction: 'linear',
          transitionDuration: '.1s'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.customer {
  text-align: center;
  line-height: 100px;
  background: #f5f5f5;
  &.slide-right-enter, &.slide-right-leave-to {
    transform: translateX(-100%)
  }
  &.slide-right-enter-active, &.slide-right-leave-active {
    transition: transform linear .2s
  }
}
</style>
