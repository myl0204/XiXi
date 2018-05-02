/* eslint-disable no-undef */
export default {
  computed: {
    isVisible() {
      return this.$store.state.logInStep === this.CURRENT_STEP
    }
  },
  methods: {
    hide() {
      this.$store.commit('changeLogInStepTo', this.INIT_STEP)
    },
    goPrevStep() {
      this.$store.commit('changeLogInStepTo', this.PREV_STEP)
    },
    goNextStep() {
      this.$store.commit('changeLogInStepTo', this.NEXT_STEP)
    }
  }
}
