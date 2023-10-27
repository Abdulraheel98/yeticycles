<template>
  <div class="mt-4">
    <validation-observer ref="inputRef">
      <div>
        <CustomTextInput
          :value="form.name"
          header="Name"
          required
          @input="val => $emit('update-value', 'name', val)"
        />
      </div>

      <div>
        <CustomDropdown
          :value="form.connectionType"
          :items="connectionTypes"
          header="Connection Type"
          item-value="id"
          item-text="text"
          required
          @input="val => $emit('update-value', 'connectionType', val)"
        />
      </div>

      <div v-if="canConfigureSettings">
        <div v-if="canSeeNormalSettings">
          <CustomTextInput
            :value="form.credential.host"
            header="Host"
            required
            @input="val => $emit('update-value', 'credential.host', val)"
          />
          <CustomTextInput
            :value="form.credential.port"
            header="Port"
            required
            @input="val => $emit('update-value', 'credential.port', val)"
          />
          <CustomTextInput
            :value="form.credential.username"
            header="Username"
            required
            @input="val => $emit('update-value', 'credential.username', val)"
          />
          <CustomTextInput
            type="password"
            :value="form.credential.password"
            header="Password"
            required
            @input="val => $emit('update-value', 'credential.password', val)"
          />
        </div>
        <div v-if="canSeeSshKeySetting">
          <CustomFileUpload
            :value="form.credential.privateKey"
            placeholder="SSH Key"
            required
            @input="val => $emit('update-value', 'credential.privateKey', val)"
          />
        </div>
        <div v-if="canSeeAwsSettings">
          <CustomDropdown
            :value="form.credential.aws_region"
            :items="awsRegions"
            header="Region"
            item-value="id"
            item-text="text"
            required
            @input="val => $emit('update-value', 'credential.aws_region', val)"
          />
          <CustomTextInput
            :value="form.credential.aws_access_id"
            header="AWS Access ID"
            required
            @input="val => $emit('update-value', 'credential.aws_access_id', val)"
          />
          <CustomTextInput
            type="password"
            :value="form.credential.aws_secret_key"
            header="AWS Secret Key"
            required
            @input="val => $emit('update-value', 'credential.aws_secret_key', val)"
          />
          <CustomTextInput
            :value="form.credential.aws_bucket"
            header="S3 Bucket Name"
            required
            @input="val => $emit('update-value', 'credential.aws_bucket', val)"
          />
        </div>
      </div>
      <div v-if="form.connectionType">
        <v-btn
          height="34px"
          class="elevation-0 custom-button my-6"
          @click="testConnection"
        >
          Test Connection {{ isConnectionValid ? ' - Successful!' : '' }}
        </v-btn>
      </div>
      <div>
        <CustomTextInput
          :value="form.directory"
          header="Filesystem Directory"
          required
          @input="val => $emit('update-value', 'directory', val)"
        />
      </div>
      <slot name="extra-filesystem-details" />
      <div>
        <CustomDropdown
          :value="form.frequency.type"
          :items="frequencyOptions"
          header="Frequency"
          item-value="id"
          item-text="text"
          required
          @input="val => $emit('update-value', 'frequency.type', val)"
        />
      </div>
      <div v-if="form.frequency.type === 'monthly'">
        <v-calendar
          :events="events"
          :event-height="1"
          :now="new Date().toISOString().split('T')[0]"
          event-color="transparent"
          class="mb-3"
        >
          <template #day-label="{day,date}">
            <v-btn
              fab
              small 
              depressed 
              color="transparent" 
              :class="{primary: isEvent(date)}"
              @click="$emit('update-value', 'frequency.date', getDateArrayMonthly(date))"
            >
              {{ day }}
            </v-btn>
          </template>
        </v-calendar>
      </div>
      <div v-if="form.frequency.type === 'weekly'">
        <div
          v-for="day in ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']"
          :key="day"
          class="d-inline-block"
        >
          <v-checkbox
            v-model="weeklyFrequencyDays"
            :value="day"
            :label="day"
            :disabled="weeklyFrequencyDays.length === 6 && !weeklyFrequencyDays.includes(day)"
            class="mr-2"
            required
            @change="handleFrequencyWeekDaysChange"
          />
        </div>
      </div>
      <div class="d-flex">
        <CustomDropdown
          :items="hourOptions"
          header="Hour"
          class="flex-grow-1"
          item-value="id"
          item-text="text"
          :value="time.hour"
          required
          @input="val => $emit('update-value', 'frequency.hour', val)"
        />
        <CustomDropdown
          :items="minuteOptions"
          header="Minutes"
          class="ml-2 flex-grow-1"
          item-value="id"
          item-text="text"
          :value="time.minute"
          required
          @input="val => $emit('update-value', 'frequency.minute', val)"
        />
        <CustomDropdown
          :items="amPmOptions"
          header="AM/PM"
          class="ml-2 flex-grow-1"
          item-value="id"
          item-text="text"
          :value="form.frequency.ampm"
          required
          @input="val => $emit('update-value', 'frequency.ampm', val)"
        />
        <TimezoneDropdown 
          class="ml-2 timezone-dropbox"
          :value="form.frequency.timezone || 'America/New_York'"
          required
          @change="$emit('update-value', 'frequency.timezone', $event)"
        />
      </div>
      <div>
        <CustomTextInput
          class="mb-3"
          :value="form.notificationRecipients"
          header="Notification Recipients"
          hint="A comma separated list of email addresses that should receive a notification once the process completes."
          @input="val => $emit('update-value', 'notificationRecipients', val)"
        />
      </div>
      <slot name="plugin-options" />
    </validation-observer>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          class="custom-button custom-button--red px-13"
          height="34px"
          depressed
          :block="$vuetify.breakpoint.xsOnly"
          @click="$emit('remove-configuration')"
        >
          Delete
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import CustomFileUpload from "@/sharedComponents/CustomFileUpload";
import TimezoneDropdown from "@/sharedComponents/TimezoneDropdown";

