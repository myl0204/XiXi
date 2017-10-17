<template>
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
          <li v-for="cityObject in showCityList" :key="cityObject.flag" ref="list" v-show="cityObject.cityList.length">
            <h2 class="city-flag">{{cityObject.flag}}</h2>
            <ul @touchstart="highlightCity($event)" @touchend="cancelHighlight($event)">
              <li v-for="city in cityObject.cityList" class="city-item" 
              :key="city.eName">{{city.name}}</li>
            </ul>
          </li>
        </ul>
        <!-- <div v-show="!showCityList.length">没有城市！</div> -->
      </div>
    </div>
    <listNav :listNavShowFlag="listShowFlag" 
             :sequenceLetter="sequenceLetter"
             @onTouchstart="touchstart"
             @onTouchend="touchend"
             @onTouchmove="touchmove"></listNav>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import listNav from '@@/listnav/listNav'
// const sequenceLetter = ['Hot', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
const FLAG_HEIGHT = 40
export default {
  components: {
    Icon,
    listNav
  },
  // mounted() {
  //   this.sequenceLetter = this.allCity.map((val) => {
  //     return val.flag.slice(0, 1)
  //   })
  //   console.log(this.sequenceLetter)
  // },
  mounted() {
    this.scroll = new BScroll(this.$refs.listWrapper, {
      click: true,
      probeType: 3,
      bounce: false
    })
    this.scroll.on('scroll', (pos) => {
      this.scrollY = pos.y
    })
  },
  // updated() {
  //   // 在updated钩子初始化BS是因为created时listwrapper不显示，取不到。
  //   if (!this.scroll) {
  //     this.scroll = new BScroll(this.$refs.listWrapper, {
  //       click: true,
  //       probeType: 3
  //     })
  //     this.scroll.on('scroll', (pos) => {
  //       this.scrollY = pos.y
  //       // console.log(this.scrollY)
  //     })
  //     // this.$nextTick(() => {
  //     //   this._calculateHeight()
  //     //   console.log(this.listHeight)
  //     // })
  //     console.log(`up`, this.scroll)
  //   }
  // },
  props: {
    allCity: {
      type: Array
    },
    currentCity: {
      type: String
    }
  },
  watch: {
    allCity() {
      this.first = true
    },
    showCityList() {
      this.fixedFlag = this.showCityList[0].flag
      setTimeout(() => {
        this.scroll.refresh()
        this._calculateHeight()
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
          console.log(`fixedFlagTop`, fixedFlagTop)
          this.$refs.fixedFlag.style.transform = `translateY(${fixedFlagTop}px)`
        }
      }
    }
  },
  methods: {
    showList() {
      // 首次打开列表，scroll刷新，计算高度。
      if (this.first) {
        this.first = false
        // 这里$nextTick不起作用,可能是用法不对。
        // 猜测$nextTick是需要在数据改变后使用。
        setTimeout(() => {
          this.scroll.refresh()
          this._calculateHeight()
        }, 20)
      }
      this.showFlag = true
    },
    hideList() {
      this.showFlag = false
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
    _scroll(index) {
      console.log(index)
      // this.fixedFlag = this.sequenceLetter[index]
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
      console.log(this.listHeight)
    }
  },
  data() {
    return {
      first: true,
      input: '',
      showFlag: false,
      letterShowFlag: false,
      currentLetter: '',
      scrollY: -1,
      fixedFlag: ''
      // sequenceLetter: ['★', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
    }
  },
  computed: {
    showCityList() {
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
              return result
            }
          }
        } else {
          return []
        }
      } else {
        let result = []
        let nameReg = new RegExp(this.input)
        result = this.allCity.map((cityListObj) => {
          let cityList = cityListObj['cityList'].filter((cityObj) => {
            return cityObj.name.match(nameReg)
          })
          return {flag: cityListObj['flag'], cityList}
          // console.log('cityList', cityList)
          // let obj = {flag: cityListObj.flag, cityList: cityList}
          // return obj.cityList && obj.cityList.length
          // let cityList = cityListObj.cityList.filter((cityObj) => {
          //   return cityObj.name.match(nameReg)
          // })
          // return {flag: cityListObj.flag, cityList}
        })
        // console.log(result, 1)
        // let _result = []
        // result.forEach((cityListObj) => {
        //   if (cityListObj.cityList.length > 0) {
        //     _result.push(cityListObj)
        //   }
        // })
        // console.log(result, 2)
        return result
      }
    },
    listShowFlag() {
      return this.showCityList && this.showCityList.length > 0
    },
    sequenceLetter() {
      return this.allCity.map((val) => {
        return val.flag.slice(0, 1)
      })
    }
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
        padding: 9px 15px;
        font-size: 14px;
        line-height: 14px;
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
        height: 34px;
        line-height: 34px;
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
          line-height: 34px;
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
        z-index: 50;
        transform: translateZ(0)
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
  }
</style>