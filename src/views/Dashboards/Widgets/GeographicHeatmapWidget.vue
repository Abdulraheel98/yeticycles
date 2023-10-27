<template>
  <AppWidgetBlock
    v-bind="{ config }"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <div class="d-flex justify-center" style="max-height: 290px;">
      <USAHeatmap
        :config="actual_config"
        style="height: 290px;"
        :legend-groups="legendGroups"
        :map-id="config.id"
      />
    </div>
    <div class="d-flex flex-wrap justify-center">
      <div
        v-for="(legendGroup, i) in legendGroups"
        :key="i"
        class="d-flex align-center mx-2"
      >
        <div class="legend-cube mr-1" :style="{backgroundColor: legendGroup.color}" />
        <div class="legend-text">
          <template v-if="legendGroup.min !== legendGroup.max">
            {{ legendGroup.min.toLocaleString() }} - {{ legendGroup.max.toLocaleString() }}
          </template>
          <template v-else>
            {{ legendGroup.min }}
          </template>
        </div>
      </div>
    </div>
  </AppWidgetBlock>
</template>

<script>
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";
import USAHeatmap from "@/sharedComponents/charts/USAHeatmap";

export default {
  name: "GeographicHeatmapWidget",
  components: {
    AppWidgetBlock,
    USAHeatmap,
  },
  props: {
    config: {
      default: () => ({
        size: "2x2",
        name: "Contact Universe",
      }),
    },
    data: {
      default: () => [],
    },
  },
  computed: {
    actual_config() {
      return this.data.length ? this.data : [];
    },
    color() {
      return this.config.configuration?.color ?? '#2b84eb';
    },
    legendGroups() {
      if (!this.data.length) {
        return [];
      }

      let max = Math.max(...this.data.map(i => i.count));

      let step = Math.floor(max / 4);

      const groups = [];
      const colors = [
        this.color + "40",
        this.color + "80",
        this.color + "bf",
        this.color + "ff",
      ];
      for (let i = 0; i < 4; i++) {
        if (max <= ((i + 1) * step)) {
          groups.push({
            min: i * step,
            max,
            color: colors[i],
          });
          break;
        }

        let currMax = ((i + 1) * step) - 1;
        if (i === 0) {
          currMax = step -1;
        } else if (i === 3) {
          currMax = max;
        }

        groups.push({
          min: i * step,
          max: currMax,
          color: colors[i],
        })
      }

      return groups;
    },
  },
};
</script>
