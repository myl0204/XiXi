<template>
  <div class="city-selector">
    <div class="city-input">
      <input type="text" placeholder="城市中文名或拼音" v-model="inputCity">
      <span class="cancel">取消</span>
    </div>
    <div class="city-list">
      <div class="cur-city" @click="showcity">当前城市:{{this.inputCity}}</div>
      <div class="other-city">
        <ul v-if="showCityList.length>0">
          <li v-for="cityObject in showCityList">
            <div>{{cityObject.flag}}</div>
            <ul>
              <li v-for="city in cityObject.cityList">{{city.name}}</li>
            </ul>
          </li>
        </ul>
        <div v-else>没有城市！</div>
      </div>
    </div>
  </div>
</template>

<script>
const hotCity = {
  flag: 'hot',
  cityList: [
    {
      name: '北京',
      eName: 'beijing'
    },
    {
      name: '上海',
      eName: 'shanghai'
    }
  ]
}
const aCity = {
  flag: 'A',
  cityList: [
    {
      name: '鞍山市',
      eName: 'anshan'
    },
    {
      name: '安庆',
      eName: 'anqing'
    },
    {
      name: '安阳市',
      eName: 'anyang'
    },
    {
      name: '阿拉善盟',
      eName: 'alashanmeng'
    },
    {
      name: '安顺市',
      eName: 'anshun'
    }
  ]
}
const bCity = {
  flag: 'B',
  cityList: [
    {
      name: '宝山',
      eName: 'baoshan'
    },
    {
      name: '宝哥',
      eName: 'baoge'
    },
    {
      name: '北京',
      eName: 'beijing'
    }
  ]
}
const allCity = [hotCity, aCity, bCity]
export default {
  created() {
    /* eslint-disable no-undef */
    // this.currentCity = _DEFAULT_CITY.name
    // console.log(_DEFAULT_CITY.name)
  },
  methods: {
    showcity() {
      console.log(this.showCityList)
    }
  },
  data() {
    return {
      allCity,
      inputCity: ''
    }
  },
  computed: {
    showCityList() {
      let firstLetter = this.inputCity.slice(0, 1)
      let sequenceNumber = firstLetter.toUpperCase().codePointAt(0)
      if (!this.inputCity) {
        return this.allCity
      }
      // 当输入为字母时的情况
      // 将a-z对应到数字1-23
      if (sequenceNumber >= 65 && sequenceNumber <= 90) {
        sequenceNumber -= 64
        if (sequenceNumber > 9 && sequenceNumber < 21) {
          sequenceNumber -= 1
        } else if (sequenceNumber > 20) {
          sequenceNumber -= 3
        }
        // 只有一个字母,输出首字母为该字母的所有城市
        // 否则进行字母配对
        if (this.inputCity.length === 1) {
          console.log(`only 1`)
          return [this.allCity[sequenceNumber]]
        } else {
          let result = []
          let nameReg = new RegExp(this.inputCity, 'i')
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
      }
    }
  }
}
</script>

<style lang="scss">

</style>
// A B C D E F G H (I) J K L M N O P Q R S T (U) (V) W X Y Z