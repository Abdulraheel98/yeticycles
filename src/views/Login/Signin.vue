<template>
  <LoginBase>
    <div style="width: 100%;">
      <FormHead
        :has-error="!!errorMsg"
        :error-message="errorMsg"
      />
      <validation-observer ref="form">
        <v-form>
          <div class="login-text-input-header">
            Your email
          </div>
          <CustomTextInput
            v-model="email"
            class="mb-2 mt--2"
            type="login"
            placeholder=""
            :required="true"
            :email="true"
            @enter="login(email, password)"
          />
          <div class="login-text-input-header">
            Your password
          </div>
          <CustomTextInput
            v-model="password"
            class="mb-2 mt--2"
            type="password"
            placeholder=""
            :required="true"
            :passmin="8"
            @enter="login(email, password)"
          />
          <v-btn
            id="btn-primary"
            :loading="isLoading"
            dense
            max-height="34px"
            block
            color="primary"
            class="mb-3"
            @click="login(email, password)"
          >
            Log in
          </v-btn>
        </v-form>
      </validation-observer>
      <v-btn
        text
        block
        color="primary"
        @click="$router.push({name: 'PasswordResetRequest'})"
      >
        Forgot password?
      </v-btn>
    </div>
  </LoginBase>
</template>

<script>
import FormHead from "@/views/Login/components/FormHead";
import LoginBase from "@/views/Login/LoginBase";
import CustomTextInput from "@/sharedComponents/CustomTextInput";

export default {
  name: "LoginPage",
  metaInfo: {
    title: 'Login'
  },
  components: {LoginBase, FormHead, CustomTextInput},
  data: () => ({
    password: '',
    email: '',
    isLoading: false,
    errorMsg: null,
  }),
  async created() {
    try {
      await this.$rest.user.get_user_details();
      this.$router.push({ name: "DashboardList" });
    } catch (e) {
      // do nothing
    }
  },
  methods: {
    async validate () {
        return await this.$refs.form.validate()
    },
    reset () {
        this.$refs.form.reset()
    },
    resetValidation () {
        this.$refs.form.resetValidation()
    },
    // eslint-disable-next-line no-unused-vars
    async login(login, pass) {
      try {
        this.errorMsg = null;
        this.isLoading = true
        if (await this.validate()) {
          const resp = (await this.$rest.login.authorize(login, pass)).data

          this.$store.commit('user/updateJwtExpiration', new Date(resp.expire_date))
          await this.$store.dispatch('user/start_logout_check');

          await this.$router.push({name: 'Accounts'})
          this.$notifier.success("Successfully logged in.");
        }
        this.isLoading = false
      } catch (e) {
        console.error(e);
        this.isLoading = false
        this.errorMsg = 'The username or password you provided are invalid';
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.login-text-input-header {
  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #241c15;
}

#btn-primary {
  background-color: #2b84eb !important;
}
</style>

