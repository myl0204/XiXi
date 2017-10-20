<template>
  <transition name="silde-fade" @after-enter="afterEnter">
    <div class="city-selector" v-show="showFlag">
      <div class="city-input">
        <input type="text" placeholder="城市中文名或拼音" v-model="input">
        <span class="cancel">
          <span class="icon" @click="clearInput">
            <Icon name="times-circle" class="icon" v-show="input.length"></Icon>
          </span>
          <span class="text" @click="hideList">取消</span>
        </span>
      </div>
      <div class="city-list">
        <div class="cur-city" @click="showList">当前城市:{{currentCity}}</div>
        <h2 class="city-flag-fixed" ref="fixedFlag">{{fixedFlag}}</h2>
        <div class="other-city" ref="listWrapper">
          <ul>
            <li v-for="cityObject in cityListToShow" :key="cityObject.flag" ref="list" v-show="cityObject.cityList && cityObject.cityList.length">
              <h2 class="city-flag">{{cityObject.flag}}</h2>
              <ul @touchstart="highlightCity($event)" @touchend="cancelHighlight($event)">
                <li v-for="city in cityObject.cityList" class="city-item" 
                :key="city.eName">{{city.name}}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="info" v-show="!infoShowFlag"><p class="text">暂无结果，换个词试试吧！</p></div>
      <listNav  
              :sequenceLetter="sequenceLetter"
              @onTouchstart="touchstart"
              @onTouchend="touchend"
              @onTouchmove="touchmove"></listNav>
    </div>
  </transition>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import listNav from '@@/listnav/listNav'
