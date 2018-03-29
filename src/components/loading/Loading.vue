<template>
  <div class="dot-wrapper" v-show="loadingShowFlag">
    <span class="dot dot-1"></span>
    <span class="dot dot-2"></span>
    <span class="dot dot-3"></span>
  </div>
</template>

<script>
export default {
  props: {
    loadingShowFlag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.dot-wrapper {
  width: 100%;
  height: 100%;
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    &+.dot {
      margin-left: 5px;
    }
    &.dot-1 {
      animation: scale .5s infinite linear
    }
    &.dot-2 {
      animation: scale .5s .1s infinite linear
    }
    &.dot-3 {
      animation: scale .5s .2s infinite linear
    }
  }
}
@keyframes scale {
  0% {
    transform: scale(1.5)
  }
  20% {
    transform: scale(1)
  }
}
</style>
