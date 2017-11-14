<template>
  <div class="user-wrapper">
    <div class="user-header">
      <div class="user-avatar" ref="avatar">
        <img src="../../assets/id.jpg" alt="" width="60">
      </div>
      <div class="user-info" ref="info">
        <span class="user-name">测试</span>
        <div class="user-type">普通会员</div>
      </div>
    </div>
    <div class="user-options">
      <div class="options-mask"  ref="optionsMask"></div>
      <div class="options-item journey">
        <span class="icon">
          <Icon name="car"></Icon>
        </span>
        <span class="text">行程</span>
      </div>
      <div class="options-item wallet">
        <span class="icon">
          <Icon name="credit-card"></Icon>
        </span>
        <span class="text">钱包</span>
      </div>
      <div class="options-item service">
        <span class="icon">
          <Icon name="headphones"></Icon>
        </span>
        <span class="text">客服</span>
      </div>
      <div class="options-item settings">
        <span class="icon">
          <Icon name="gear"></Icon>
        </span>
        <span class="text">设置</span>
      </div>
    </div>
    <div class="other-content" 
      ref="otherContent"
      @touchstart="onOtherContentTouchStart" 
      @touchend="onOtherContentTouchEnd"
      @touchmove="moveUpOtherContent">
      <span class="icon" @click="toggleContent">
        <Icon name="angle-up" :class="{'fa-flip-vertical': atDownStatus}" class="icon-self"></Icon>
      </span>
      <div class="content-wrapper">
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">推荐有奖</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">车主招募</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">积分商城</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">感谢您</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">如此用心的</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">看的我项目</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">如果喜欢</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">可以star</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">可以PR</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">如果你是hr</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">也可以联系我</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">我正在</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">找工作</span>
        </div>
        <div class="content">
          <div class="content-icon">
            <span class="icon">
              <Icon name="eercast"></Icon>
            </span>
          </div>
          <span class="text">^_^</span>
        </div>
        <div class="content" @click="showResume">
          <div class="content-icon">
            <span class="icon">
              <Icon name="hand-pointer-o"></Icon>
            </span>
          </div>
          <span class="text">我的简历</span>
        </div>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