const FLAG_HEIGHT = 40
// const VH = window.innerHeight
// const OFFSETY = 0.7 * VH - 54
export default {
  props: {
    allCity: {
      type: Array
    },
    currentCity: {
      type: String
    }
  },
  data() {
    return {
      input: '',
      showFlag: false,
      letterShowFlag: false,
      currentLetter: '',
      scrollY: -1,
      fixedFlag: ''
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.listWrapper, {
      click: true,
      probeType: 3,
      bounce: false
    })
    this.scroll.on('scroll', (pos) => {
      this.scrollY = pos.y
    })
    this.scroll.on('refresh', () => {
      this._calculateHeight()
    })
  },
  computed: {
    cityListToShow() {
      if (!this.input) {
        return this.allCity
      }
      let firstLetter = this.input.slice(0, 1).toUpperCase()
      // 当输入为字母时的情况
      if (firstLetter.charCodeAt(0) >= 65 && firstLetter.charCodeAt(0) <= 90) {
        let sequenceNumber = this.sequenceLetter.indexOf(firstLetter)
        if (sequenceNumber !== -1) {
          // 只有一个字母,输出首字母为该字母的所有城市
          // 否则进行字母配对
          if (this.input.length === 1) {
            return [this.allCity[sequenceNumber]]
          } else {
            let result = []
            let nameReg = new RegExp(this.input, 'i')
            result = this.allCity[sequenceNumber].cityList.filter((cityObj) => {
              return cityObj.eName.match(nameReg)
            })
            if (result.length) {
              return [
                {
                  flag: firstLetter.toUpperCase(),
                  cityList: result
                }
              ]
            } else {
              // 返回[{}]是为了不报错
              return [{}]
            }
          }
        } else {
          return [{}]
        }
      } else {
        let result = []
        let nameReg = new RegExp(this.input)
        result = this.allCity.map((cityListObj) => {
          let cityList = cityListObj['cityList'].filter((cityObj) => {
            return cityObj.name.match(nameReg)
          })
          return {flag: cityListObj['flag'], cityList}
        })
        return result
      }
    },
    infoShowFlag() {
      let result = false
      this.cityListToShow.forEach((cityObj) => {
        if (cityObj.cityList && cityObj.cityList.length) {
          result = true
          return
        }
      })
      return result
    },
    sequenceLetter() {
      return this.allCity.map((val) => {
        return val.flag.slice(0, 1)
      })
    }
  },
  methods: {
    showList() {
      this.showFlag = true
    },
    hideList() {
      this.showFlag = false
      this.clearInput()
      this._scroll(0)
      this.scrollY = 0
    },
    clearInput() {
      this.input = ''
    },
    highlightCity(ev) {
      ev.target.classList.add('active')
    },
    cancelHighlight(ev) {
      ev.target.classList.remove('active')
    },
    touchstart(index) {
      this._scroll(index)
    },
    touchend() {
      this.letterShowFlag = false
    },
    touchmove(index) {
      this._scroll(index)
    },
    afterEnter() {
      // 让BScroll重新计算各种属性，否则scrollToElement表现有误差
      // 因为按照之前的逻辑打开列表会refresh，此时正是fade-slide-enter的时候。
      this.scroll.refresh()
    },
    _scroll(index) {
      this.scroll.scrollToElement(this.$refs.list[index])
      this.scrollY = this.scroll.y
    },
    _calculateHeight() {
      let list = this.$refs.list
      this.listHeight = [0]
      for (let i = 0, height = 0, length = list.length; i < length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    cityListToShow() {
      this.fixedFlag = this.cityListToShow[0].flag
      setTimeout(() => {
        this.scroll.refresh()
        this.scrollY = 0
      }, 20)
    },
    scrollY(newVal) {
      let listHeight = this.listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        let h1 = listHeight[i]
        let h2 = listHeight[i + 1]
        if (-newVal >= h1 && -newVal < h2) {
          let flag = this.sequenceLetter[i]
          this.fixedFlag = flag === '★' ? '★热门城市' : flag
          let diff = h2 + newVal
          let fixedFlagTop = diff < FLAG_HEIGHT ? diff - FLAG_HEIGHT : 0
          this.$refs.fixedFlag.style.transform = `translateY(${fixedFlagTop}px)`
        }
      }
    }
  },
  components: {
    Icon,
    listNav
  }
}
</script>

<style lang="scss">
  .city-selector {
    position: absolute;
    width: 96%;
    left: 2%;
    top: 54px;
    bottom: 0;
    box-shadow: 1px -1px 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2);
    overflow: hidden;
    background-color: #fff;
    &.silde-fade-enter, &.silde-fade-leave-to {
      top: 70vh;
      opacity: 0;
    }
    &.silde-fade-enter-active, &.silde-fade-leave-active {
      transition:all .15s linear
    }
    .city-input {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 36px;
      background-color: #fff;
      box-shadow: 0 2px 1px rgba(0, 0, 0, .2);
      // box-sizing: border-box;
      input {
        // 这里用padding来撑开高度的话会遮挡父级的box-shadow。
        height: 36px;
        padding: 0px 15px;
        font-size: 12px;
        // line-height: 14px;
        caret-color: #ff9800;
        &:focus {
          border: none;
          outline: none
        }
      }
      .cancel {
        position: absolute;
        right: 15px;
        top: 0;
        height: 36px;
        line-height: 36px;
        font-size: 0;
        color: gray;
        .icon {
          position: relative;
          display: inline-block;
          height: 100%;
          // top: 3px;
          margin-right: 4px;
        }
        .text {
          vertical-align: top;
          display: inline-block;
          height: 100%;
          padding-left: 7px;
          font-size: 12px;
          line-height: 36px;
          position: relative;
          &:after {
            display: block;
            position: absolute;
            left: 0;
            bottom: 33.3%;
            content: ' ';
            width: 0;
            height: 33.3%;
            border-left: 1px solid rgba(128, 128, 128, .1);
            @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
              -webkit-transform: scaleX(0.7);
              transform: scaleX(0.7)
            }
            @media (-webkit-min-device-pixel-ratio: 2),
            (min-device-pixel-ratio: 2) {
              -webkit-transform: scaleX(0.5);
              transform: scaleX(0.5)
            }
          }
        }
      }
    }
    .city-list {
      // position: relative;
      // top: 54px;
      // width: 100%;
      // margin: 0 20px;
      overflow: hidden;
      
      .cur-city {
        position: relative;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        z-index: 20;
        // transform: translateZ(0)
      }
      .city-flag-fixed {
        position: absolute;
        // top: 40px;
        width: 100%;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 200;
        color: gray;
        background-color: #f7f7f7;
        z-index: 10;
      }
      .other-city {
        position: absolute;
        width: 100%;
        left: 0;
        top: 40px;
        bottom: 0;
        // padding: 0 20px;
        overflow: hidden;
        // z-index: 20;
        .city-flag {
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: 200;
          color: gray;
          background-color: #f7f7f7;
          // font-size: 
        }
        .city-item {
          position: relative;
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          &.active {
            background-color: rgba(230, 230, 230, 0.5);
          }
          &:after {
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            content: ' ';
            width: 100%;
            height: 0;
            border-bottom: 1px solid rgba(128, 128, 128, .1);
            @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
              -webkit-transform: scaleY(0.7);
              transform: scaleY(0.7)
            }
            @media (-webkit-min-device-pixel-ratio: 2),
            (min-device-pixel-ratio: 2) {
              -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5)
            }
          }
        }
      }
    }
    .info {
      position: absolute;
      top: -40px;
      bottom: 0;
      width: 100%;
      text-align: center;
      background-color: #fff;
      z-index: 30;
      .text {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%)
      }
    }
  }
</style>