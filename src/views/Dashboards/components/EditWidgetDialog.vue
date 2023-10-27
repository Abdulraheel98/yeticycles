<template>
  <v-card class="popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      Widget Configuration
    </v-card-title>
    <v-divider />
    <v-card-text class="px-6 pt-5">
      <div class="widget-preview d-flex align-center mb-6">
        <div class="widget-preview__image mr-3">
          <WidgetCardImage :widget="widget" style="width: 100%; height: 100%" />
        </div>
        <div class="widget-preview__name">
          {{ widget.name }}
        </div>
        <v-spacer />
        <div class="widget-preview__size ml-3">
          {{ widget.width }}x{{ widget.height }}
        </div>
      </div>

      <div class="input-label mb-1">
        Description
      </div>
      <div class="input-description mb-4">
        {{ widget.description }}
      </div>

      <validation-observer ref="textInput">
        <div>
          <div>
            <div class="input-label">
              Widget Label
            </div>
            <CustomTextInput
              class="mb-6"
              :value="temp_widget.name"
              placeholder="Enter the label you want to see on the dashboard"
              required
              @input="(val) => (temp_widget.name = val)"
            />
          </div>
        </div>
        <div v-for="(item, name) in temp_widget.widgetConfig || []" :key="name">
          <div>
            <CustomDropdown
              v-if="'choice' === item.type"
              v-show="isVisible(item)"
              v-model="item.value"
              class="mb-6"
              item-text="label"
              item-value="value"
              :items="item.choiceValues"
              :placeholder="item.placeholder"
              :required="isRequired(item)"
              :header="item.label"
              header-class="input-label"
            />

            <CustomColorPicker
              v-if="'color' === item.type"
              v-show="isVisible(item)"
              :color="colorValue"
              :header="item.label"
              :required="isRequired(item)"
              header-class="input-label"
              @input="setColor"
            />
          </div>
        </div>
      </validation-observer>
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
        @click="on_save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import WidgetCardImage from "@/views/Dashboards/components/WidgetCardImage";
import CustomColorPicker from "@/sharedComponents/CustomColorPicker";

export default {
  name: "EditWidgetDialog",
  components: {
    CustomColorPicker,
    CustomTextInput,
    CustomDropdown,
    WidgetCardImage,
  },
  props: {
    widget: {
      default: () => {},
    },
    editWidget: {
      default: () => {},
    },
  },
  data() {
    return {
      temp_widget: {},
      defaultColor: "#137fb5",
      colorPreset: [
        "#137fb5",
        "#3b98a4",
        "#dc698f",
        "#6f509f",
        "#83CA79",
        "#B22FBE",
        "#D1D62A",
      ],
      colorValue: "",
      displayPicker: false,
    };
  },
  watch: {
    colorValue(val) {
      if (val) {
        this.$emit("input", val);
      }
    },
  },
  mounted() {
    this.temp_widget = { ...this.widget, ...this.editWidget };
    this.defaultColor = this.colorPreset[
      Math.floor(Math.random() * this.colorPreset.length)
    ];
    // set color
    if (this.widget.widgetConfig.color?.value) {
      this.colorValue = this.widget.widgetConfig.color.value;
    } else {
      this.colorValue = this.widget.widgetConfig.color?.defaultValue
        ? this.widget.widgetConfig.color?.value
        : this.defaultColor;
    }

    // traverse to set value
    Object.keys(this.temp_widget.configuration).forEach((key) => {
      // set value
      this.setConfigValue(
        key,
        this.temp_widget.configuration[key]
          ? this.temp_widget.configuration[key]
          : (this.temp_widget?.widgetConfig[key]?.defaultValue ?? '')
      );
    });
  },
  methods: {
    async validate() {
      return await this.$refs.textInput.validate();
    },
    async on_save() {
      if (await this.validate()) {
        if (this.temp_widget.widgetConfig.color) {
          this.temp_widget.widgetConfig.color.value = this.colorValue;
        }

        if (!this.temp_widget.configuration) {
          this.temp_widget.configuration = {};
        }
        Object.keys(this.temp_widget.widgetConfig).forEach((configKey) => {
          this.temp_widget.configuration[
            configKey
          ] = this.temp_widget.widgetConfig[configKey].value;
        });

        this.$emit("save", this.temp_widget);
        this.$emit("close");
      } else {
        this.$store.commit("snackbar/showMessage", {
          content: "Please fix the error(s) and try again",
          color: "error",
        });
      }
    },
    dismiss() {
      this.$emit("dismiss");
    },
    setColor(color) {
      if (!color) {
        this.colorValue = "";

        return;
      }
      this.colorValue = color.hex;
    },
    setConfigValue(keyName, val) {
      this.$set(this.temp_widget.widgetConfig[keyName], "value", val);
    },
    isRequired(item) {
      if ('required' in item) {
        return item.required;
      }
      if ('requiredRules' in item) {
        const rules = item.requiredRules;

        let isRequired = true;
        rules.forEach(rule => {
          if (rule.type === 'value') {
            const valueToCheck = this.temp_widget?.widgetConfig[rule.field]?.value ?? null;

            isRequired = isRequired && rule.values.includes(valueToCheck);
          }
        });

        return isRequired;
      }

      return true;
    },
    isVisible(item) {
      if ('displayRules' in item) {
        const rules = item.displayRules;

        let isVisible = true;
        rules.forEach(rule => {
          if (rule.type === 'value') {
            const valueToCheck = this.temp_widget?.widgetConfig[rule.field]?.value ?? null;

            isVisible = isVisible && rule.values.includes(valueToCheck);
          }
        });

        return isVisible;
      }

      return true;
    },
  },
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

.color-picker-block {
  position: relative;

  &__picker {
    position: absolute;
    top: 50px;
    left: 0;
  }
}
</style>
