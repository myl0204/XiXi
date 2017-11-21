<template>
  <div class="city-list">
    <div class="cur-city">当前城市:{{curCity}}</div>
    <h2 class="city-flag-fixed" ref="fixedFlag">{{fixedFlag}}</h2>
    <div class="other-city" ref="listWrapper">
      <ul>
        <li v-for="cityObject in cityListToShow" :key="cityObject.flag" ref="list">
          <h2 class="city-flag">{{cityObject.flag}}</h2>
          <ul @touchstart="highlightCity($event)" @touchend="normalizeCity($event)">
            <li v-for="city in cityObject.cityList" class="city-item" 
            :key="city.eName" :data-cname="city.name" @click="changeCity($event)">{{city.name}}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="info" v-show="!infoShowFlag"><p class="text">暂无结果，换个词试试吧！</p></div>
    <list-nav  
      :sequenceLetter="sequenceLetter"
      @listNavTouchstart="_scroll"
      @listNavTouchend="hideLetter"
      @listNavTouchmove="_scroll">
    </list-nav>
  </div>
</template>

<script>
// import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
import listNav from '@@/listnav/listNav'
const FLAG_HEIGHT = 40
export default {
  props: {
    allCity: {
      type: Array,
      default: [{}]
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
  data() {
    return {
      scrollY: -1,
      fixedFlag: '★热门城市'
    }
  },
  computed: {
    curCity() {
      return this.$store.state.curCity
    },
    listShowFlag() {
      return this.$store.state.listShowFlag
    },
    input() {
      return this.$store.state.cityInput
    },
    cityListToShow() {
      if (!this.input) {
        return this.allCity
      }
      let firstLetter = this.input.slice(0, 1).toUpperCase()
      let nameReg = new RegExp('^' + this.input, 'i')
      // 在热门城市中的检索结果
      let hotCityResult = this.allCity[0].cityList.filter((cityObj) => {
        return cityObj.eName.match(nameReg)
      })
      // 当输入为字母时的情况
      if (firstLetter.charCodeAt(0) >= 65 && firstLetter.charCodeAt(0) <= 90) {
        let sequenceNumber = this.sequenceLetter.indexOf(firstLetter)
        if (sequenceNumber !== -1) {
          // 只有一个字母,输出首字母为该字母的所有城市
          // 否则进行字母配对
          if (this.input.length === 1) {
            // hotCityResult = this.allCity[0].cityList.filter((cityObj) => {
            //   return cityObj.eName.match(nameReg)
            // })
            if (hotCityResult.length) {
              return [
                {
                  flag: '★热门城市',
                  cityList: hotCityResult
                },
                this.allCity[sequenceNumber]
              ]
            } else {
              return [this.allCity[sequenceNumber]]
            }
          } else {
            // let result = []
            // debugger
            /* eslint-disable no-unused-vars */
            // let aa = this.allCity[sequenceNumber]
            let cityList = this.allCity[sequenceNumber].cityList
            cityList = cityList.filter((cityObj) => {
              return cityObj.eName.match(nameReg)
            })
            if (cityList.length) {
              if (hotCityResult.length) {
                return [
                  {
                    flag: '★热门城市',
                    cityList: hotCityResult
                  },
                  {
                    flag: firstLetter.toUpperCase(),
                    cityList
                  }
                ]
              } else {
                return [
                  {
                    flag: firstLetter.toUpperCase(),
                    cityList: cityList
                  }
                ]
              }
            } else {
              // 返回[{}]是为了不报错
              return [{}]
            }
          }
        } else {
          return [{}]
        }
      } else { // 汉字情况
        let result = []
        let nameReg = new RegExp(this.input)
        this.allCity.forEach((cityListObj) => {
          let cityList = cityListObj['cityList'].filter((cityObj) => {
            return cityObj.name.match(nameReg)
          })
          if (cityList.length) {
            result.push({flag: cityListObj['flag'], cityList})
          }
        })
        return result
      }
    },
    infoShowFlag() {
      return !(!this.cityListToShow[0] || !this.cityListToShow[0].flag)
    },
    sequenceLetter() {
      return this.allCity.map((val) => {
        return val.flag.slice(0, 1)
      })
    }
  },
  methods: {
    highlightCity(ev) {
      ev.target.classList.add('active')
    },
    normalizeCity(ev) {
      ev.target.classList.remove('active')
    },
    changeCity(ev) {
      let newCity = ev.target.dataset.cname
      this.$store.commit('changeCity', newCity)
      this.$emit('city-changed')
    },
    clearInput() {
      this.$store.commit('cityInputChanged', '')
    },
    hideLetter() {
      this.letterShowFlag = false
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
    listShowFlag(newVal) {
      if (newVal === false) {
        this.clearInput()
        this._scroll(0)
        this.scrollY = 0
      }
    },
    cityListToShow() {
      let hasResult = !!this.cityListToShow[0]
      if (hasResult) {
        this.fixedFlag = this.cityListToShow[0].flag
        setTimeout(() => {
          this.scroll.refresh()
          this.scrollY = 0
        }, 20)
      }
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
    listNav
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';
.city-list {
  position: fixed;
  top: 50px;
  left: 2%;
  right: 2%;
  bottom: 0;
  box-shadow: 1px -1px 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2);
  overflow: hidden;
  
  .cur-city {
    position: relative;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    z-index: 20;
  }
  .city-flag-fixed {
    position: absolute;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
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
    background-color: #fff;
    overflow: hidden;
    .city-flag {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 200;
      color: gray;
      background-color: #f7f7f7;
    }
    .city-item {
      position: relative;
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      @include border-1px-bottom;
      &.active {
        background-color: rgba(230, 230, 230, 0.5);
      }
    }
  }
  .info {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: #fff;
    z-index: 21;
    .text {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%)
    }
  }
}
</style>
