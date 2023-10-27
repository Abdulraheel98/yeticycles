<template>
  <LoginBase>
    <div>
      <FormHead
        class="pr-14"
        header="New password"
        subheader="Set up a new password for account              "
      />
      <validation-observer ref="form">
        <v-form>
          <div class="login-text-input-header">
            New password
          </div>
          <CustomTextInput
            v-model="password"
            class="mb-2 mt--2"
            type="password"
            placeholder="At least 8 characters"
            :required="true"
            :passmin="8"
            @enter="resetPassword(password, token)"
          />
          <div class="login-text-input-header">
            Confirm password
          </div>
          <CustomTextInput
            v-model="password_confirm"
            class="mb-2 mt--2"
            type="password"
            placeholder="At least 8 characters"
            :required="true"
            :passmin="8"
            :password_to_compare="password"
            @enter="resetPassword(password, token)"
          />
        </v-form>
      </validation-observer>

      <v-btn
        dense
        max-height="34px"
        block
        color="primary"
        class="mb-3"
        @click="resetPassword(password, token)"
      >
        Change password
      </v-btn>
    </div>
  </LoginBase>
</template>

<script>
import FormHead from "@/views/Login/components/FormHead";
import LoginBase from "@/views/Login/LoginBase";
import CustomTextInput from "@/sharedComponents/CustomTextInput";
export default {
  name: "PasswordReset",
  metaInfo: {
    title: 'Password Reset'
  },
  components: { FormHead, LoginBase, CustomTextInput },
  props: {
    token: {
      default: () => '',
      type: String
    }
  },
  data: () => ({
    password_confirm: "",
    password: "",
  }),
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async resetPassword(password, token) {
      try {
        if (await this.validate()) {
          await this.$rest.login.reset_password(password, token);

          // do this to ensure everything is clear so user doesn't log in immediately
          await this.$rest.login.logout();
          localStorage.setItem("authenticated", "false");
          localStorage.removeItem("defaultDashboard");
          this.$store.commit('user/clearLogoutCheck');

          await this.$router.push({name: 'Login'});
          this.$notifier.info("Successfully changed your password.");
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
};
</script>
