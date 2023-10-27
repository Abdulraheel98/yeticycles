<template>
  <v-card class="popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      {{ title }}
    </v-card-title>
    <v-divider />
    <v-card-text class="px-6 pt-5">
      <validation-observer ref="textInput">
        <CustomTextInput
          v-model="name"
          class="flex-grow-1"
          header="Dashboard Name"
          placeholder="My Dashboard"
          :maxlength="150"
          :required="true"
        />
      </validation-observer>
      <v-card-actions class="d-flex justify-end align-center pa-0 mt-5">
        <div class="simple-text-button button--gray px-9" @click="dismiss">
          Cancel
        </div>

        <v-btn
          class="custom-button custom-button--blue"
          height="34px"
          width="100px"
          depressed
          @click="on_save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
export default {
  name: "NewDashboardDialog",
  components: { CustomTextInput },
  props: {
    dashboardName: {
      default: () => '',
      required: false,
    },
    title: {
      default: () => 'New Dashboard',
      required: false,
    },
  },
  data() {
    return {
      name: null,
    };
  },
  watch: {
    dashboardName(newValue) {
      this.name = newValue;
    }
  },
  mounted() {
    this.name = this.dashboardName;
  },
  methods: {
    on_save() {
      this.$emit("save", this.name);
      this.dismiss();
    },
    dismiss() {
      this.$emit("dismiss");
      this.name = this.dashboardName;
    },
  },
};
</script>
