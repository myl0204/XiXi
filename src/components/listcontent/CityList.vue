<template>
  <div class="city-list">
    <div class="cur-city">当前城市:{{curCity}}</div>
    <h2 class="city-flag-fixed" ref="fixedFlag">{{fixedFlag}}</h2>
    <div class="other-city" ref="listWrapper">
      <ul>
        <li v-for="cityObject in cityListToShow" :key="cityObject.flag" ref="list" v-show="cityObject.cityList && cityObject.cityList.length">
          <h2 class="city-flag">{{cityObject.flag}}</h2>
          <ul @touchstart="highlightCity($event)" @touchend="cancelHighlight($event)">
            <li v-for="city in cityObject.cityList" class="city-item" 
            :key="city.eName" :data-cname="city.name" @click="changeCity($event)">{{city.name}}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import Icon from 'vue-awesome/components/Icon'
// import BScroll from 'better-scroll'
// import listNav from '@@/listnav/listNav'
const SUC_CODE = 0
// const FLAG_HEIGHT = 40
export default {
  created() {
    this.$http.get('/api/citylist')
      .then((res) => {
        if (res.status >= 200 && res.status < 300 || res.status === 304) {
          if (res.data.errno === SUC_CODE) {
            this.allCity = res.data.data
          }
        }
      })
  }
}
</script>

<style lang="scss">

</style>
