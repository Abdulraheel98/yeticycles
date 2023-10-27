<template>
  <AutomatedPluginForm
    :form="form"
    @update-value="(field, val) => $emit('update-value', field, val)"
    @remove-configuration="$emit('remove-configuration')"
  >
    <template #extra-filesystem-details>
      <div>
        <CustomTextInput
          :value="form.archiveDirectory"
          header="Archive Directory"
          hint="This directory is where the processed files get moved to after they are fully imported. Leave empty to not archive processed files."
          @input="val => $emit('update-value', 'archiveDirectory', val)"
        />
      </div>
      <div>
        <CustomDropdown
          :value="form.fileExtension"
          :items="fileExtensionOptions"
          header="File Extension to Import"
          item-value="id"
          item-text="text"
          required
          @input="val => $emit('update-value', 'fileExtension', val)"
        />
      </div>
    </template>
    <template #plugin-options>
      <div>
        <CustomDropdown
          :value="form.importType"
          :items="importTypeOptions"
          header="Import Type"
          item-value="id"
          item-text="text"
          required
          @change="handleImportTypeChange"
        />
      </div>
      <div v-if="isImportTypeContact">
        <CustomDropdown
          :items="segmentOptions"
          header="Add Contacts to Segment"
          item-value="id"
          item-text="text"
          :value="form.importOptions.segmentId"
          hint="Optionally, after the contact is created you can have them automatically added to the segment chosen."
          @input="val => $emit('update-value', 'importOptions.segmentId', val)"
        />
      </div>
    </template>
  </AutomatedPluginForm>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import AutomatedPluginForm from "@/views/Plugins/components/AutomatedPluginForm";

export default {
  name: "AutomatedImportForm",
  components: {
    CustomTextInput,
    CustomDropdown,
    AutomatedPluginForm,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    importTypeOptions: {
      type: Array,
      default: () => [],
    },
    segmentOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fileExtensionOptions: [
        {
          id: 'csv',
          text: 'Comma-Separated Values (.csv)',
        },
        {
          id: 'txt',
          text: 'Text File (.txt)',
        },
      ]
    };
  },
  computed: {
    isImportTypeContact() {
      return this.form.importType === 'contact';
    },
  },
  methods: {
    handleImportTypeChange(val) {
      this.$emit('update-value', 'importOptions', {});
      this.$emit('update-value', 'importType', val);
    },
  },
};
</script>

<style scoped>
</style>
