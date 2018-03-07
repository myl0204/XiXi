<template>
  <div class="sharing-wrapper">
    <div class="sharing-header">
      <div class="header-left">
        <router-link :to="{name: 'passenger'}" class="tab-passenger">
          撸猫客
          <div class="underline" ref="underline"></div>
        </router-link>
        <router-link :to="'driver'" class="tab-driver">猫主人</router-link>       
        <div class="title">
          <span class="angle"></span>
          <span class="text">月赚1500</span>
        </div>
      </div>
      <div class="header-right">
        <div class="service icon">
          <Icon name="headphones"></Icon>
        </div>
        <div class="mysharing icon">
          <Icon name="car"></Icon>
        </div>
      </div>
    </div>
    <div class="sharing-content-wrapper">
      <passenger class="sharing-content left-hidden" @transitionend.native="updateRouter($event, 'passenger')"/>
        <router-view 
          class="sharing-content" 
          :transitionName="transitionName"
          @dragedSlide="confirmDragSlide"
        >
        </router-view>
      <driver class="sharing-content right-hidden" @transitionend.native="updateRouter($event, 'driver')"/>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import { fillTheScreen } from '@/common/js/util.js'
import Passenger from './Passenger'
import Driver from './Driver'
export default {
  mounted() {
    // 计算内容高度
    const target = document.querySelector('.sharing-content-wrapper')
    const totalHeight = 116
    fillTheScreen({target, totalHeight})
  },
  updated() {
    // console.log('updated')
    // this.transitionName = 'slide'
    this.toggleType()
  },
  beforeRouteUpdate(to, from, next) {
    this.transitionName = this.isDragedSlide ? '' : 'slide'
    next()
  },
  data() {
    return {
      transitionName: 'slide',
      isDragedSlide: false
    }
  },
  methods: {
    // 保持“下划线”和当前路由一致
    toggleType() {
      const underline = this.$refs.underline
      const type = this.$route.name
      if (type === 'passenger') {
        underline.style.transform = `translateX(0)`
      } else if (type === 'driver') {
        underline.style.transform = `translateX(57px)`
      }
    },
    // 通过更改transitionName来改变动画
    confirmDragSlide() {
      // console.log('chufale')
      this.isDragedSlide = true
    },
    updateRouter(ev, routeName) {
      if (this.isDragedSlide) {
        let el = ev.target
        this.$router.push(routeName)
        el.style.transform = ''
        el.style.transitionDuration = '0s'
        this.isDragedSlide = false
      }
    }
  },
  components: {
    Icon,
    Passenger,
    Driver
  }
}
</script>

<style lang="scss">
@import '../../common/scss/var.scss';
.sharing-wrapper {
  position: relative;
  // padding: 0 10px;
  z-index: 15;
  .sharing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    background-color: #fff;
    .header-left {
      font-size: 0px;
      font-weight: 200;
      color: #000;
      a {
        position: relative;
        display: inline-block;
        font-size: 14px;
        // margin-right: 24px;
        &.tab-passenger {
          margin-right: 15px;
        }
        &.tab-driver {
          margin-right: 5px;
        }
        &.router-active {
          color: $theme-color;
        }
        .underline {
          position: absolute;
          left: 0;
          bottom: -3px;
          display: inline-block;
          width: 100%;
          height: 1px;
          transition: transform .4s linear;
          background-color: $theme-color;
        }
      }
      .title {
        position: relative;
        display: inline-block;
        vertical-align: top;
        background-color: red;
        border-radius: 3px;
        .angle {
          position: absolute;
          left: -3px;
          top: 4px;
          // z-index: 0;
          border-width: 5px;
          border-style: solid;
          border-color: transparent red red transparent;
        }
        .text {
          position: relative;
          top: 3px;
          display: inline-block;
          height: 14px;
          font-size: 10px;
          font-weight: 200;
          color: #fff;
        }
      }
    }
    .header-right {
      .icon {
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
    }
  }
  .sharing-content-wrapper {
    position: absolute;
    top: 30px;
    width: 100%;
    .sharing-content {
      position: absolute;
      height: 100%;
      width: 100%;
      &.left-hidden {
        position: absolute;
        top: 0;
        left: -100%;
      }
      &.right-hidden {
        position: absolute;
        top: 0;
        right: -100%
      }
    }
  }
  
}
</style>
