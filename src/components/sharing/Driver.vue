<template>
  <div class="owner" ref="owner">
    <div class="pic">
      <img src="./cat2-1.jpg" alt="" width="100%">
      <div class="blur"></div>
      <div class="text-wrapper">
        <h2 class="title">轻松月赚1500</h2>
        <span>“出行之前看一眼</span>
        <div>&nbsp;&nbsp;&nbsp;顺路接单很简单”</div>
      </div>
    </div>
    <div class="button">成为顺风猫猫主</div>
  </div>
</template>

<script>

export default {

}
</script>

<style lang="scss">
@import '../../common/scss/var.scss';
.owner {
  transform: translateZ(0);
  .pic {
    position: relative;
    .text-wrapper {
      position: fixed;
      bottom: 90px;
      right: 20px;
      .title {
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 700;
      }
    }
    .blur {
    position: absolute;
    background: white;
    width: 100%;
    height: 30px;
    bottom: -6px;
    filter: blur(4px)
    }
  }    
  .button {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
    height: 30px;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    background-color: $theme-color;
    color: white;
  }
}
</style>
