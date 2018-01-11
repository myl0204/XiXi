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
        <router-link 
          ref="links"
          v-for="(link, index) in routerLink" 
          :to="link.to" 
          class="type" 
          :key="index"
          @click.native="tabClick(index)">
            {{link.text}}
        </router-link>
        <!-- <router-link :to="{name: 'content', params: {catType: 'fast'}}" class="type">快猫</router-link>
        <router-link :to="{name: 'content', params: {catType: 'rent'}}" class="type">出租猫</router-link>
        <router-link :to="{name: 'content', params: {catType: 'special'}}" class="type">专猫</router-link>
        <router-link :to="{name: 'sharing'}" class="type">顺风猫</router-link>
        <router-link :to="{name: 'content', params: {catType: 'substitute'}}" class="type">代撸</router-link>
        <router-link :to="{name: 'content', params: {catType: 'second-hand'}}" class="type">二手猫</router-link>
        <router-link :to="{name: 'content', params: {catType: 'cloud'}}" class="type">云撸猫</router-link> -->
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
  data() {
    return {
      routerLink: [
        {
          to: {name: 'content', params: {catType: 'fast'}},
          text: '快猫'
        },
        {
          to: {name: 'content', params: {catType: 'rent'}},
          text: '出租猫'
        },
        {
          to: {name: 'content', params: {catType: 'special'}},
          text: '专猫'
        },
        {
          to: {name: 'sharing'},
          text: '顺风猫'
        },
        {
          to: {name: 'content', params: {catType: 'substitute'}},
          text: '代撸'
        },
        {
          to: {name: 'content', params: {catType: 'second-hand'}},
          text: '二手猫'
        },
        {
          to: {name: 'content', params: {catType: 'clound'}},
          text: '云撸猫'
        }
      ]
    }
  },
  computed: {
    curCity() {
      /* eslint-disable no-undef */
      return this.$store.state.curCity
    }
  },
  methods: {
    tabClick(index) {
      let target = this.$refs.links[index].$el
      this.Scroll.scrollToElement(target, 0, true)
    },
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
@import '../../common/scss/var.scss';
  .header-wrapper{
    position: relative;
    padding: 10px 10px 15px;
    background-color: #fff;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, .2);
    z-index: 10;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
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
      // line-height: 19px;
      // margin-bottom: 10px;
      overflow: hidden;
      white-space:nowrap;
      // z-index: 5;
      ul {
        width: 425px;
        height: 16px;
        font-size:0;
        .type {
          display: inline-block;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 200;
          line-height: 16px;
          color: #000;
          &.router-active {
            color: $theme-color
          }
          &:first-child {
            padding-left: 0
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
