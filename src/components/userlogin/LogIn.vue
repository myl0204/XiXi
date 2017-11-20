<template>
  <component :is="logStep"></component>
</template>

<script>
import Account from './LogIn_Account'
import Passwd from './LogIn_Passwd'
import Validation from './LogIn_Validation'
import LogInSuc from '@@/message/LogIn_Suc'
import LogOutSuc from '@@/message/Logout_Suc'
export default {
  computed: {
    logStep() {
      let step = this.$store.state.logInStep
      switch (step) {
        case 1: return Account
        case 2: return Passwd
        case 3: return Validation
        case 4: return LogInSuc
        case -1 : return LogOutSuc
      }
    }
  }
}
</script>

<style>

</style>
