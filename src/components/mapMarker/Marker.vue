<template>
  <div class="marker-wrapper">
    <div class="marker">
      <img src="./symbol1.png" alt="" width="20">
      <div class="time-info-wrapper" v-show="showFlag">
        <div class="time-info">
          <div class="content" v-if="!isLoading">
            <span class="time">{{waitingTime}}分钟后</span><span class="text">开撸</span>
          </div>
          <loading :loadingShowFlag="isLoading" v-else></loading>
        </div>
        <span class="arrow"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@@/loading/Loading'
export default {
  props: {
    showFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      waitingTime: 2,
      isLoading: false
    }
  },
  methods: {
    calculateTime() {
      this.waitingTime = Math.floor(Math.random() * 10) + 1
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="scss">
@import '../../common/scss/var.scss';
@import '../../common/scss/mixin.scss';
$infoWidth: 67.05px;
.marker-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  font-size: 0;
  z-index: 1;
  .marker {
    position: relative;
    font-size: 16px;
    .time-info-wrapper {
      position: absolute;
      top: -48px;
      // width: $infoWidth;
      left: 50%;
      transform: translateX(-50%);
      .time-info {
        display: inline-block;
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 50;
        white-space: nowrap;
        border-radius: 16px;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2);
        background-color: #fff;
        .content {
          // width: $infoWidth;
        }
        .dot-wrapper {
          .dot {
            background-color: gray
          }
        }
        .time {
          color: $theme-color
        }
      }
      .arrow {
        @include angle-arrow(5px);
        // position: absolute;
        // display: inline-block;
        // top: -9px;
        bottom: -3px;
        // left: 50%;
        // transform: translateX(-50%);
        // width: 5px;
        // height: 5px;
        // background-color: #fff;
        transform: translateX(-50%) rotate(135deg);
        // border-width: 5px;
        // border-style: solid;
        // border: 5px solid transparent;
        border-color: #fff #fff transparent transparent;
        // box-shadow: 2px -2px 2px rgba(0, 0, 0, .2);
        // z-index: 10;
        // box-shadow: 0 -5px 1px rgba(0, 0, 0, .2)
        
      }
    }
  }
}
</style>
