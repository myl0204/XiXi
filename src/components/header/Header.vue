<template>
  <div class="header">
    <div class="header__main">
      <div class="user" @click="userClick">
        <Icon name="user" scale="1.5"></Icon>
      </div>
      <div class="city" @click="showCityList"><span class="text">{{curCity}}</span><span class="icon"><Icon name="angle-down"></Icon></span></div>
      <div class="message">
        <Icon name="reorder" scale="1.5"></Icon>
      </div>
    </div>
    <div class="header__tab" ref="catType">
      <ul>
        <router-link 
          ref="links"
          v-for="(link, index) in routerLink"
          :to="link.to"
          class="tab__type"
          active-class="tab__type--active"
          :key="index"
          @click.native="tabClick(index)">
            {{link.text}}
        </router-link>
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
import { storage } from '@/common/js/util.js'
import { mapMutations } from 'vuex'
const CITY_LIST = 0
const DEFALUT_LISTSUBTYPE = 0
const FIRST_STEP = 1
export default {
  created() {
    this.$nextTick(() => {
      this.Scroll = new BScroll(this.$refs.catType, {
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
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
    ...mapMutations([
      'showUser',
      'showList',
      'toggleList'
    ]),
    ...mapMutations({
      showLogInModal: 'changeLogInStepTo'
    }),
    tabClick(index) {
      const target = this.$refs.links[index].$el
      this.Scroll.scrollToElement(target, 0, true)
    },
    userClick() {
      const cookie = storage.getCookie()
      cookie.isLogged === 'true'
        ? this.showUser()
        : this.showLogInModal(FIRST_STEP)
    },
    showCityList() {
      this.showList()
      this.toggleList({
        placeholder: '城市中文名或拼音',
        listType: CITY_LIST,
        listSubType: DEFALUT_LISTSUBTYPE
      })
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="scss">
@import '../../common/scss/var.scss';
  .header{
    position: relative;
    padding: 10px 10px 15px;
    background-color: #fff;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, .2);
    z-index: 10;
    &__main {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
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
    &__tab {
      position: relative;
      width: 100%;
      overflow: hidden;
      white-space:nowrap;
      ul {
        width: 425px;
        height: 16px;
        font-size:0;
        .tab__type {
          display: inline-block;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 200;
          line-height: 16px;
          color: #000;
          &--active {
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
