<template>
  <div class="sharing-wrapper">
    <div class="sharing-header">
      <div class="header-left">
        <router-link :to="{name: 'passenger'}" class="passenger" @click.native="toggleType(0)">
          撸猫客
          <div class="underline" ref="underline"></div>
        </router-link>
        <router-link :to="'driver'" class="driver" @click.native="toggleType(1)">猫主人</router-link>       
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
    <router-view class="sharing-content"></router-view>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
const PASSENGER = 0
const DRIVER = 1
export default {
  methods: {
    toggleType(type) {
      let underline = this.$refs.underline
      if (type === PASSENGER) {
        underline.style.transform = `translateX(0)`
      } else if (type === DRIVER) {
        underline.style.transform = `translateX(57px)`
      }
    }
  },
  components: {
    Icon
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
        &.passenger {
          margin-right: 15px;
        }
        &.driver {

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
      .router-active {
        color: $theme-color;
      }
    }
    .header-right {
      // height: 20px;
      .icon {
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
    }
  }
  .sharing-content {

    background-color: gray;
  }
  
}
</style>
