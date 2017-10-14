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
      <div class="letter" v-show="letterShowFlag">{{currentLetter}}</div>
      <div class="cur-city" @click="showList">当前城市:{{currentCity}}</div>
      <div class="other-city" ref="list">
        <ul v-if="showCityList && showCityList.length > 0">
          <li v-for="cityObject in showCityList" :key="cityObject.flag">
            <div class="city-flag" :id="'cityList'+cityObject.flag">{{cityObject.flag === 'hot'? '★热门城市' : cityObject.flag}}</div>
            <ul>
              <li v-for="city in cityObject.cityList" class="city-item" 
              :key="city.eName" @touchstart="highlightCity($event)" @touchend="cancelHighlight($event)">{{city.name}}</li>
            </ul>
          </li>
        </ul>
        <ul v-if="showCityList && showCityList.length > 0" class="list-map">
          <li v-for="letter in sequenceLetter" class="item" :key="letter"
          @touchstart="showCurrentLetter($event)" @touchend="hideCurrentLetter($event)">{{letter}}</li>
        </ul>
        <div v-else>没有城市！</div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import BScroll from 'better-scroll'
const sequenceLetter = ['Hot', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
export default {
  components: {
    Icon
  },
  // created() {
  //   this.$nextTick(() => {
  //     console.log(this.$refs.list.children)
  //     this.scroll = new BScroll(this.$refs.list, {
  //       click: true
  //     })
  //   })
  // },
  updated() {
    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.list, {
        click: true
      })
      console.log(`upd`)
    }
  },
  // mounted() {
  //   console.log(this.$refs['list'])
  // },
  props: {
    allCity: {
      type: Array
    },
    currentCity: {
      type: String
    }
  },
  methods: {
    showList() {
      this.showFlag = true
      this.$nextTick(() => {
        this.scroll.refresh()
        console.log(this.scroll)
      })
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
    showCurrentLetter(ev) {
      this.currentLetter = ev.target.textContent
      this.letterShowFlag = true
      let id = 'cityList' + ev.target.textContent
      let target = document.getElementById(id)
      this.scroll.scrollToElement(target)
    },
    hideCurrentLetter(ev) {
      this.letterShowFlag = false
    }
  },
  data() {
    return {
      input: '',
      showFlag: false,
      letterShowFlag: false,
      currentLetter: '★',
      sequenceLetter: ['★', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
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
        let sequenceNumber = sequenceLetter.indexOf(firstLetter)
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

      }
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
      .letter {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -25px;
        margin-left: -25px;
        width: 50px;
        height: 50px;
        border-radius: 5px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        background-color: #000;
        z-index: 10;
      }
      .cur-city {
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
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
          background-color: rgba(230, 230, 230, .5);
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
        .list-map {
          position: absolute;
          top: 40px;
          right: 10px;
          .item {
            width: 20px;
            font-size: 14px;
            text-align: center;
            margin-bottom: 2px;
          }
        }
      }
    }
  }
</style>
// A B C D E F G H (I) J K L M N (O) P Q R S T (U) (V) W X Y Z