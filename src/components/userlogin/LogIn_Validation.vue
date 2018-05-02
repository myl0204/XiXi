<template>
  <Modal
    :isVisible="isVisible"
    :hasBtn="false"
    :hasBackArrow="true"
    @click.native="preventBlur"
    @back="goPrevStep"
    @cancel="hide">
    <h2 slot="title">输入验证码</h2>
    <div class="content-validation" slot="content">
      <message :isSpin="true" :message="'登陆中~~~'" :iconName="'spinner'" v-show="messageShowFlag"></message>
      <div class="info" v-show="isCodeWrong">请输入正确的验证码</div>
      <span class="text">验证码已发送至{{currentUser}}</span>
      <div class="count-wrapper" :class="{disabled: !!countDown}">
        <span class="count" v-if="countDown">{{countDown}}s后重发</span>
        <span v-else class="text" @click="resend">重新发送</span>
      </div>
      <div class="code-input">
        <div class="input-wrapper" v-for="(item,index) in total" :key="index">
          <input 
            type="number" 
            :autofocus="index === 0" 
            @input="onInput($event, index)" 
            @focus="highlight" 
            @blur="normalize"
            @click="setIndex($event, index)" 
            ref="inputs">
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@@/modal/Modal'
import Message from '@@/message/Message'
import apiMixin from '../../common/js/api.js'
import { storage } from '@/common/js/util.js'
const INIT_STEP = 0
const PREV_STEP = 1
const CURRENT_STEP = 3
const NEXT_STEP = 4
export default {
  name: 'yanzme',
  mixins: [apiMixin],
  data() {
    return {
      total: [1, 2, 3, 4],
      currentIndex: 0,
      countDown: 60,
      messageShowFlag: false,
      isCodeWrong: false,
      validationCodeArray: []
    }
  },
  created() {
    this.INIT_STEP = INIT_STEP
    this.PREV_STEP = PREV_STEP
    this.CURRENT_STEP = CURRENT_STEP
    this.NEXT_STEP = NEXT_STEP
    this.countZero()
    this.$nextTick(() => {
      this.$refs.inputs[0].focus()
    })
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    isFullFilled() {
      let filledCount = 0
      this.validationCodeArray.forEach((code) => {
        if (code) {
          filledCount++
        }
      })
      return filledCount === 4
    },
    validationCode() {
      return this.validationCodeArray.reduce((prev, cur) => {
        return prev + cur
      })
    }
  },
  methods: {
    setIndex(ev, index) {
      this.currentIndex = index
    },
    // 设置样式、自动聚焦、判断已输入input个数、保存输入内容
    onInput(ev, index) {
      let value = ev.target.value
      // this.currentIndex = index
      value = value.substring(0, 1)
      if (value) {
        ev.target.value = value
        ev.target.parentElement.classList.add('filled')
        this.validationCodeArray.splice(index, 1, value)
        if (index < 3) {
          this.$refs.inputs[++index].focus()
          this.currentIndex = index
        }
      } else {
        this.validationCodeArray.splice(index, 1, '')
        ev.target.parentElement.classList.remove('filled')
        if (index > 0) {
          this.$refs.inputs[--index].focus()
          this.currentIndex = index
        }
      }
    },
    highlight(ev) {
      ev.target.parentElement.classList.add('active')
    },
    normalize(ev) {
      ev.target.parentElement.classList.remove('active')
    },
    preventBlur(ev) {
      const targetInput = this.$refs.inputs[this.currentIndex]
      targetInput ? this.$refs.inputs[this.currentIndex].focus() : ''
    },
    countZero() {
      this.timer = setInterval(() => {
        this.countDown -= 1
      }, 1000)
    },
    resend() {
      this.countDown = 60
      this.countZero()
    }
  },
  watch: {
    isFullFilled(newVal) {
      // 4个input全部填满
      if (newVal) {
        this.messageShowFlag = true
        this.$refs.inputs[this.currentIndex].blur()
        // 这里应该是和后端通信，登录成功
        if (this.validationCode === '6666') {
          // 设置已登陆cookie，设置localstorage
          const maxAge = 60 * 60 * 24 * 7
          storage.setCookie('isLogged', true, maxAge)
          storage.setCookie('uid', this.currentUser, maxAge)
          storage.setLocalStorage(this.currentUser, 'logTime', new Date())
          setTimeout(() => {
            this.goNextStep()
          }, 700)
        } else {
          // 登录失败，重置输入框，显示错误信息
          setTimeout(() => {
            this.messageShowFlag = false
            this.isCodeWrong = true
            this.$refs.inputs.forEach((input) => {
              input.value = ''
            })
            this.currentIndex = 0
            this.$refs.inputs[0].focus()
            this.validationCodeArray = []
          }, 700)
        }
      }
    },
    countDown(newVal) {
      if (newVal === 0) {
        clearInterval(this.timer)
      }
    }
  },
  components: {
    Modal,
    Message
  }
}
</script>

<style lang="scss">
.modal {
  .modal-content {
    .content-validation {
      font-size: 12px;
      .info {
        color: red
      }
      .text {
        color: gray
      }
      .count-wrapper {
        width: 60px;
        padding: 3px 5px;
        margin: 20px auto;
        border: 1px solid #080815;
        border-radius: 3px;
        &.disabled {
          border-color: rgba(8, 8, 31, .3)
        }
        .count {
          color: rgba(0, 0, 0, .5)
        }
        .text {
          color: black
        }
      }
      .code-input {
        display: flex;
        justify-content: center;
        height: 52px;
        .input-wrapper {
          width: 50px;
          height: 50px;
          font-size: 30px;
            &+.input-wrapper {
            margin-left: 5px;
          }
          &.active {
            outline: 1px solid #fc9153
          }
            &.filled {
            outline: 1px solid #fc9153
          }
          input {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
