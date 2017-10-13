<template>
<div class="header-wrapper">
  <div class="header">
    <div class="user">
      <Icon name="user" scale="1.5"></Icon>
    </div>
    <div class="city" @click="showList">{{currentCity}}<Icon name="angle-down"></Icon></div>
    <div class="message">
      <Icon name="reorder" scale="1.5"></Icon>
    </div>
  </div>
  <div class="tab" ref="catType">
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
  <transition>
    <City :allCity="allCity" ref="cityList" :currentCity="currentCity"></City>
  </transition>
</div>
  
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import City from '@@/city/City'

const SUC_CODE = 0
export default {
  components: {
    Icon,
    City
  },
  data() {
    return {
      allCity: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.tabScroll = new BScroll(this.$refs.catType, {
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
    this.$http.get('/api/citylist')
      .then((res) => {
        console.log(res)
        if (res.status >= 200 && res.status < 300 || res.status === 304) {
          // res = res.data
          // console.log(res.data.errno)
          if (res.data.errno === SUC_CODE) {
            this.allCity = res.data.data
            console.log(this.allCity)
          }
        }
      })
  },
  methods: {
    showList() {
      // console.log('show')
      this.$refs.cityList.showList()
    }
  },
  computed: {
    currentCity() {
      /* eslint-disable no-undef */
      if (_DEFAULT_CITY) {
        return _DEFAULT_CITY.city
      } else {
        return '获取城市中'
      }
    }
  }
}
</script>

<style lang="scss">
  .header-wrapper{
    padding: 10px;
    // box-sizing: border-box;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, .1);
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
      // margin-bottom: 10px;
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
