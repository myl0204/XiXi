<template>
  <!-- <div class="modal-login"> -->
    <modal 
      :isVisible="isVisible"
      :isLoadingVisible="isLoadingVisible"
      :confirmText="confirmText" 
      :confirmIsActive="confirmIsActive"
      @confirm="confirm"
      @cancel="hide"
      @click.native="preventBlur">
      <h2 slot="title">登录</h2>
      <div class="phone-content" slot="content">
        <span class="text">+86 ></span>
        <input type="tel" maxlength="11" v-model="input" @input="numberOnly" autofocus="true" ref="input">
      </div>
    </modal>
  <!-- </div> -->
</template>

<script>
import Modal from '@@/modal/Modal'
import apiMixin from '../../common/js/api.js'
import { storage } from '@/common/js/util.js'
/* eslint-disable no-unused-vars */
const INIT_STEP = 0
const CURRENT_STEP = 1
const NEXT_STEP = 2
const VALIDATION_CODE_STEP = 3
export default {
  mixins: [apiMixin],
  data() {
    return {
      input: '',
      isLoadingVisible: false
    }
  },
  created() {
    this.input = this.$store.state.currentUser
    this.INIT_STEP = INIT_STEP
    this.CURRENT_STEP = CURRENT_STEP
    this.NEXT_STEP = NEXT_STEP
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  },
  computed: {
    confirmText() {
      return this.isLoadingVisible ? '' : '下一步'
    },
    confirmIsActive() {
      return this.input.length === 11
    }
  },
  methods: {
    numberOnly() {
      this.input = this.input.replace(/\D/g, '')
    },
    confirm() {
      if (!this.confirmIsActive) {
        return
      }
      this.isLoadingVisible = true
      // 若是第一次登录，采用验证码登录。
      const hadLogged = storage.hadLogged(this.input)
      if (!hadLogged) {
        this.NEXT_STEP = VALIDATION_CODE_STEP
      }
      setTimeout(() => {
        this.goNextStep()
        this.$store.commit('changeUser', this.input)
      }, 1000)
    },
    preventBlur(ev) {
      this.$refs.input.focus()
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
  .phone-content {
    display: inline-block;
    padding: 0 15px;
    font-size: 14px;
    @include border-1px-bottom(rgba(0, 0, 0, .8));
    input {
      width: 100px;
      height: 100%;
    }
  }
  // .modal-btn-group {
  //   .modal-btn-confirm {
  //     color: #fff;
  //   }
  // }
}
</style>
