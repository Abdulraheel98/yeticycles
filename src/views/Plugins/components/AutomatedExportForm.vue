<template>
  <AutomatedPluginForm
    :form="form"
    @update-value="(field, val) => $emit('update-value', field, val)"
    @remove-configuration="$emit('remove-configuration')"
  >
    <template #plugin-options>
      <div>
        <CustomDropdown
          :value="form.exportType"
          :items="exportTypeOptions"
          header="Export Type"
          item-value="id"
          item-text="text"
          @change="handleExportTypeChange"
        />
      </div>
      <div v-if="isExportTypeContact">
        <CustomDropdown
          :value="form.exportOptions.choice"
          :items="contactExportChoiceOptions"
          header="Export Option"
          item-value="id"
          item-text="text"
          @input="val => $emit('update-value', 'exportOptions.choice', val)"
        />
        <CustomDropdown
          v-if="form.exportOptions.choice === 'segment'"
          :items="segmentOptions"
          header="Segment"
          item-value="id"
          item-text="text"
          :value="form.exportOptions.segmentId"
          @input="val => $emit('update-value', 'exportOptions.segmentId', val)"
        />
      </div>
      <div v-if="isExportTypeAction">
        <CustomDropdown
          :value="form.exportOptions.contactChoice"
          :items="actionExportContactChoiceOptions"
          header="Contacts to Export"
          item-value="id"
          item-text="text"
          @input="handleContactChoiceInput"
        />
        <CustomDropdown
          v-if="form.exportOptions.contactChoice === 'segment'"
          :items="segmentOptions"
          header="Segment"
          item-value="id"
          item-text="text"
          :value="form.exportOptions.segmentId"
          @input="val => $emit('update-value', 'exportOptions.segmentId', val)"
        />
        <CustomDropdown
          :value="form.exportOptions.actionChoice"
          :items="actionExportCodeChoiceOptions"
          header="Actions to Export"
          item-value="id"
          item-text="text"
          @input="handleActionChoiceInput"
        />
        <CustomDropdown
          v-if="form.exportOptions.actionChoice === 'specific_action_codes'"
          :items="actionCodeValues"
          header="Specific Action Codes"
          item-value="id"
          item-text="text"
          :value="form.exportOptions.actionCodes"
          multiple
          @input="val => $emit('update-value', 'exportOptions.actionCodes', val)"
        />
      </div>
    </template>
  </AutomatedPluginForm>
</template>

<script>
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import AutomatedPluginForm from "@/views/Plugins/components/AutomatedPluginForm";

export default {
  name: "AutomatedExportForm",
  components: {
    CustomDropdown,
    AutomatedPluginForm,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    exportTypeOptions: {
      type: Array,
      default: () => [],
    },
    contactExportChoiceOptions: {
      type: Array,
      default: () => [],
    },
    segmentOptions: {
      type: Array,
      default: () => [],
    },
    actionExportContactChoiceOptions: {
      type: Array,
      default: () => [],
    },
    actionExportCodeChoiceOptions: {
      type: Array,
      default: () => [],
    },
    actionCodeOptions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    actionCodeValues() {
      let tacticId = 0;
      if (this.form.exportType === 'email_action') {
        tacticId = 1;
      }
      if (this.form.exportType === 'banner_action') {
        tacticId = 2;
      }
      if (this.form.exportType === 'event_action') {
        tacticId = 5;
      }
      if (this.form.exportType === 'direct_mail_action') {
        tacticId = 8;
      }

      return this.actionCodeOptions.filter(item => item?.tacticId === tacticId).map(item => ({
        id: item.id,
        text: item.name,
      }));
    },
    isExportTypeContact() {
      return this.form.exportType === 'contact';
    },
    isExportTypeAction() {
      return ['email_action', 'banner_action', 'event_action', 'direct_mail_action'].includes(this.form.exportType);
    },
  },
  methods: {
    handleExportTypeChange(val) {
      this.$emit('update-value', 'exportOptions', {});
      this.$emit('update-value', 'exportType', val);
    },
    handleContactChoiceInput(val) {
      if (val === 'all') {
        this.$emit('update-value', 'exportOptions.segmentId', null);
      }
      this.$emit('update-value', 'exportOptions.contactChoice', val);
    },
    handleActionChoiceInput(val) {
      if (val === 'all') {
        this.$emit('update-value', 'exportOptions.actionCodes', null);
      }
      this.$emit('update-value', 'exportOptions.actionChoice', val);
    },
  },
};
</script>

<style scoped>
</style>
