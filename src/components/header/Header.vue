<template>
<div class="header-wrapper">
  <div class="header">
    <div class="user" @click="userClick">
      <Icon name="user" scale="1.5"></Icon>
    </div>
    <!-- <User ref="user"></User> -->
    <div class="city" @click="showCityList"><span class="text">{{curCity}}</span><span class="icon"><Icon name="angle-down"></Icon></span></div>
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
  <!-- <City :allCity="allCity" ref="cityList"></City> -->
</div>
  
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import City from '@@/city/City'
import util from '@/common/js/util.js'
const CITY_LIST = 0
const DEFALUT_LISTSUBTYPE = 0
const FIRST_STEP = 1
// const SUC_CODE = 0
export default {
  // data() {
  //   return {
  //     allCity: []
  //   }
  // },
  created() {
    this.$nextTick(() => {
      this.Scroll = new BScroll(this.$refs.catType, {
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
    // this.$http.get('/api/citylist')
    //   .then((res) => {
    //     if (res.status >= 200 && res.status < 300 || res.status === 304) {
    //       if (res.data.errno === SUC_CODE) {
    //         this.allCity = res.data.data
    //       }
    //     }
    //   })
  },
  computed: {
    curCity() {
      /* eslint-disable no-undef */
      return this.$store.state.curCity
    }
  },
  methods: {
    userClick() {
      const cookie = util.getCookie()
      if (cookie.isLogged === 'true') {
        this.showUser()
      } else {
        this.showLogInModal()
      }
    },
    showUser() {
      this.$store.commit('showUser')
    },
    showLogInModal() {
      this.$store.commit('changeLogInStepTo', FIRST_STEP)
    },
    showCityList() {
      this.$store.commit('showList')
      this.$store.commit('toggleList', {
        pHolder: '城市中文名或拼音',
        listType: CITY_LIST,
        listSubType: DEFALUT_LISTSUBTYPE
      })
    }
  },
  components: {
    Icon,
    City
  }
}
</script>

<style lang="scss">

  .header-wrapper{
    position: relative;
    padding: 10px;
    // box-sizing: border-box;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, .1);
    z-index: 10;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      // padding: 10px;
      .user {
        // margin-left: 5px;
      }
      .city {
        line-height: 30px;
        .text {
          display: inline-block;
          margin-right: 5px;
        }
        .icon {
          position: relative;
          top: 2px;
        }
      }
    }
    .tab {
      position: relative;
      width: 100%;
      // margin-bottom: 10px;
      overflow: hidden;
      white-space:nowrap;
      // z-index: 5;
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
