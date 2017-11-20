<template>
  <modal
    :showFlag="showFlag"
    :hasContent="false"
    :hasCloseIcon="false"
    :hasBtn="false"
    class="non-bgc">
    <div slot="title" class="message-title">
      <span class="icon" v-if="isSpin"><Icon :name="iconName" scale="0.875" spin></Icon></span>
      <span class="icon" v-else><Icon :name="iconName" scale="0.875"></Icon></span>
      <span class="text">{{message}}</span>
    </div>
  </modal>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import Modal from '@@/modal/Modal'
export default {
  props: {
    iconName: {
      type: String,
      default: 'check-circle'
    },
    message: {
      type: String,
      default: '这里是信息'
    },
    isSpin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFlag: true
    }
  },
  created() {
    setTimeout(() => {
      this.showFlag = false
    }, 700)
  },
  components: {
    Icon,
    Modal
  }
}
</script>

<style lang="scss">
.modal-wrapper {
  .modal {
    .modal-title {
      .message-title {
        display: inline-block;
        padding: 5px;
        color: #fff;
        background-color: black;
        .icon {
          vertical-align: middle;
          display: inline-block;
          // height: 14px;
        }
        .text {
          display: inline-block;
          font-size: 14px;
          // vertical-align: top;
        }
      }
      // width: 150px;
      
    }
  }
  
}
</style>
