<template>
  <v-card class="custom-field-popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      Account Creation Status
    </v-card-title>
    <v-divider />
    <v-card-text class="px-6 pt-5 pb-3">
      <h3>For Account: {{ account.name }} ({{ account.accountType }})</h3>

      <v-list class="out-menu-white mt-3">
        <v-list-item
          v-for="(step, index) in creationSteps"
          :key="step.status"
          class="out-menu-white__header"
          style="height: 35px; min-height: 35px"
        >
          <v-list-item-content class="py-0 pb-1">
            <v-list-item-title>
              <v-icon
                v-if="currentStep > index || index === getAllSteps().length || isLive"
                color="#2b84eb"
                class="mr-2 mb-1"
                size="32px"
              >
                mdi-check-circle
              </v-icon>
              <v-icon
                v-else-if="creationFailed"
                color="#DD4E4E"
                class="mr-2 mb-1"
                size="32px"
              >
                mdi-close
              </v-icon>
              <v-icon
                v-else
                color="#99CCFF"
                class="mr-2 mb-1"
                size="32px"
              >
                mdi-circle
              </v-icon>
              {{ step.display }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div
        v-if="creationFailed"
        class="text-center my-3"
      >
        <h3>Failed!</h3>
        <p>{{ creationFailed }}</p>
      </div>
      <div
        v-if="isLive"
        class="text-center my-3"
      >
        <h3>The Account has been Created!</h3>
        <v-btn
          class="mt-3 btn-primary"
          tile
          color="primary"
          :block="$vuetify.breakpoint.xsOnly"
          @click="selectAccount"
        >
          Go to New Account
        </v-btn>
      </div>
    </v-card-text>

    <v-card-actions
      class="divider-with-shadow d-flex justify-end px-6 pb-3 pt-3"
    >
      <v-btn
        height="34px"
        class="elevation-0 custom-button custom-button--blue"
        width="150px"
        @click="$emit('dismiss')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: "NewAccountStatusDialog",
  props: {
    account: {
      default: () => {},
    },
  },
  data() {
    return {
      eventSource: null,
      currentStep: 0,
      creationFailed: null,
      isLive: false,
    };
  },
  computed: {
    creationSteps() {
      return this.getAllSteps().filter((elem, index) => index <= this.currentStep);
    },
  },
  async mounted() {
    if (this.eventSource) {
      await this.$store.dispatch('mercure/unsubscribe', this.eventSource)
    }

    if (this.account.status === 'live') {
      this.currentStep = this.getAllSteps().length - 1;
      this.isLive = true;
      return;
    }
    if (this.account.status === 'failed-to-create') {
      this.creationFailed = this.account.failedMessage ?? 'The Account Creation Failed';
      return;
    }

    this.eventSource = await this.$store.dispatch('mercure/account_status_subscribe', this.account.accountId);
    if (!this.eventSource) {
      return;
    }

    this.eventSource.onmessage = (msg) => {
      this.$store.dispatch('mercure/update_account_status_last_event', msg.lastEventId);

      const parsedMessage = JSON.parse(msg.data);

      const status = parsedMessage.accountStatus;

      if (!status) {
        return;
      }

      this.$emit('update', status);

      if (status === 'failed-to-create') {
        this.creationFailed = parsedMessage.message ?? 'The Account Creation Failed';
        this.$emit('failed', this.creationFailed);

        this.$store.dispatch('mercure/unsubscribe', this.eventSource)
        this.eventSource = null;
        return;
      }

      const step = this.getAllSteps().find(i => i.status === status);
      const stepIndex = this.getAllSteps().findIndex(i => {
        return i.status === status;
      });

      if (stepIndex >= 0) {
        this.currentStep = stepIndex;
      }

      this.isLive = step.status === 'live';
      if (this.isLive) {
        this.$store.dispatch('mercure/unsubscribe', this.eventSource)
        this.eventSource = null;
      }
    };
  },
  beforeDestroy() {
    if (!this.eventSource) {
      return;
    }
    this.$store.dispatch('mercure/unsubscribe', this.eventSource)
    this.eventSource = null;
  },
  methods: {
    getAllSteps() {
      return [
        {
          'status': 'new',
          'display': this.currentStep > 0 ? 'Saved Account Information' : 'Saving Account Information',
        },
        {
          'status': 'creating-database',
          'display': this.currentStep > 1 ? 'Created Database' : 'Creating Database',
        },
        {
          'status': 'setting-database-defaults',
          'display': this.currentStep > 2 ? 'Set Default Database Values' : 'Setting Default Database Values',
        },
        {
          'status': 'granting-user-access',
          'display': this.currentStep > 3 ? 'Granted User Access' : 'Granting User Access',
        },
        {
          'status': 'live',
          'display': this.currentStep >= 4 ? 'Complete!' : 'Completing...',
        }
      ];
    },
    async selectAccount() {
      const selectedAccount = await this.$store.dispatch('user/selectAccount', this.account.accountId, this.account.logo);

      this.$notifier.success(`Successfully select account ${selectedAccount.account.name}`)
      await this.$router.push(this.$route.query.next ? {path: this.$route.query.next} : { name: "DashboardView", params: {id : this.$store.getters["user/defaultDashboard"]} });
    },
  }
};
</script>

<style lang="scss" scoped>
.custom-field-popup-card {
  .v-card__title {
    font-family: "Open Sans", sans-serif;
    font-size: 16px !important;
    font-weight: 600 !important;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
  }
  .input-label {
    font-family: "Open Sans", sans-serif;
    font-size: 15px !important;
    font-weight: 600 !important;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
  }
  .field-subheader {
    color: #241c15;
  }
}
.custom-field-radio-group {
    margin-top: 8px;
    .v-icon {
      font-size: 22px;
      color: #a5a9b8;
    }
    .v-label {
      font-family: "Open Sans", sans-serif;
      font-size: 15px;
      color: #241c15;
      margin-bottom: 3px;
    }
    .v-messages {
      display: none;
    }
  }
.divider-with-shadow {
  box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.11);
}
.custom-fields-row-checkbox {
  .v-input__control {
    .v-messages {
      display: none;
    }
    .v-label {
      font-family: "Open Sans", sans-serif;
      font-size: 13px;
      font-weight: normal;
      color: #241c15;
    }
    .v-icon {
      font-size: 18px;
    }
  }
}
</style>
