<template>
  <div class="login-logo pb-10">
    <h1 class="pb-3">
      {{ header }}
    </h1>
    <h6
      :class="[hasError ? 'error-msg' : '']"
    >
      {{ hasError ? errorMessage : subheader }}
    </h6>
  </div>
</template>

<script>
export default {
  name: "FormHead",
  props: {
    header: {
      default: () => 'Login',
      type: String
    },
    subheader: {
      default: () => 'Use your credentials to log in or sign up below',
      type: String
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 'The username or password you provided are invalid',
    },
  }
}
</script>

<style scoped>
.error-msg {
  color: #dc2929 !important;
}
</style>