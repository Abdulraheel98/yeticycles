<template>
  <v-card class="popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      Add a Widget
    </v-card-title>
    <v-divider />
    <v-card-text class="px-6 pt-5">
      <v-row>
        <v-col
          v-for="widget in widgets"
          :key="widget.id"
          cols="4"
        >
          <WidgetCard
            :widget="widget"
            :class="selectedWidget && selectedWidget.id === widget.id ? 'selected' : ''"
            @click="handleSelectWidget"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions
      class="divider-with-shadow d-flex justify-end px-6 pb-3 pt-3"
    >
      <div
        class="simple-text-button button--gray mx-8 d-flex align-center"
        @click="$emit('dismiss')"
      >
        Cancel
      </div>

      <v-btn
        height="34px"
        class="elevation-0 custom-button custom-button--blue"
        width="150px"
        :disabled="!selectedWidget.id"
        @click="on_save"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import WidgetCard from "@/views/Dashboards/components/WidgetCard";

export default {
  name: "WidgetSelectionDialog",
  components: {
    WidgetCard
  },
  props: {
    widgets: {
      default: () => [],
    },
  },
  data() {
    return {
      selectedWidget: {},
    };
  },
  methods: {
    handleSelectWidget(widget) {
      if (this.selectedWidget.id === widget.id) {
        this.selectedWidget = {}
        return;
      }

      this.selectedWidget = widget
    },
    on_save() {
      this.$emit("save", this.selectedWidget);
      this.$emit("close");
    },
    dismiss() {
      this.$emit("dismiss");
    },
  }
};
</script>

<style lang="scss" scoped>
.input-description {
  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  line-height: 1.77;
  color: #66788e;
}
.widget-preview {
  &__image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: solid 1px #dee7ee;
  }
  &__name {
    font-family: "Open Sans", sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
    color: #241c15;
  }
  &__size {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    line-height: normal;
    text-align: right;
    color: #66788e;
  }
}
.widget-card{
  &:hover{
    border: solid 1px #2b84eb !important;
    background-color: rgba(56, 113, 180, 0.11) !important;
  }
  &.selected{
    border: solid 1px #2b84eb !important;
    background-color: rgba(56, 113, 180, 0.11) !important;
  }
}
</style>
