<template>
  <div class="list-nav">
    <ul v-show="listNavShowFlag" >
      <li v-for="(letter, index) in sequenceLetter" class="item" :key="letter" ref="list"
      @touchstart="onTouchstart($event, index)" @touchend="onTouchend($event)" @touchmove.prevent="onTouchmove($event, index)"
      >{{letter}}</li>
    </ul>
    <div class="letter" v-show="letterShowFlag">{{currentLetter}}</div>
  </div>
</template>

<script>
const NAV_HEIGHT = 18
export default {
  props: {
    listNavShowFlag: {
      type: Boolean
    },
    sequenceLetter: {
      type: Array
    }
  },
  data() {
    return {
      letterShowFlag: false,
      currentLetter: '',
      touch: {}
    }
  },
  methods: {
    onTouchstart(ev, index) {
      this.letterShowFlag = true
      this.currentLetter = this.sequenceLetter[index]
      let touch = ev.changedTouches[0]
      this.touch.y1 = touch.pageY
      this.$emit('onTouchstart', index)
    },
    onTouchend(ev) {
      this.letterShowFlag = false
      this.$emit('onTouchend')
    },
    onTouchmove(ev, index) {
      let touch = ev.changedTouches[0]
      this.touch.y2 = touch.pageY
      let dif = (this.touch.y2 - this.touch.y1) / NAV_HEIGHT
      index = index + parseInt(dif)
      if (index >= this.sequenceLetter.length) {
        index = this.sequenceLetter.length - 1
      } else if (index < 0) {
        index = 0
      }
      this.currentLetter = this.sequenceLetter[index]
      this.$emit('onTouchmove', index)
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
