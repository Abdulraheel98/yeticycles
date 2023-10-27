<template>
  <v-container class="mt-5 mb-15 px-10">
    <PageHeader header-text="Install Automated Export plugin">
      <template #subheader>
        Please configure the following in order to install the Automated Export plugin.
      </template>
    </PageHeader>

    <div class="mt-8">
      <v-btn
        class="custom-button custom-button--blue px-13"
        height="34px"
        depressed
        :block="$vuetify.breakpoint.xsOnly"
        @click="addConfiguration"
      >
        Add Configuration
      </v-btn>
    </div>

    <div v-for="(form, index) in configurations" :key="index" class="mt-4">
      <v-expansion-panels v-model="form.isShowing">
        <v-expansion-panel>
          <v-expansion-panel-header v-if="form.name">
            {{ form.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-header v-else>
            Configuration #{{ index + 1 }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <AutomatedExportForm
              :form="form"
              :export-type-options="exportTypeOptions"
              :contact-export-choice-options="contactExportChoiceOptions"
              :segment-options="segmentOptions"
              :action-export-contact-choice-options="actionExportContactChoiceOptions"
              :action-export-code-choice-options="actionExportCodeChoiceOptions"
              :action-code-options="actionCodeOptions"
              @remove-configuration="removeConfiguration(index)"
              @update-value="(key, value) => updateValue(index, key, value)"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-row class="mt-12">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          class="custom-button custom-button--blue px-13"
          height="34px"
          depressed
          :block="$vuetify.breakpoint.xsOnly"
          :disabled="configurations.length <= 0"
          @click="installPlugin"
        >
          {{ installed ? "Configure" : "Install" }}
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="delete_dialog" max-width="360px" @click:outside="delete_item_id = null">
      <DeleteConfirmationDialog
        v-if="delete_dialog"
        header="Delete configuration"
        subheader="Are you sure you want to delete this configuration? All unsaved changes will be removed."
        @dismiss="
          delete_dialog = false;
          delete_id = null;
        "
        @delete="deleteConfig"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeader from "@/sharedComponents/PageHeader";
import AutomatedExportForm from "@/views/Plugins/components/AutomatedExportForm";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";
import DeleteConfirmationDialog from "@/sharedComponents/DeleteConfirmationDialog";

export default {
  name: "AddPluginAutomatedExport",
  components: {
    AutomatedExportForm,
    PageHeader,
    DeleteConfirmationDialog,
  },
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
    delete_dialog: null,
    delete_id: null,
    exportTypeOptions: [
      {
        id: 'contact',
        text: 'Contact Export',
      },
      {
        id: 'email_action',
        text: 'Email Action Export',
      },
      {
        id: 'banner_action',
        text: 'Banner Action Export',
      },
      {
        id: 'event_action',
        text: 'Event Action Export',
      },
      {
        id: 'direct_mail_action',
        text: 'Direct Mail Action Export',
      },
    ],
    contactExportChoiceOptions: [
      {
        id: 'all',
        text: 'All Contacts',
      },
      {
        id: 'segment',
        text: 'Specific Segment',
      },
    ],
    segmentOptions: [],
    actionExportContactChoiceOptions: [
      {
        id: 'all',
        text: 'All Contacts',
      },
      {
        id: 'segment',
        text: 'Specific Segment',
      },
    ],
    actionExportCodeChoiceOptions: [
      {
        id: 'all',
        text: 'All Actions',
      },
      {
        id: 'specific_action_codes',
        text: 'Specific Action Codes',
      },
    ],
    actionCodeOptions: [],
    configurations: [],
  }),
  async created() {
    await this.loadActionCodes();
    await this.loadSegment();

    if (this.installed) {
      await this.loadAccountPlugin();
    }
  },
  methods: {
    async loadAccountPlugin() {
      const resp = await this.$rest.plugins.get_resource(this.id, {
        includeCredentials: true,
      });
      if (!resp.data || !resp.data.pluginConfiguration?.configurations) {
        return;
      }

      const credentials = resp.data.pluginConfiguration?.credentials;
      const configurations = resp.data.pluginConfiguration?.configurations.map(config => {
        const configCredentials = credentials[config.key] ?? null;

        if(config?.frequency?.time) {
          const [hour, minute] = config.frequency.time.split(":");
          if (hour >= 12) {
            config.frequency.ampm = "PM"
            config.frequency.hour = +hour > 12 ? +hour - 12 : 12;
          }
          else {
            config.frequency.ampm = "AM"
            config.frequency.hour = +hour;
          }
          config.frequency.minute = minute;
        }

        return {
          ...config,
          credentials: configCredentials,
        };
      });
      configurations.forEach(config => {
        this.addConfiguration(config);
      });
    },
    async loadActionCodes() {
      const resp = await this.$rest.action_codes.getCollection({
        fields: ['id', 'name', 'tacticId'],
        ignorePagination: true,
      });
      if (!resp.data) {
        return;
      }

      this.actionCodeOptions = resp.data;
    },
    async loadSegment() {
      const response = await this.$rest.segment.get_collection({
        ignorePagination: true,
        sort: ['name:asc'],
      });

      if (!response.data) {
        return;
      }

      response.data.items.forEach(item => {
        this.segmentOptions.push({
          id: item.id,
          text: item.isArchived ? item.name + ' [Archived]': item.name,
        });
      });
    },
    addConfiguration(existingConfig) {
      this.configurations.push({
        connectionType: existingConfig?.connectionType || null,
        directory: existingConfig?.directory || '/',
        credential: {
          host: existingConfig?.credentials?.host || null,
          username: existingConfig?.credentials?.username || null,
          password: existingConfig?.credentials?.password || null,
          port: existingConfig?.credentials?.port || null,
          privateKey: existingConfig?.credentials?.privateKey || null,
          aws_region: existingConfig?.credentials?.aws_region || null,
          aws_access_id: existingConfig?.credentials?.aws_access_id || null,
          aws_secret_key: existingConfig?.credentials?.aws_secret_key || null,
          aws_bucket: existingConfig?.credentials?.aws_bucket || null,
        },
        frequency: existingConfig?.frequency || {
          type: null,
          ampm: 'AM',
          hour: 1,
          minute: '00',
          timezone: 'America/New_York',
          date: [],
        },
        exportType: existingConfig?.exportType || null,
        exportOptions: existingConfig?.exportOptions || { choice: null },
        name: existingConfig?.name || '',
        notificationRecipients: existingConfig?.notificationRecipients || '',
        key: existingConfig?.key || uuidv4(),
        isShowing: false,
      });
    },
    removeConfiguration(index) {
      this.delete_dialog = true;
      this.delete_id = index;
    },
    async deleteConfig() {
      if (this.installed) {
        const pluginConfiguration = {
          configurations: [],
          credentials: {},
        };

        let modifiedConfigurations = this.configurations.slice();
        modifiedConfigurations.splice(this.delete_id, 1);
        for (const config of modifiedConfigurations) {
          const { credential, ...configuration } = cloneDeep(config);

          if (configuration.frequency.ampm) {
            const hour =
              configuration.frequency.ampm === 'PM'
                ? configuration.frequency.hour + 12
                : configuration.frequency.hour;
            configuration.frequency.time = `${hour.toString().padStart(2, '0')}:${
              configuration.frequency.minute
            }:00`;
          }

          // remove extra properties
          delete configuration.frequency.hour;
          delete configuration.frequency.minute;
          delete configuration.frequency.ampm;

          if (configuration.frequency.type === 'daily') {
            delete configuration.frequency.day;
          }

          if (configuration.connectionType === 'FTP' || configuration.connectionType === 'SFTP') {
            delete credential.privateKey;
            delete credential.aws_region;
            delete credential.aws_access_id;
            delete credential.aws_secret_key;
            delete credential.aws_bucket;
          } else if (configuration.connectionType === 'SFTP_WITH_KEY') {
            delete credential.password;
            delete credential.aws_region;
            delete credential.aws_access_id;
            delete credential.aws_secret_key;
            delete credential.aws_bucket;
          } else if (configuration.connectionType === 'AMAZON_S3') {
            delete credential.username;
            delete credential.password;
            delete credential.port;
            delete credential.host;
            delete credential.privateKey;
          }

          delete configuration.isShowing;
          pluginConfiguration.configurations.push(configuration);
          pluginConfiguration.credentials[configuration.key] = credential;
        }

        await this.$rest.plugins
          .put_resource(this.id, {
            isActive: true,
            pluginConfiguration,
          })
          .then(() => {
            this.configurations.splice(this.delete_id, 1);
            this.$store.commit('snackbar/showMessage', {
              content: 'Configuration deleted',
              color: 'success',
            });
          })
          .catch(() => {
            this.$store.commit('snackbar/showMessage', {
              content: 'Failed when trying to configure plugin',
              color: 'error',
            });
          });
      } else this.configurations.splice(this.delete_id, 1);
      this.delete_dialog = null;
      this.delete_id = null;
    },
    updateValue(index, key, value) {
      const configuration = this.configurations[index];

      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');

        configuration[parentKey][childKey] = value;
        const update = {};
        update[childKey] = value;
        this.$set(configuration, parentKey, {
          ...configuration[parentKey],
          ...update
        });
      } else {
        configuration[key] = value;
        this.$set(configuration, key, value);
      }
    },
    async installPlugin() {
      const pluginConfiguration = {
        configurations: [],
        credentials: {},
      };

      for (const config of this.configurations) {
        const { credential, ...configuration } = cloneDeep(config);

        if (configuration.frequency.ampm) {
          const hour =
            configuration.frequency.ampm === 'PM'
              ? configuration.frequency.hour + 12
              : configuration.frequency.hour;
          configuration.frequency.time = `${hour.toString().padStart(2, '0')}:${
            configuration.frequency.minute
          }:00`;
        }

        // remove extra properties
        delete configuration.frequency.hour;
        delete configuration.frequency.minute;
        delete configuration.frequency.ampm;

        if (configuration.frequency.type === 'monthly') {
          configuration.frequency.day = configuration.frequency.date.map(date => new Date(date).getDate())
        }
        if (configuration.frequency.type === 'daily') {
          delete configuration.frequency.day;
        }

        if (configuration.connectionType === 'FTP'
          || configuration.connectionType === 'FTPS'
          || configuration.connectionType === 'SFTP'
        ) {
          delete credential.privateKey;
          delete credential.aws_region;
          delete credential.aws_access_id;
          delete credential.aws_secret_key;
          delete credential.aws_bucket;
        } else if (configuration.connectionType === 'SFTP_WITH_KEY') {
          delete credential.password;
          delete credential.aws_region;
          delete credential.aws_access_id;
          delete credential.aws_secret_key;
          delete credential.aws_bucket;
        } else if (configuration.connectionType === 'AMAZON_S3') {
          delete credential.username;
          delete credential.password;
          delete credential.port;
          delete credential.host;
          delete credential.privateKey;
        }

        delete configuration.isShowing;
        pluginConfiguration.configurations.push(configuration);
        pluginConfiguration.credentials[configuration.key] = credential;
      }

      let response = null;
      if (this.installed) {
        response = await this.$rest.plugins
          .put_resource(this.id, {
            isActive: true,
            pluginConfiguration,
          })
          .catch(error => {
            let error_message = null;
            let errors_list = "";
            if (error.response?.data?.errors?.length) {
              error.response.data.errors.forEach(item => {
                errors_list += (item.error + "\r \n");
              });
              error_message = errors_list;
            } else if (error.response?.data?.message) {
              error_message = error.response?.data?.message;
            }

            this.$store.commit('snackbar/showMessage', {
              content: error_message || 'Failed when trying to configure plugin',
              color: 'error',
            });
          });
      } else {
        response = await this.$rest.plugins
          .post_resource({
            plugin: +this.id,
            isActive: true,
            pluginConfiguration,
          })
          .catch(() => {
            this.$store.commit('snackbar/showMessage', {
              content: 'Failed when trying to install plugin',
              color: 'error',
            });
          });
      }

      if (!response?.data) {
        return;
      }

      this.$store.commit('snackbar/showMessage', {
        content: this.installed
          ? 'Plugin configured successfully'
          : 'Plugin installed successfully',
        color: 'success',
      });

      await this.$router.push({ name: 'Plugins' });
    },
  },
};
</script>

<style scoped></style>