export default {
  data() {
    return {
      touch: {},
      currentDiff: 0,
      deviceHeight: 0,
      atDownStatus: false
    }
  },
  created() {
    this.deviceHeight = window.innerHeight
    this.maxMoveDistance = this.deviceHeight - 117 - 76 + 18
  },
  methods: {
    toggleContent() {
      this.atDownStatus ? this.contentMoveToBottom() : this.contentMoveToTop()
    },
    contentMoveToTop() {
      this.currentDiff = -this.maxMoveDistance
      this.$refs.otherContent.style.transition = `transform .2s linear`
      this.$refs.otherContent.style.transform = `translateY(${-this.maxMoveDistance}px)`
      this.$refs.avatar.style.transition = `transform .2s linear`
      this.$refs.avatar.style.transform = `scale(.5)`
      this.$refs.info.style.opacity = 0
      this.$refs.info.style.transform = `scale(.5)`
      this.$refs.info.style.transition = `transform .2s linear`
      this.$refs.optionsMask.style.background = `rgba(255, 255, 255, .5)`
      this.$refs.optionsMask.style.transition = `background .2s linear`
      setTimeout(() => {
        this.atDownStatus = true
      }, 200)
    },
    contentMoveToBottom() {
      this.currentDiff = 0
      this.$refs.otherContent.style.transition = `transform .2s linear`
      this.$refs.otherContent.style.transform = `translateY(0px)`
      this.$refs.avatar.style.transition = `transform .2s linear`
      this.$refs.avatar.style.transform = `scale(1)`
      this.$refs.info.style.opacity = 1
      this.$refs.info.style.transform = `scale(1)`
      this.$refs.info.style.transition = `transform .2s linear`
      this.$refs.optionsMask.style.background = `rgba(255, 255, 255, 0)`
      this.$refs.optionsMask.style.transition = `background .2s linear`
      setTimeout(() => {
        this.atDownStatus = false
      }, 200)
    },
    onOtherContentTouchStart(ev) {
      let touch = ev.changedTouches[0]
      this.touch.y1 = touch.pageY
      this.$refs.otherContent.style.transition = ''
      // console.log(touch)
      // console.log(`y1`, this.touch.y1)
    },
    onOtherContentTouchEnd(ev) {
      let touch = ev.changedTouches[0]
      this.touch.y2 = touch.pageY
      // 当次滑动的距离
      let newDiff = this.touch.y2 - this.touch.y1
      // 总滑动距离
      let totalDiff = newDiff + this.currentDiff
      this.currentDiff = totalDiff
      if (this.currentDiff > 0) {
        this.currentDiff = 0
      }
      // 超过一定距离松手则展示，否则隐藏。
      if (-totalDiff >= this.deviceHeight / 3) {
        this.contentMoveToTop()
      } else {
        this.contentMoveToBottom()
      }
    },
    moveUpOtherContent(ev) {
      let touch = ev.changedTouches[0]
      this.touch.y2 = touch.pageY
      let newDiff = this.touch.y2 - this.touch.y1
      let totalDiff = newDiff + this.currentDiff
      if (-totalDiff > this.maxMoveDistance) {
        totalDiff = -this.maxMoveDistance
      } else if (totalDiff > 0) {
        totalDiff = 0
      }
      // 头像缩放倍数
      let ratio = 1 + totalDiff / (2 * this.maxMoveDistance)
      // 文字透明度
      let opacity = 1 + 2 * totalDiff / this.maxMoveDistance
      // 遮罩透明度
      let maskOpacity = -totalDiff / this.maxMoveDistance
      console.log(maskOpacity)
      // 滑动其他内容
      this.$refs.otherContent.style.transform = `translateY(${totalDiff}px)`
      // 缩放头像以及隐藏文字
      this.$refs.avatar.style.transform = `scale(${ratio})`
      this.$refs.info.style.opacity = opacity
      this.$refs.info.style.transform = `scale(${ratio})`
      this.$refs.optionsMask.style.background = `rgba(255, 255, 255, ${maskOpacity})`
    },
    showResume() {
      window.open('https://github.com/myl0204')
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="scss">
.user-wrapper {
  position: fixed;
  left: 0;
  right: 35%;
  top: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 2px 0 2px rgba(0, 0, 0, .2);
  z-index: 30;
  transform: translateZ(0px);
  .user-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 33.33vh;
    .user-avatar {
      width: 60px;
      height: 60px;
      transform-origin: center -60px;
      transition: transform .2s linear;
      border-radius: 50%;
      overflow: hidden;
    }
    .user-info {
      text-align: center;
      .user-name {
        display: inline-block;
        margin: 10px 0;
        font-size: 14px;
      }
      .user-type {
        font-size: 10px;
      }
    }
  }
  .user-options {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 33.33vh;
    margin-bottom: (33.33vh / 2) + (100vh / 6);
    .options-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .options-item {
      font-size: 0;
      padding-left: 30px;
      & span {
        display: inline-block;
      }
      &~.options-item {
        margin-top: 30px;
      }
      &.highlight {
        background-color: rgba(230, 230, 230, 0.5)
      }
      .icon {
        margin-right: 8px;
        vertical-align: top;
      }
      .text {
        font-size: 16px;
      }
    }
  }
  .other-content {
    margin-top: -117px;
    // transition: transform 0 linear;
    background-color: #fff;
    overflow: hidden;
    .icon {
      display: block;
      width: 16px;
      text-align: center;
      margin: 0 auto;
      .icon-self {
        transition: transform .2s linear
      }
    }
    .content-wrapper {
      display: flex;
      flex-wrap: wrap;
      .content {
        flex: 0 1 (65vw / 3);
        text-align: center;
        font-size: 12px;
        margin-top: 30px;
        .content-icon {
          @extend .icon
        }
        .text {
          display: inline-block;
          margin-top: 10px;
        }
      }
    }
  }
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 100%;
    width: 60%;
    flex: 0 1 0;
    background-color: rgba(0, 0, 0, .4);
  }
}
</style>

