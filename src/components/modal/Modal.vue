<template>
  <div class="modal-wrapper" v-show="isVisible">
    <div class="modal">
      <div class="modal-icon" v-if="hasIcon">
        <slot name="icon"></slot>
      </div>
      <div class="modal-title">
        <slot name="title"></slot>
      </div>
      <span class="icon-close" v-if="hasCloseIcon" @click.capture.stop="cancelClick"><Icon name="times" scale="0.8"></Icon></span>
      <span class="icon-back" v-if="hasBackArrow" @click="backClick"><Icon name="chevron-left" scale="0.8"></Icon></span>
      <div class="modal-content" v-if="hasContent">
        <slot name="content"></slot>
      </div>
      <div class="modal-btn-group" :class="{'two-btn': hasCancelBtn}" v-if="hasBtn">
        <a href="" v-if="hasCancelBtn" class="modal-btn modal-btn-cancel">{{cancelText}}</a>
        <a href="javascript:" 
          class="modal-btn modal-btn-confirm" 
          :class="{active: confirmIsActive}"
          @click="confirmClick">
          {{confirmText}}
          <loading :isVisible="isLoadingVisible"></loading>
        </a>
      </div>
    </div>
    <div class="modal-mask" v-if="hasMask"></div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import Loading from '@@/loading/Loading'
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    isLoadingVisible: {
      type: Boolean,
      default: false
    },
    hasIcon: {
      type: Boolean,
      default: false
    },
    hasBackArrow: {
      type: Boolean,
      default: false
    },
    hasCloseIcon: {
      type: Boolean,
      default: true
    },
    hasContent: {
      type: Boolean,
      default: true
    },
    hasBtn: {
      type: Boolean,
      default: true
    },
    hasCancelBtn: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    confirmIsActive: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '确认'
    },
    hasMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    backClick() {
      this.$emit('back')
    },
    cancelClick(e) {
      this.$emit('cancel', e)
    },
    confirmClick(e) {
      this.$emit('confirm', e)
    }
  },
  components: {
    Icon,
    Loading
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';
.modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  &.non-bgc {
    .modal {
      background-color: transparent
    }
  }
  .modal {
    // display: flex;
    // flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: #fff;
    z-index: 2;
    .modal-icon {
      margin: 20px 0 16px;
    }
    .icon-close {
      position: absolute;
      padding: 5px;
      top: 0;
      right: 0px;
      color: gray
    }
    .icon-back {
      position: absolute;
      top: 5px;
      left: 5px;
      color: gray
    }
    .modal-title {
      font-size: 18px;
      &:first-child {
        margin-top: 30px;
      }
      &:only-child {
        margin: 0;
      }
      &+.modal-content {
        margin-top: 12px;
      }
    }
    .modal-content {
      margin: 16px 0;
      line-height: 22px;
      font-size: 0;
      overflow: hidden;
    }
    .modal-btn-group {
      font-size: 0;
      overflow: hidden;
      @include border-1px-top;
      &.two-btn {
        .modal-btn {
          float: left;
          width: 50%;
        }
      }
      .modal-btn {
        display: inline-block;
        width: 100%;
        padding: 17px 0;
        font-size: 16px;
        box-sizing: border-box;
      }
      .modal-btn-cancel {
        &+.modal-btn-confirm {
          background-color: #fff
        }
        @include border-1px-right-full
      }
      .modal-btn-confirm {
        color: #fff;
        background-color: rgba(58, 58, 58, .3);
        &.active {
          background-color:  #3a3a3a;
        }
        // .dot-wrapper {
        //   width: 100%;
        //   height: 100%;
        //   .dot {
        //     display: inline-block;
        //     width: 10px;
        //     height: 10px;
        //     border-radius: 50%;
        //     background-color: #fff;
        //     &+.dot {
        //       margin-left: 5px;
        //     }
        //     &.dot-1 {
        //       animation: scale .5s infinite linear
        //     }
        //     &.dot-2 {
        //       animation: scale .5s .1s infinite linear
        //     }
        //     &.dot-3 {
        //       animation: scale .5s .2s infinite linear
        //     }
        //   }
        // }
      }
    }
  }
  .modal-mask {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(230, 230, 230, .5)
  }
}

// @keyframes scale {
//   0% {
//     transform: scale(1.5)
//   }
//   20% {
//     transform: scale(1)
//   }
// }
</style>
