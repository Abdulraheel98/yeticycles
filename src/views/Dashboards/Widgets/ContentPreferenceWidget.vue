<template>
  <AppWidgetBlock
    v-bind="{ config }"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <div class="flex-grow-1 my-2">
      <bubble-chart
        v-if="loaded"
        :width="1000"
        :height="280"
        :data="chartData"
      />
    </div>
    <div class="d-flex flex-wrap justify-center">
      <div
        v-for="(item, index) in top3Contents"
        :key="index"
        class="d-flex align-center mx-2"
      >
        <div
          class="legend-cube mr-1"
          :style="{'backgroundColor': item.color}"
        />
        <div class="legend-text">
          {{ item.label }} ({{ item.value }})
        </div>
      </div>
    </div>
  </AppWidgetBlock>
</template>

<script>
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";
import BubbleChart from "@/sharedComponents/charts/BubbleChart";
import _ from "lodash";

export default {
  name: "ContentPreferenceWidget",
  components: {
    BubbleChart,
    AppWidgetBlock,
  },
  props: {
    config: {
      default: () => ({
        size: "2x2",
        name: "Content Preference",
      }),
    },
    data: {
      default: () => [],
    }
  },
  data() {
    return {
      loaded: true,
      top3Contents: [],
      chartData: [],
    };
  },
  watch: {
    data: function () {
      this.update_configuration()
    },
  },
  created() {
    this.update_configuration()
  },
  methods: {
    update_configuration() {
      if (!this.data || !this.data.length) {
        return {};
      }
      const config = this.data;
      const sortedConfig = _.orderBy(config, ['count'], ['desc']);

      this.chartData = sortedConfig.map((item, index) => {
        const data = {
          label: item.name,
          value: parseInt(item.count) || 0,
        };

        data.color = this.getColor(this.config?.configuration?.color, index)

        return data;
      });

      this.top3Contents = [];
      if (this.chartData[0]) this.top3Contents.push(this.chartData[0]);
      if (this.chartData[1]) this.top3Contents.push(this.chartData[1]);
      if (this.chartData[2]) this.top3Contents.push(this.chartData[2]);
    },
    getColor(color, index) {
      let newColor
      switch (index) {
        case 0: newColor = (color ?? '#9dc9e1') + "ff"; break;
        case 1: newColor = (color ?? '#9dc9e1') + "bf"; break;
        case 2: newColor = (color ?? '#6baed6') + "80"; break;
        case 3: newColor = (color ?? '#2f82bd') + "40"; break;
      }
      return newColor
    },
  }
};
</script>

