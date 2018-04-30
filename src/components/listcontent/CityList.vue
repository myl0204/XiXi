<template>
  <div class="city-list">
    <div class="cur-city">当前城市:{{ipCity}}</div>
    <h2 class="city-flag-fixed" ref="fixedFlag">{{fixedFlag}}</h2>
    <div class="other-city" ref="listWrapper">
      <ul>
        <li
          v-for="cityObject in filteredCityList"
          :key="cityObject.flag"
          ref="list">
          <h2 class="city-flag">{{cityObject.flag}}</h2>
          <ul
            @touchstart="highlightCity($event)"
            @touchend="normalizeCity($event)">
            <li
              v-for="city in cityObject.cityList"
              class="city-item" 
              :key="city.eName"
              :data-cname="city.name"
              @click="changeCity($event)">{{city.name}}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="info" v-show="!isInfoVisible">
      <p class="text">暂无结果，换个词试试吧！</p>
    </div>
    <list-nav  
      :navLetterList="navLetterList"
      @listNavTouchstart="_scroll"
      @listNavTouchmove="_scroll">
    </list-nav>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import listNav from '@@/listnav/listNav'
import { mapState, mapMutations } from 'vuex'
const FLAG_HEIGHT = 40
export default {
  props: {
    allCity: {
      type: Array,
      default() {
        return [{}]
      }
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
    this.$nextTick(() => {
      this._calculateHeight()
    })
  },
  data() {
    return {
      scrollY: -1,
      fixedFlag: '★热门城市',
      listHeight: []
    }
  },
  computed: {
    ...mapState([
      'ipCity',
      'isListVisible',
      'cityInput'
    ]),
    filteredCityList() {
      if (!this.cityInput) {
        return this.allCity
      }
      const firstLetter = this.cityInput.slice(0, 1).toUpperCase()
      const nameReg = new RegExp('^' + this.cityInput, 'i')
      // 在热门城市中的检索结果
      const hotCityResult = this.allCity[0].cityList.filter((city) => {
        return city.eName.match(nameReg)
      })
      // 当输入为字母时的情况
      if (firstLetter.charCodeAt(0) >= 65 && firstLetter.charCodeAt(0) <= 90) {
        const index = this.navLetterList.indexOf(firstLetter)
        if (index !== -1) {
          const cityListObj = this.cityInput.length === 1
            ? this.allCity[index]
            : {
              flag: firstLetter.toUpperCase(),
              cityList: this.allCity[index].cityList.filter(city => city.eName.match(nameReg))
            }
          return hotCityResult.length
            ? [
              {
                flag: '★热门城市',
                cityList: hotCityResult
              },
              cityListObj
            ]
            : [cityListObj]
        } else {
          return [{}]
        }
      } else { // 汉字情况
        const result = []
        const nameReg = new RegExp(this.cityInput)
        this.allCity.forEach((cityListObj) => {
          const cityList = cityListObj['cityList'].filter((city) => {
            return city.name.match(nameReg)
          })
          if (cityList.length) {
            result.push({flag: cityListObj['flag'], cityList})
          }
        })
        return result
      }
    },
    isInfoVisible() {
      return !(!this.filteredCityList[0] || !this.filteredCityList[0].flag)
    },
    navLetterList() {
      return this.allCity.map((val) => {
        return val.flag.slice(0, 1)
      })
    }
  },
  methods: {
    ...mapMutations([
      'updateCity',
      'updateCityInput'
    ]),
    highlightCity(ev) {
      ev.target.classList.add('active')
    },
    normalizeCity(ev) {
      ev.target.classList.remove('active')
    },
    changeCity(ev) {
      const newCity = ev.target.dataset.cname
      this.updateCity(newCity)
      this.$emit('city-changed')
    },
    clearInput() {
      this.updateCityInput('')
    },
    _scroll(index) {
      this.scroll.scrollToElement(this.$refs.list[index])
      this.scrollY = this.scroll.y
    },
    _calculateHeight() {
      const list = this.$refs.list
      let height = 0
      this.listHeight = [0]
      list.forEach(listItem => {
        height += listItem.clientHeight
        this.listHeight.push(height)
      })
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
    filteredCityList() {
      const hasResult = !!this.filteredCityList[0]
      if (hasResult) {
        this.fixedFlag = this.filteredCityList[0].flag
        setTimeout(() => {
          this.scroll.refresh()
          this.scrollY = 0
        }, 20)
      }
    },
    scrollY(newVal) {
      this.listHeight.reduce((h1, h2, index) => {
        if (-newVal >= h1 && -newVal < h2) {
          const flag = this.navLetterList[index - 1]
          this.fixedFlag = flag === '★' ? '★热门城市' : flag
          const diff = h2 + newVal
          const fixedFlagTop = diff < FLAG_HEIGHT ? diff - FLAG_HEIGHT : 0
          this.$refs.fixedFlag.style.transform = `translateY(${fixedFlagTop}px)`
        }
        return h2
      }, this.listHeight[0])
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
