<template>
  <div class="list-nav">
    <ul>
      <li
        v-for="(letter, index) in navLetterList"
        class="item"
        :key="letter"
        ref="list"
        @touchstart="onTouchstart($event, index)"
        @touchend="onTouchend($event)"
        @touchmove.prevent="onTouchmove($event, index)">
        {{letter}}
      </li>
    </ul>
    <div class="letter" v-show="isLetterVisible">{{currentLetter}}</div>
  </div>
</template>

<script>
const NAV_HEIGHT = 18
export default {
  props: {
    navLetterList: {
      type: Array
    }
  },
  data() {
    return {
      isLetterVisible: false,
      currentLetter: '',
      touch: {}
    }
  },
  methods: {
    onTouchstart(ev, index) {
      this.isLetterVisible = true
      this.currentLetter = this.navLetterList[index]
      const touch = ev.changedTouches[0]
      this.touch.y1 = touch.pageY
      this.$emit('listNavTouchstart', index)
    },
    onTouchend(ev) {
      this.isLetterVisible = false
    },
    onTouchmove(ev, currentIndex) {
      const touch = ev.changedTouches[0]
      this.touch.y2 = touch.pageY
      const dif = (this.touch.y2 - this.touch.y1) / NAV_HEIGHT
      const index = currentIndex + parseInt(dif) >= this.navLetterList.length
        ? this.navLetterList.length - 1
        : index < 0
        ? 0
        : currentIndex + parseInt(dif)
      this.currentLetter = this.navLetterList[index]
      this.$emit('listNavTouchmove', index)
    }
  }
}
</script>

<style lang="scss">
.list-nav {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  z-index: 20;
  .item {
    padding: 2px 10px;
    font-size: 14px;
    text-align: center;
  }
  .letter {
    position: absolute;
    top: 50%;
    left: -50vw;
    margin-top: -25px;
    transform: translateX(50%);
    width: 50px;
    height: 50px;
    border-radius: 5px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    background-color: #000;
    z-index: 10;
  }
}
</style>
