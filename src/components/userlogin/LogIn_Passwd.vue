<template>
  <modal 
    :isVisible="isVisible"
    :isLoadingVisible="isLoadingVisible"
    :confirmText="confirmText" 
    :confirmIsActive="confirmIsActive"
    @click.native="preventBlur"
    @confirm="confirm"
    @cancel="hide">
    <h2 slot="title">输入密码</h2>
    <div class="log-content" slot="content">
      <div class="user content">
        <input type="text" :value="currentUser" @click="goPrevStep">
      </div>
      <div class="passwd content">
        <input type="password" placeholder="请输入密码" v-model="input" autofocus="true" ref="input">
      </div>
      <span class="text" @click="stepToValidation">忘记密码？</span>
    </div>
  </modal>
</template>

<script>
import apiMixin from '../../common/js/api.js'
import Modal from '@@/modal/Modal'
import { storage } from '@/common/js/util.js'
const INIT_STEP = 0
const PREV_STEP = 1
const CURRENT_STEP = 2
const VALIDATION_CODE_STEP = 3
const NEXT_STEP = 4
export default {
  mixins: [apiMixin],
  data() {
    return {
      input: '',
      isLoadingVisible: false
    }
  },
  created() {
    this.INIT_STEP = INIT_STEP
    this.PREV_STEP = PREV_STEP
    this.CURRENT_STEP = CURRENT_STEP
    this.VALIDATION_CODE_STEP = VALIDATION_CODE_STEP
    this.NEXT_STEP = NEXT_STEP
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    confirmText() {
      return this.isLoadingVisible ? '' : '登录'
    },
    confirmIsActive() {
      return this.input.length >= 6
    }
  },
  methods: {
    preventBlur(ev) {
      this.$refs.input.focus()
    },
    confirm() {
      if (!this.confirmIsActive) {
        return
      }
      this.isLoadingVisible = true
      // 设置已登陆cookie，设置localstorage
      const maxAge = 60 * 60 * 24 * 7
      storage.setCookie('isLogged', true, maxAge)
      storage.setCookie('uid', this.currentUser, maxAge)
      storage.setLocalStorage(this.currentUser, 'logTime', new Date())
      setTimeout(() => {
        this.goNextStep()
      }, 700)
    },
    stepToValidation() {
      this.$store.commit('changeLogInStepTo', this.VALIDATION_CODE_STEP)
    }
  },
  components: {
    Modal
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';
.modal {
  .modal-content {
    .log-content {
      padding: 0 15%;
      font-size: 16px;
      input {
        width: 150px;
        text-align: center
      }
      .content {
        padding: 3px 0;
        // width: 70%;
        // display: inline-block;
        @include border-1px-bottom;
        &.user {
          margin-bottom: 10px;
        }
      }
      .text {
        font-size: 10px;
      }
    }
  }
}
</style>
