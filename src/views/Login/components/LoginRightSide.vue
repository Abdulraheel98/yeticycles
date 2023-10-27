<template>
  <v-col style="display: flex" class=" flex-column align-center justify-center login-img-container hidden-sm-and-down">
    <v-img contain width="80%" height="80%"
           eager
           max-height="600px" max-width="80%"
           aspect-ratio="1.8" src="@/assets/LoginPage/login-page-img.png"
    />
    <div>
      <h4 class="primary-text">
        Did you know?
      </h4>
      <h6 class="secondary-text pt-5">
        Pulse Engagement Cloud can increase scripts written by up to 15%
      </h6>
      <div style="display: flex; justify-content: center" class="pt-7 pb-7">
        <div style="width: 50%; border-top: solid 1px rgba(255, 255, 255, 0.67);" />
      </div>
      <h6 class="secondary-text">
        Reach, engage, and understand
      </h6>
    </div>
  </v-col>
</template>

<script>
export default {
name: "LoginRightSide"
}
</script>
