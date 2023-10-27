<template>
  <AppWidgetBlock
    v-bind="{config}"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <div class="flex-grow-1 d-flex align-center justify-center mt-2">
      <bar-chart
        v-if="loaded"
        style="width: 100%"
        :height="120"
        :chart-data="chartdata"
        :options="options"
      />
    </div>
  </AppWidgetBlock>
</template>

<script>
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";
import BarChart from "@/sharedComponents/charts/BarChart";

export default {
  name: "ContactBestDayWidget",
  components: {
    AppWidgetBlock,
    BarChart
  },
  props: {
    config: {
      default: () => ({
        size: '2x1',
        name: 'Best Day'
      })
    },
    data: {
      default: () => [],
    }
  },
  data(){
    return {
      loaded: true,
      chartdata: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              drawOnChartArea: false
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: false
            }
          }],
        }
      }
    }
  },
  watch: {
    data: function (config) {
      let labels = [];
      let data = [];

      let highestIndex = 0;
      let max = 0;
      for (let key in config) {
        labels.push(config[key].best_day || 'N/A');
        data.push(config[key].count);

        if (config[key].count > max) {
          max = config[key].count;
          highestIndex = data.length - 1;
        }
      }

      const colors = data.map((item, index) => {
        return index === highestIndex
          ? '#2b84eb'
          : '#dceff9';
      });

      this.chartdata = {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          hoverBackgroundColor: '#2b84eb',
          borderRadius: 10,
          barThickness: 24,
        }]
      }
    },
  },
};
</script>

