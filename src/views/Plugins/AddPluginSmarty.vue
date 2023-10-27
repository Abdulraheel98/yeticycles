<template>
  <v-container class="mt-5 mb-15 px-10">
    <PageHeader
      :header-text="plugin ? 'Update ' : 'Install' + ' Smarty plugin'"
    >
      <template #subheader>
        The Smarty Plugin allows US locations to be validated and standardized based on USPS validation.<br>
        Fill out the fields below in order to install the Smarty plugin.
      </template>
    </PageHeader>

    <div class="mt-10">
      <validation-observer
        ref="inputRef"
      >
        <div class="mb-3">
          To obtain the Auth ID and Auth Token values below, you must login to your
          <a href="https://www.smarty.com/login">smarty.com</a> account. Go to the API Keys page,
          and generate a new Secret Key to be used by server-side code. Then copy and paste
          the generated values in the corresponding fields below.
        </div>
        <div>
          <CustomTextInput
            v-model="authId"
            header="Auth ID"
            :maxlength="150"
            required
          />
        </div>
        <div>
          <CustomTextInput
            v-model="authToken"
            header="Auth Token"
            :maxlength="150"
            required
          />
        </div>
        <div>
          <CustomDropdown
            v-model="failedValidationProcess"
            header="Failed Validation Process"
            :items="options"
            item-value="value"
            item-text="text"
            required
          />
        </div>
        <div>
          <CustomTextInput
            v-model="licenses"
            header="Licenses"
            :maxlength="600"
          />
        </div>
      </validation-observer>
      <div class="gray-text gray-text--small">
        This should be a comma-separated list of licenses you'd like Pulse to specify to Smarty.
        You can get the license name by looking at the License Value on the Smarty Subscriptions page.
      </div>
      <v-row class="mt-12">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn
            class="custom-button custom-button--blue px-13"
            height="34px"
            depressed
            :block="$vuetify.breakpoint.xsOnly"
            @click="trigger"
          >
            {{ plugin ? 'Update' : 'Install' }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import PageHeader from "@/sharedComponents/PageHeader";
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";

export default {
  name: "AddPluginSmarty",
  components: { CustomDropdown, CustomTextInput, PageHeader },
  props: {
    id: {
      default: () => null,
      type: [Number, String],
    },
    installed: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    options: [
      {
        value: 'reject',
        text: 'Reject Invalid Locations',
      },
      {
        value: 'allow-original-values',
        text: 'Allow Invalid Locations',
      }
    ],
    authId: null,
    authToken: null,
    licenses: null,
    failedValidationProcess: null,
    plugin: null,
  }),
  async created() {
    if (this.installed) {
      await this.loadAccountPlugin();
    }
  },
  methods: {
    async loadAccountPlugin() {
      const response = await this.$rest.plugins.get_resource(this.id, {
        includeCredentials: true,
      });
      if (!response.data) {
        return;
      }

      this.plugin = {...response.data};
      this.authId = this.plugin?.pluginConfiguration?.credentials?.authId;
      this.authToken = this.plugin?.pluginConfiguration?.credentials?.authToken;
      this.licenses = this.plugin?.pluginConfiguration?.credentials?.licenses;
      this.failedValidationProcess = this.plugin?.pluginConfiguration?.credentials?.failedValidationProcess;
    },
    trigger() {
      if (this.plugin) {
        return this.updatePlugin();
      } else {
        return this.installPlugin();
      }
    },
    async updatePlugin() {
      const pluginConfiguration = {
        credentials: {
          authId: this.authId,
          authToken: this.authToken,
          licenses: this.licenses,
          failedValidationProcess: this.failedValidationProcess,
        },
      };

      const response = await this.$rest.plugins.put_resource(this.id, {
        ...this.plugin,
        plugin: this.plugin.plugin.id,
        pluginConfiguration
      });
      if (!response.data) {
        return this.$store.commit('snackbar/showMessage', {
          content: 'Failed to update plugin',
          color: 'error',
        });
      }

      this.$store.commit('snackbar/showMessage', {
        content: 'Plugin updated successfully',
        color: 'info',
      });
    },
    async installPlugin() {
      const pluginConfiguration = {
        credentials: {
          authId: this.authId,
          authToken: this.authToken,
          licenses: this.licenses,
          failedValidationProcess: this.failedValidationProcess,
        },
      };
      const response = await this.$rest.plugins.post_resource({
        plugin: +this.id,
        isActive: true,
        pluginConfiguration,
      });
      if (!response.data) {
        return this.$store.commit('snackbar/showMessage', {
          content: 'Failed to install plugin',
          color: 'error',
        });
      }

      this.$store.commit('snackbar/showMessage', {
        content: 'Installed plugin successfully',
        color: 'info',
      });
    },
  },
}
</script>

<style scoped>

</style>
