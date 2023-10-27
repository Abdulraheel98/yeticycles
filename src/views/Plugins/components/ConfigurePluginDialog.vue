<template>
  <v-card class="popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      New Campaign
    </v-card-title>
    <v-divider />
    <v-card-text class="plugin-popup px-6 pt-5">
      <div class="d-flex align-center mt-1">
        <div
          class="plugin-popup__image-background d-flex align-center justify-center mr-3"
        >
          <v-img
            v-if="plugin.logo"
            :src="plugin.logo"
            max-height="35px"
            contain
          />
        </div>
        <div>
          <div class="plugin-popup__name">
            {{ plugin.name }}
          </div>
          <div class="plugin-popup__link">
            https://drive.google.com
          </div>
        </div>
        <v-spacer />
        <div
          v-if="plugin.isInstalled"
          class="plugin-popup__installed d-flex align-center"
        >
          <v-icon color="#2b84eb" size="15" class="mr-1">
            mdi-check
          </v-icon>
          <div>Installed</div>
        </div>
        <div v-else class="plugin-popup__not-installed">
          Not installed
        </div>
      </div>

      <div class="mt-5">
        <div class="subtitle-text mb-2">
          Description
        </div>
        <div class="regular-text-gray">
          Lorem ipsum dolor sit amet, per ea stet fuisset definiebas. Ex vitae
          voluptaria mea, mel ea adipisci dissentiunt delicatissimi. Pri cu
          sadipscing reformidans. Postulant comprehensam at sea.
        </div>
      </div>

      <div class="mt-5">
        <div class="subtitle-text mb-2">
          What you will unlock with this plugin
        </div>
        <div class="regular-text-gray">
          <ul>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Lorem ipsum dolor sit amet</li>
          </ul>
        </div>
      </div>

      <div class="mt-5">
        <div class="subtitle-text">
          Input text field
        </div>
        <CustomTextInput placeholder="Type text here" />
      </div>

      <div class="mt-5">
        <div class="subtitle-text">
          Input text field
        </div>
        <CustomDropdown
          placeholder="Choose a value"
          :items="[
            { label: 'Setting 1', value: 1 },
            { label: 'Setting 2', value: 2 },
          ]"
        />
      </div>

      <div class="mt-5">
        <div class="subtitle-text">
          Custom Checkboxes
        </div>
        <div class="ml-2 mt-2">
          <v-checkbox class="plugin-popup-checkbox" label="Turn on tracking" />
          <v-checkbox class="plugin-popup-checkbox" label="Turn on tracking" />
          <v-checkbox class="plugin-popup-checkbox" label="Turn on tracking" />
        </div>
      </div>

      <v-card-actions />
    </v-card-text>
    <v-divider />
    <div class="d-flex justify-end align-center px-6 pb-3 pt-2">
      <v-btn
        class="custom-button custom-button--blue px-15"
        height="34px"
        depressed
        @click="$emit('click')"
      >
        Install
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";

export default {
  name: "SelectCampaignType",
  components: { CustomTextInput, CustomDropdown },
  props: {
    plugin: {
      default: () => {},
      type: Object,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.plugin-popup {
  &__image-background {
    height: 80px;
    width: 80px;
    background: rgba(216, 216, 216, 0.2);
  }
  &__name {
    font-size: 18px;
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    line-height: normal;
    color: #241c15;
  }
  &__link {
    font-family: "Open Sans", sans-serif;
    font-size: 11px;
    line-height: normal;
    color: #2b84eb;
  }
  &__installed {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: normal;
    color: #2b84eb;
  }
  &__not-installed {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    line-height: normal;
    color: #66788e;
  }

  .subtitle-text {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    line-height: normal;
    color: #241c15;
  }
  .regular-text {
    font-size: 13px;
    font-stretch: normal;
    line-height: normal;
    color: #241c15;
    font-family: "Open Sans", sans-serif;
    &-gray {
      font-size: 13px;
      color: #66788e;
      font-family: "Open Sans", sans-serif;
    }
  }

  .v-input.plugin-popup-checkbox {
    margin: 0;
    padding-top: 0;
    .v-input__control {
      .v-messages {
        display: none !important;
      }
      .v-input__slot {
        margin-bottom: 3px;
        .v-label {
          font-size: 13px;
          font-stretch: normal;
          line-height: normal;
          color: #241c15;
          font-family: "Open Sans", sans-serif;
          padding-top: 1px;
        }
        .v-icon {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
