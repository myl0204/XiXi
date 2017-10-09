<template>
<div class="header-wrapper">
  <div class="header">
    <div class="user">
      <Icon name="user" scale="1.5"></Icon>
    </div>
    <div class="city">杭州市<Icon name="angle-down"></Icon></div>
    <div class="message">
      <Icon name="reorder" scale="1.5"></Icon>
    </div>
  </div>
  <div class="tab" ref="catType" @click="haha">
    <ul>
      <li class="type">狸花猫</li>
      <li class="type">波斯猫</li>
      <li class="type">金吉拉</li>
      <li class="type">美短</li>
      <li class="type">英短</li>
      <li class="type">橘猫</li>
      <li class="type">加菲</li>
    </ul>
    <div class="all-type">
      <icon name="th-large"></icon>
    </div>
  </div>
</div>
  
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'

export default {
  components: {
    Icon
  },
  created() {
    this.$nextTick(() => {
      this.tabScroll = new BScroll(this.$refs.catType, {
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
  },
  methods: {
    haha() {
      console.log(this.tabScroll)
    }
  }
}
</script>

<style lang="scss">
  .header-wrapper{
    padding: 10px;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      // padding: 10px;
      .user {
        // margin-left: 5px;
      }
      .city {
        line-height: 34px;
      }
    }
    .tab {
      position: relative;
      width: 100%;
      overflow: hidden;
      white-space:nowrap;
      ul {
        width: 387px;
        font-size:0;
        .type {
          display: inline-block;
          font-size: 16px;
          font-weight: 200;
          color: #000;
          &.current {
            color: orange;
          }
          &:not(:last-child) {
            margin-right: 15px;
          }
        }
      }
      .all-type {
        position: absolute;
        top: 0;
        right: 0;
        height: 16px;
        box-shadow: -5px 0 3px #fff;
        background-color: #fff;
      }
    }
  }
  
</style>
