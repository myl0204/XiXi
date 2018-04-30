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
    <tab-slider
      class="sharing-content-wrapper"
      :comp="compData"
      @success="toggleType"/>
  </div>
</template>slider

<script>
import Icon from 'vue-awesome/components/Icon'
import tabSlider from 'tab-slider'
import { fillTheScreen } from '@/common/js/util.js'
export default {
  mounted() {
    // 计算内容高度
    const target = document.querySelector('.sharing-content-wrapper')
    const height = 116
    // console.log(target)
    fillTheScreen({target, height})
  },
  data() {
    return {
      compData: [
        {
          name: 'passenger',
          component: () => import('./Passenger')
        },
        {
          name: 'driver',
          component: () => import('./Driver')
        }
      ]
    }
  },
  methods: {
    // 保持“下划线”和当前路由一致
    toggleType(routeName) {
      const underline = this.$refs.underline
      if (routeName === 'passenger') {
        underline.style.transform = `translateX(0)`
      } else if (routeName === 'driver') {
        underline.style.transform = `translateX(57px)`
      }
    }
  },
  components: {
    Icon,
    tabSlider
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
    }
    .out_of_screen {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      &.out_of_screen-left {
        left: -100%;
      }
      &.out_of_screen-right {
        right: -100%;
      }
    }
  }
  
}
</style>
