<template>
  <AppWidgetBlock
    v-bind="{ config }"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <template #right-corner>
      <div style="width: 200px;">
        <select
          v-model="selection"
          style="text-align: right; width: 200px;"
          @change="reloadData"
        >
          <option value="all">
            All
          </option>
          <option
            v-for="(email, index) in latestEmails"
            :key="index"
            :value="email.id"
          >
            {{ email.campaign }} - {{ email.subject }}
          </option>
        </select>
      </div>
    </template>
    <div class="flex-grow-1 d-flex flex-column justify-center">
      <!-- progress list -->
      <div>
        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Open Rate
          </div>
          <div>
            <v-progress-linear
              background-color="#dee7ee"
              :value="openRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text">KPI 14%</div> -->
          <div class="emails-legend-text d-flex justify-end">
            {{ openRate }}%
          </div>
        </div>
        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Click-Thru Rate
          </div>
          <div>
            <v-progress-linear
              background-color="#dee7ee"
              :value="clickThruRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text">KPI 9%</div> -->
          <div class="emails-legend-text d-flex justify-end">
            {{ clickThruRate }}%
          </div>
        </div>
        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Click-to-Open Rate
          </div>
          <div>
            <v-progress-linear
              background-color="#dee7ee"
              :value="clickToOpenRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text emails-legend-text__good">KPI 20%</div> -->
          <div class="emails-legend-text d-flex justify-end">
            {{ clickToOpenRate }}%
          </div>
        </div>

        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Unsubscribe Rate
          </div>
          <div>
            <v-progress-linear
              class="bad"
              background-color="#dee7ee"
              :value="unsubscribeRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text">KPI 5%</div> -->
          <div class="emails-legend-text d-flex justify-end">
            {{ unsubscribeRate }}%
          </div>
        </div>
        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Bounce Rate
          </div>
          <div>
            <v-progress-linear
              class="bad"
              background-color="#dee7ee"
              :value="bounceRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text emails-legend-text__bad">KPI 1%</div> -->
          <div class="emails-legend-text emails-legend-text d-flex justify-end">
            {{ bounceRate }}%
          </div>
        </div>
        <div class="email-diagram-line my-1">
          <div
            class="emails-legend-text email-diagram-line__title d-flex justify-end align-center"
          >
            Complaint Rate
          </div>
          <div>
            <v-progress-linear
              class="bad"
              background-color="#dee7ee"
              :value="complaintRate"
              rounded
              height="8"
            />
          </div>
          <!-- <div class="emails-legend-text">KPI 1%</div> -->
          <div class="emails-legend-text d-flex justify-end">
            {{ complaintRate }}%
          </div>
        </div>
      </div>
    </div>
  </AppWidgetBlock>
</template>

<script>
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";

export default {
  name: "EmailStatistics",
  components: {
    AppWidgetBlock,
  },
  props: {
    config: {
      default: () => ({
        size: "2x2",
        name: "Email Statistics",
      }),
    },
    data: {
      default: () => [],
    }
  },
  data: () => ({
    latestEmails: [],
    selection: 'all',
    openRate: 0,
    clickThruRate: 0,
    clickToOpenRate: 0,
    unsubscribeRate: 0,
    bounceRate: 0,
    complaintRate: 0,
  }),
  computed: {
    config_data() {
      return this.data;
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.updateLatestEmails();
        this.reloadData();
      },
    },
  },
  methods: {
    reloadData() {
      this.openRate = this.getOpenRate();
      this.clickThruRate = this.getClickThruRate();
      this.clickToOpenRate = this.getClickToOpenRate();
      this.unsubscribeRate = this.getUnsubscribeRate();
      this.bounceRate = this.getBounceRate();
      this.complaintRate = this.getComplainRate();
    },
    updateLatestEmails() {
      const listIDs = Object.keys(this.config_data);
      if (!listIDs.length) {
        return;
      }

      // pick latest 10
      const emails = [];
      for (let i = listIDs.length - 1; i >= 0; i--) {
        const id = listIDs[i];
        emails.push({
          ...this.config_data[id],
          id,
        });
      }

      this.$set(this, 'latestEmails', emails);
    },
    getMetricRateFromDelivered(type) {
      let metricCount = 0;
      let sends = 0;
      let hardBounces = 0;
      let softBounces = 0;

      Object.keys(this.config_data).forEach(key => {
        if (this.selection !== 'all' && key !== this.selection) {
          return;
        }

        const item = this.config_data[key];

        metricCount += item.statistics[type];
        sends += item.statistics.sends;
        hardBounces += item.statistics.hardBounces;
        softBounces += item.statistics.softBounces;
      })

      if ((sends - hardBounces - softBounces) == 0) return 0
      return ((metricCount / (sends - hardBounces - softBounces)) * 100).toFixed(1);
    },
    getOpenRate() {
      return this.getMetricRateFromDelivered("uniqueOpens");
    },
    getClickThruRate() {
      return this.getMetricRateFromDelivered("uniqueClicks");
    },
    getClickToOpenRate() {
      let uniqueClicks = 0;
      let uniqueOpens = 0;

      Object.keys(this.config_data).forEach(key => {
        if (this.selection !== 'all' && key !== this.selection) {
          return;
        }

        const item = this.config_data[key];

        uniqueClicks += item.statistics.uniqueClicks;
        uniqueOpens += item.statistics.uniqueOpens;
      })

      if (uniqueOpens == 0) return 0;
      return (uniqueClicks / uniqueOpens * 100).toFixed(1);
    },
    getUnsubscribeRate() {
      return this.getMetricRateFromDelivered("unsubscribes");
    },
    getBounceRate() {
      let sends = 0;
      let hardBounces = 0;
      let softBounces = 0;

      Object.keys(this.config_data).forEach(key => {
        if (this.selection !== 'all' && key !== this.selection) {
          return;
        }

        const item = this.config_data[key];

        sends += item.statistics.sends;
        hardBounces += item.statistics.hardBounces;
        softBounces += item.statistics.softBounces;
      })

      if (sends == 0) return 0
      return (((softBounces + hardBounces) / sends) * 100).toFixed(1);
    },
    getComplainRate() {
      return this.getMetricRateFromDelivered("spamComplaints");
    },
  },
};
</script>

<style lang="scss" scoped>
.emails-legend-text {
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  line-height: normal;
  color: #66788e;

  &__good {
    font-weight: 600;
    color: #2b84eb;
  }
  &__bad {
    font-weight: 600;
    color: #dc2929;
  }
  &--blue {
    font-size: 11px;
    font-weight: 600;
    color: #2b84eb;
  }
}
.email-diagram-line {
  display: grid;
  grid-template-columns: 92px 1fr /* 56px */ 32px;
  grid-column-gap: 10px;
  height: 38px;

  > div {
    display: flex;
    align-items: center;
  }
  &__title {
    margin-bottom: 2px;
    text-align: right;
  }
}
.v-progress-linear {
  .v-progress-linear__determinate {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: linear-gradient(to left, #2b84eb, #63abff);
  }
}
.bad.v-progress-linear {
  .v-progress-linear__determinate {
    background: linear-gradient(to right, #f07676 29%, #dc2929 71%);
  }
}
.underline {
  text-decoration: underline;
}
</style>
