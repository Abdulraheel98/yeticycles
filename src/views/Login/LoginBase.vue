<template>
  <v-row class="login-container pulse-style">
    <v-col
      class="d-flex flex-column align-center justify-space-between login-form-container"
    >
      <div
        style="height: 100%;"
        class="d-flex login-body flex-column justify-space-between column align-start"
      >
        <div class="d-flex flex-row pt-8">
          <img
            class="mr-6"
            src="@/assets/icon.svg"
            height="41px" width="30px"
          >
          <img class="main-pulse" src="@/assets/eng-cloud-black.svg" width="108px">
        </div>
        <slot />
        <LoginFooter />
      </div>
    </v-col>
    <LoginRightSide />
  </v-row>
</template>

<script>
import LoginRightSide from "@/views/Login/components/LoginRightSide";
import LoginFooter from "@/views/Login/components/LoginFooter";

export default {
  name: "LoginBase",
  metaInfo: {
    title: 'Login'
  },
  components: {LoginRightSide, LoginFooter}
}
</script>

<style scoped>
.login-body {
  width: 100%;
}

.login-form-container {
  padding-left: 35px;
}

@media (min-width: 728px) {
  .login-body {
    width: 400px;
  }

  .login-form-container {
    padding-left: inherit;
  }
}
</style>