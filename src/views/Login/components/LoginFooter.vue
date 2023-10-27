<template>
  <div class="login-footer">
    <span>© Copyright 2015-{{ currentYear }} Pulse Health - All Rights Reserved</span>
  </div>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    currentYear() {
      return (new Date()).getFullYear();
    },
  },
}
</script>

<style scoped>
.login-footer {
  width: 100%;
}

@media (max-width: 727px) {
  .login-footer {
    text-align: center;
  }
}
</style>