export default {
  name: "AutomatedPluginForm",
  components: { 
    CustomFileUpload,
    CustomDropdown,
    CustomTextInput,
    TimezoneDropdown,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isConnectionValid: false,
      weeklyFrequencyDays: [],
      connectionTypes: [
        { id: 'FTP', text: 'FTP' },
        { id: 'FTPS', text: 'FTPS' },
        { id: 'SFTP', text: 'SFTP' },
        { id: 'SFTP_WITH_KEY', text: 'SFTP w/ SSH Key' },
        { id: 'AMAZON_S3', text: 'Amazon S3' },
        { id: 'SHAREFILE', text: 'Pulse Health Sharefile' },
      ],
      // https://docs.aws.amazon.com/general/latest/gr/s3.html
      // filtered out the GOV items
      awsRegions: [
        { id: 'us-east-2', text: 'us-east-2 (Ohio)' },
        { id: 'us-east-1', text: 'us-east-1 (N. Virginia)' },
        { id: 'us-west-1', text: 'us-west-1 (N. California)' },
        { id: 'us-west-2', text: 'us-west-2 (Oregon)' },
        { id: 'af-south-1', text: 'af-south-1 (Cape Town)' },
        { id: 'ap-east-1', text: 'ap-east-1 (Hong Kong)' },
        { id: 'ap-south-1', text: 'ap-south-1 (Mumbai)' },
        { id: 'ap-northeast-3', text: 'ap-northeast-3 (Osaka)' },
        { id: 'ap-northeast-2', text: 'ap-northeast-2 (Seoul)' },
        { id: 'ap-southeast-1', text: 'ap-southeast-1 (Singapore)' },
        { id: 'ap-southeast-2', text: 'ap-southeast-2 (Sydney)' },
        { id: 'ap-northeast-1', text: 'ap-northeast-1 (Tokyo)' },
        { id: 'ca-central-1', text: 'ca-central-1 (Canada)' },
        { id: 'cn-north-1', text: 'cn-north-1 (Beijing)' },
        { id: 'cn-northwest-1', text: 'cn-northwest-1 (Ningxia)' },
        { id: 'eu-central-1', text: 'eu-central-1 (Frankfurt)' },
        { id: 'eu-west-1', text: 'eu-west-1 (Ireland)' },
        { id: 'eu-west-2', text: 'eu-west-2 (London)' },
        { id: 'eu-south-1', text: 'eu-south-1 (Milan)' },
        { id: 'eu-west-3', text: 'eu-west-3 (Paris)' },
        { id: 'sa-east-1', text: 'sa-east-1 (São Paulo)' },
        { id: 'me-south-1', text: 'me-south-1 (Bahrain)' },
      ],
      frequencyOptions: [
        { id: 'monthly', text: 'Specific Day(s) of Month' },
        { id: 'weekly', text: 'Specific Day(s) of Week' },
        { id: 'daily', text: 'Daily' },
      ],
      hourOptions: [
        { id: 1, text: 1 },
        { id: 2, text: 2 },
        { id: 3, text: 3 },
        { id: 4, text: 4 },
        { id: 5, text: 5 },
        { id: 6, text: 6 },
        { id: 7, text: 7 },
        { id: 8, text: 8 },
        { id: 9, text: 9 },
        { id: 10, text: 10 },
        { id: 11, text: 11 },
        { id: 12, text: 12 },
      ],
      minuteOptions: [
        { id: '00', text: '00' },
        { id: '15', text: '15' },
        { id: '30', text: '30' },
        { id: '45', text: '45' },
      ],
      amPmOptions: [
        { id: 'AM', text: 'AM' },
        { id: 'PM', text: 'PM' },
      ],
    }
  },
  computed: {
    time() {
      if (!this.form?.frequency?.time) return { hour: 1, minute: '00' };

      let [hour, minute] = this.form.frequency.time.split(':');

      hour = +hour;
      if (hour > 12) hour -= 12;

      return {
        hour,
        minute,
      };
    },
    canSeeNormalSettings() {
      return ['FTP', 'FTPS', 'SFTP', 'SFTP_WITH_KEY'].includes(this.form.connectionType);
    },
    canSeeSshKeySetting() {
      return this.form.connectionType === 'SFTP_WITH_KEY';
    },
    canSeeAwsSettings() {
      return this.form.connectionType === 'AMAZON_S3';
    },
    canConfigureSettings() {
      return !['SHAREFILE'].includes(this.form.connectionType);
    },
    events() {
      return this.form?.frequency?.date?.map(event => ({
        name: "",
        start: event,
        end: event,
      }))
    },
  },
  created() {
    this.weeklyFrequencyDays = this.form.frequency.day ?? [];
  },
  methods: {
    handleFrequencyWeekDaysChange() {
      this.$emit('update-value', 'frequency.day', this.weeklyFrequencyDays)
    },
    isEvent(date) {
      return this.form?.frequency?.date?.includes(date)
    },
    getDateArrayMonthly(date) {
      const currentlySelectedDates = this.form?.frequency?.date ? [...this.form.frequency.date] : [];
      if (currentlySelectedDates.includes(date)) {
        const index = currentlySelectedDates.indexOf(date);
        currentlySelectedDates.splice(index, 1);
      } else {
        currentlySelectedDates.push(date);
      }

      return [...currentlySelectedDates];
    },
    async testConnection() {
      this.isConnectionValid = false;

      const credential = { ...this.form.credential };

      if (this.form.connectionType === 'FTP'
        || this.form.connectionType === 'FTPS'
        || this.form.connectionType === 'SFTP'
      ) {
        delete credential.privateKey;
        delete credential.aws_region;
        delete credential.aws_access_id;
        delete credential.aws_secret_key;
        delete credential.aws_bucket;
      } else if (this.form.connectionType === 'SFTP_WITH_KEY') {
        delete credential.password;
        delete credential.aws_region;
        delete credential.aws_access_id;
        delete credential.aws_secret_key;
        delete credential.aws_bucket;
      } else if (this.form.connectionType === 'AMAZON_S3') {
        delete credential.username;
        delete credential.password;
        delete credential.port;
        delete credential.host;
        delete credential.privateKey;
      }

      await this.$rest.remote_connection.test({
        connectionType: this.form.connectionType,
        credentials: credential,
        directory: this.form.directory,
      });
      // @TODO - Use content in API response to help the user find the directory

      this.isConnectionValid = true;
    },
  },
};
</script>

<style scoped>
.timezone-dropbox {
  width: 320px;
}
</style>
