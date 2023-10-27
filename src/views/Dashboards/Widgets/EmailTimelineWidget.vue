<template>
  <AppWidgetBlock
    v-bind="{config}"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <div class="flex-grow-1 d-flex align-center justify-center mt-2">
      <line-chart
        v-if="loaded"
        style="width: 100%"
        :height="120"
        :chartdata="emailTimelineChartData"
        :options="options"
      />
    </div>
  </AppWidgetBlock>
</template>

<script>
import AppWidgetBlock from "@/views/Dashboards/Widgets/components/AppWidgetBlock";
import LineChart from "@/sharedComponents/charts/LineChart";
import dayjs from "dayjs";

export default {
  name: "EmailTimelineWidget",
  components: {
    AppWidgetBlock,
    LineChart
  },
  props: {
    config: {
      default: () => ({
        size: 'x1',
        name: 'Email Timeline'
      })
    },
    data: {
      default: () => [],
    }
  },
  data(){
    return {
      loaded: true,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              drawOnChartArea: false
            },
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: false
            },
          }],
        }
      }
    }
  },
  computed: {
    emailTimelineChartData() {
      const today = dayjs();
      const configTimeFrame = this.config.configuration?.timeFrame;

      // for single date
      if (configTimeFrame === 'today') {
        const hoursData = [];
        const labels = [];
        for (let hour = 0; hour <= 23; hour++) {
          const hourData = this.data[hour];
          if (!hourData) {
            hoursData.push(0);
          } else {
            hoursData.push(
              this.data[hour] > 0 ? this.data[hour] : 0
            );
          }

          labels.push(hour);
        }

        return {
          datasets: [
            {
              label: today.format('MMM DD, YYYY'),
              data: hoursData,
              backgroundColor: 'rgba(43, 132, 235, 0.05)',
              borderColor: '#2b84eb',
              borderWidth: 2,
              pointBackgroundColor: '#2b84eb',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10,
              pointHoverBorderColor: 'white',
              pointHoverBorderWidth: 2,
              pointHoverRadius: 4,
            },
          ],
          labels: labels,
        };
      }

      const daysOfMonth = today.daysInMonth();
      const dates = Array.from({ length: daysOfMonth }, (_, i) => i + 1)
      if (configTimeFrame === 'last30days') {
        return {
          datasets: [
            {
              label: today.format('MMM YYYY'),
              backgroundColor: 'rgba(43, 132, 235, 0.05)',
              borderColor: '#3498db',
              pointBackgroundColor: '#2b84eb',
              data: this.getChartDataFullMonth(
                today.format('YYYY'),
                today.format('MM'),
                this.selection
              ),
              borderWidth: 2,
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10,
              pointHoverBorderColor: 'white',
              pointHoverBorderWidth: 2,
              pointHoverRadius: 4,
            },
          ],
          labels: dates,
        };
      }

      if (configTimeFrame === 'last3month') {
        const dataCollections = {
          datasets: [],
          labels: dates,
        };
        const lastMonth = today.subtract(1, 'month');
        const last2Month = today.subtract(2, 'months');

        for (const [date, color] of [
          [last2Month, '#2ecc71'],
          [lastMonth, '#f1c40f'],
          [today, '#3498db'],
        ]) {
          dataCollections.datasets.push({
            label: date.format('MMM YYYY'),
            borderColor: color,
            pointBackgroundColor: color,
            data: this.getChartDataFullMonth(
              date.format('YYYY'),
              date.format('MM'),
              this.selection
            ),
            borderWidth: 2,
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointHoverRadius: 4,
          });
        }

        return dataCollections;
      }

      return {};
    },
  },
  methods: {
    /**
     * Parse data for full month
     * @param {string} year 4-letter Year string 2011 2012 2013...
     * @param {string} month Month-string (01 02 03... 12)
     * @return {{}}
     */
    getChartDataFullMonth(year, month) {
      // get 30 or 31
      const dMonth = dayjs(`${year}-${month}`);
      const daysOfMonth = dMonth.daysInMonth();
      const data = [];

      for (let day = 1; day <= daysOfMonth; day++) {
        const dDate = dMonth.set('date', day);

        const fullDateString = dDate.format('YYYY-MM-DD');
        data.push(
          (this.data && this.data[fullDateString])
            ? (this.data[fullDateString] || 0)
            : 0
        );
      }

      return data;
    }
  },
};
</script>
