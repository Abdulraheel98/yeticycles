<template>
  <LoginBase>
    <div>
      <FormHead
        header="Password reset"
        subheader="Use your email to request a password reset"
      />
      <validation-observer ref="form">
        <v-form>
          <div class="login-text-input-header">
            Email
          </div>
          <CustomTextInput
            v-model="email"
            class="mb-2 mt--2"
            type="email"
            placeholder="name@domain.com"
            :required="true"
            :email="true"
            @enter="login(email, password)"
          />

          <v-btn
            dense
            max-height="34px"
            block
            color="primary"
            class="mb-3"
            @click="requestPasswordReset(email)"
          >
            Send a request
          </v-btn>
          <v-btn
            text
            block
            color="primary"
            @click="$router.push({name: 'Login'})"
          >
            Log in
          </v-btn>
        </v-form>
      </validation-observer>
    </div>
  </LoginBase>
</template>

<script>

import FormHead from "@/views/Login/components/FormHead";
import LoginBase from "@/views/Login/LoginBase";
import CustomTextInput from "@/sharedComponents/CustomTextInput";

export default {
  name: "PasswordResetRequest",
  metaInfo: {
    title: 'Password Reset'
  },
    components: {LoginBase, FormHead, CustomTextInput},
    data: () => ({
        valid: true,
        email: '',
    }),
    methods: {
        validate () {
            return this.$refs.form.validate()
        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
        async requestPasswordReset(login){
          try {

            if (await this.validate()){
              await this.$rest.login.request_password_change(login)

              this.$notifier.info("We have sent a password reset link to your email. Check your inbox.");

              await this.$router.push({name: 'Login'})
            }
          } catch (e) {
            console.error(e)
          }
        }
    },
}
</script>
