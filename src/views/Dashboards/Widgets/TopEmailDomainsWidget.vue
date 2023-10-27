<template>
  <AppWidgetBlock
    v-bind="{config}"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <div class="flex-grow-1 d-flex align-center justify-center my-2">
      <pie-chart
        v-if="loaded"
        :height="180"
        :chartdata="chartData"
        :options="options"
      />
    </div>
    <div
      v-for="(item, index) in topItems"
      :key="index"
      class="d-flex flex-wrap"
    >
      <div class="d-flex flex-fill align-center mx-2">
        <div
          :style="{'backgroundColor': colors[index]}"
          class="legend-cube mr-1"
        />
        <div class="legend-text">
          {{ item.domain }}
        </div>
      </div>
      <div class="d-flex flex-fill align-center justify-end total-number">
        {{ item.total }} ({{ ((100 * item.total) / allTotals).toFixed() }}%)
      </div>
    </div>
  </AppWidgetBlock>
</template>

<script>
import PieChart from "@/sharedComponents/charts/PieChart";
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";
import _ from "lodash";

export default {
  name: "TopEmailDomainsWidget",
  components: {
    PieChart,
    AppWidgetBlock,
  },
  props: {
    config: {
      default: () => ({
        size: '1x2',
        name: 'Top Email Domains'
      })
    },
    data: {
      default: () => {},
    }
  },
  data(){
    return {
      loaded: true,
      chartData: {},
      topItems: [],
      options: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }],
        }
      },
      colors: [
        '#4682e4',
        '#eb716d',
        '#92d7d5',
        '#e3a24a',
      ],
      allTotals: 0,
    }
  },
  watch: {
    data: {
      deep: true,
      handler: 'setChartData',
    },
  },
  created() {
    this.setChartData();
  },
  methods: {
    setChartData() {
      const domains = Object.keys(this.data);
      if (!domains.length) {
        return;
      }

      let domainsData = domains.map((domain) => ({
        domain,
        total: this.data[domain],
      }));
      domainsData = _.orderBy(domainsData, ['total'], ['desc']);
      this.allTotals = _.sumBy(domainsData, 'total');

      const labels = [];
      const numbers = [];
      this.topItems = [];

      // get first-top 3
      for (let i = 0; i < Math.min(3, domainsData.length); i++) {
        const item = domainsData.shift();

        labels.push(item.domain);
        numbers.push(item.total);
        this.topItems.push(item);
      }

      // if we still have data here
      // then they will go to others
      if (domainsData.length) {
        labels.push('Others');
        const othersTotal = _.sumBy(domainsData, 'total');
        numbers.push(othersTotal);

        this.topItems.push({
          domain: 'Others',
          total: othersTotal,
        });
      }

      this.chartData = this.$set(this, 'chartData', {
        labels: labels,
        datasets: [{
          backgroundColor: this.colors,
          data: numbers,
          borderWidth: 0,
        }],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.total-number {
  font-size: 11px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #66788e;
}
</style>
