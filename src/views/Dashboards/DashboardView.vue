<template>
  <v-container fluid class="dashboard-container px-sm-10 px-3">
    <PageHeader
      v-if="isLoaded"
      :header-text="dashboard.name"
      outlined-button-text="Manage Dashboard"
      :regular-button-text="canEditDashboard(dashboard) ? 'Edit Dashboard' : null"
      @outlined-button-click="$router.push({ name: 'DashboardList' })"
      @regular-button-click="$router.push({ name: 'EditDashboard', params: { id: dashboard.id } })"
    >
      <template #subheader>
        <p
          v-if="isLoaded && isDefaultDashboard"
          class="dashboard-sub-headline"
        >
          Currently viewing your <span>Default</span> dashboard
        </p>
      </template>
    </PageHeader>

    <v-container
      fluid
      class="pb-15"
      style="position: relative;"
      :style="{
        'height': dynamic_height ? dynamic_height + 'px' : 'auto'
      }"
    >
      <div
        id="advanced-grid"
        class="grid-stack grid-stack-4"
        style="z-index: 7"
      >
        <div
          v-for="dashboard_widget in dashboard_widgets"
          :id="'dashboard-widget-' + dashboard_widget.id"
          :key="'dashboard-widget-' + dashboard_widget.id"
          :class="{
            'grid-stack-item': true,
            'ui-draggable-disabled': true,
            'ui-resizable-disabled': true,
            'd-none': loading_grid
          }"
          :gs-x="dashboard_widget.xPosition"
          :gs-y="dashboard_widget.yPosition"
          :gs-w="dashboard_widget.width"
          :gs-h="dashboard_widget.height"
        >
          <div class="grid-stack-item-content">
            <component
              :is="dashboard_widget.component"
              :config="dashboard_widget"
              :data="dashboard_widget.data"
            />
          </div>
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import "gridstack/dist/gridstack.min.css";
import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
// OR to get legacy jquery-ui drag&drop (support Mobile touch devices, h5 does not yet)

import BannerStatisticsWidget from "@/views/Dashboards/Widgets/BannerStatisticsWidget";
import CampaignCountWidget    from "@/views/Dashboards/Widgets/CampaignCountWidget";
import ContactBestDayWidget from "@/views/Dashboards/Widgets/ContactBestDayWidget";
import ContactCountWidget from "@/views/Dashboards/Widgets/ContactCountWidget";
import ContentPreference  from "@/views/Dashboards/Widgets/ContentPreferenceWidget";
import EmailCountWidget   from "@/views/Dashboards/Widgets/EmailCountWidget";
import EmailStatistics from "@/views/Dashboards/Widgets/EmailStatistics";
import EmailTimelineWidget     from "@/views/Dashboards/Widgets/EmailTimelineWidget";
import GeographicHeatmapWidget from "@/views/Dashboards/Widgets/GeographicHeatmapWidget";
import SegmentCountWidget from "@/views/Dashboards/Widgets/SegmentCountWidget";
import TopEmailDomains    from "@/views/Dashboards/Widgets/TopEmailDomainsWidget";
import PageHeader from "@/sharedComponents/PageHeader";

export default {
  name: "DashboardView",
  metaInfo: {
    title: 'View Dashboard'
  },
  components: {
    PageHeader,
    BannerStatisticsWidget,
    CampaignCountWidget,
    ContactBestDayWidget,
    ContactCountWidget,
    ContentPreference,
    EmailCountWidget,
    EmailStatistics,
    EmailTimelineWidget,
    GeographicHeatmapWidget,
    SegmentCountWidget,
    TopEmailDomains,
  },
  props: {
    id: {
      default: () => 1,
      type: [Number, String]
    }
  },
  data() {
    return {
      loading_grid: true,
      widgets_library: {
        widgets: {
          'app.widget.bannerstatisticswidget': 'BannerStatisticsWidget',
          'app.widget.campaigncountwidget': 'CampaignCountWidget',
          'app.widget.contactbestdaywidget': 'ContactBestDayWidget',
          'app.widget.contactcountwidget': 'ContactCountWidget',
          'app.widget.contentpreferencewidget': 'ContentPreference',
          'app.widget.emailcountwidget': 'EmailCountWidget',
          'app.widget.latestemailstatisticswidget': 'EmailStatistics',
          'app.widget.emailtimelinewidget': 'EmailTimelineWidget',
          'app.widget.geographicheatmapwidget': 'GeographicHeatmapWidget',
          'app.widget.segmentcountwidget': 'SegmentCountWidget',
          'app.widget.topemaildomainswidget': 'TopEmailDomains',
        }
      },
      grid: null,
      grid_config: {
        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
        resizable: true,
        column: 4,
        cellHeight: "195px", // minimum size when height of block equals 1. Should be high as much as possible, small value (1px) may cause performance issues
        acceptWidgets: false, // Disable dragging outside widgets
        float: true, // Option to correctly flow added widgets
      },
      grid_selector: "#advanced-grid",
      dashboard_widgets: [],
      dashboard: {},
      dynamic_height: 0,
      event_source: null,
      isLoaded: false,
    };
  },
  computed: {
    isDefaultDashboard() {
      return this.$store.getters["user/defaultDashboard"] === this.id;
    },
  },
  async created() {
    const dashboardId = this.id;
    await this.get_dashboard_widgets(dashboardId);
    await this.get_dashboard_info(dashboardId);
    await this.init_grid();

    this.event_source = await this.$store.dispatch('mercure/dashboard_subscribe', dashboardId)
    this.event_source.onmessage = (msg) => {
      this.$store.dispatch('mercure/update_dashboard_last_event', {dashboardId, lastEventId: msg.lastEventId});

      const parsedMessage = JSON.parse(msg.data);

      const dashboard_widget = this.dashboard_widgets.filter((i) => {
        return i.id === parsedMessage.id;
      })[0] ?? null;
      if (!dashboard_widget) {
        return;
      }

      dashboard_widget.data = parsedMessage.data;
    };
  },
  beforeDestroy() {
    if (!this.event_source) {
      return;
    }

    this.$store.dispatch('mercure/unsubscribe', this.event_source)
  },
  methods: {
    init_grid() {
      this.grid = GridStack.init(this.grid_config, this.grid_selector);
      this.grid.enableMove(false, false);
      this.grid.enableResize(false, false);
      window.grid = this.grid;

      setTimeout(this.calculateDynamicHeight.bind(this), 500);

      this.loading_grid = false;
    },
    async get_dashboard_widgets(id) {
      const resp = await this.$rest.dashboards.get_widgets(id);
      const widgets = resp.data.filter((elem) => {
        return this.widgets_library.widgets[elem.componentName] !== undefined
      })
      for (const elem of widgets) {
        elem.data = {}
        elem.component = this.widgets_library.widgets[elem.componentName]
        elem.configuration = elem.widget_config
        delete elem.widget_config

        const dataResp = await this.$rest.dashboards.get_dashboard_widget_data(elem.id)
        elem.data = dataResp.data.data
      }
      widgets.sort((a, b) => {
        if (a.yPosition > b.yPosition) {
          return -1;
        }
        if (a.xPosition > b.xPosition) {
          return -1;
        }

        return 0;
      })

      this.dashboard_widgets = widgets;
    },
    async get_dashboard_info(id) {
      const resp = await this.$rest.dashboards.get_resource(id);
      this.dashboard = resp.data;
      this.isLoaded = true;
    },
    generate_grid(cols = 1, rows = 1) {
      const grid = [];
      const default_config = {
        w: 1,
        h: 1,
        content: '<div class="cell cell-blank"></div>',
        noResize: true,
        noMove: true
      };
      for (let i = 0; i < cols * rows; i++) {
        grid.push(default_config);
      }
      return grid;
    },
    calculateDynamicHeight() {
      // find lowest widget
      const domWidgets = document.querySelectorAll('.grid-stack-item');
      let bottomHeight = 0;
      for (const domWidget of domWidgets) {
        const bottomOfWidget = domWidget.offsetTop + domWidget.offsetHeight;
        if (bottomOfWidget > bottomHeight) {
          bottomHeight = bottomOfWidget;
        }
      }

      this.dynamic_height = bottomHeight > 0
          ? (bottomHeight + 50)
          : 0;
    },
    canEditDashboard(item) {
      return !(
          item.accountExist === false
          || item.createdBy === undefined
          || item.createdBy.id !== this.$store.getters["user/user_info"].id
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("../../../node_modules/gridstack/dist/gridstack-extra.css");

.expanded {
  z-index: 10;
}

.text-placeholder {
  display: none;
  &:hover {
    display: block;
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #66788e;
    width: 70%;
  }
}
.dashboard-page-header {
  font-family: PlayfairDisplay, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.67;
  letter-spacing: normal;
  color: #241c15;
}
.margin-10px {
  margin: 10px;
}
.grid-stack-item {
  padding: 10px;
  z-index: 10;
}
.cell {
  border: solid 1px #dee7ee;
  background-color: rgba(217, 227, 235, 0.15);
  border-radius: 4px;

  &-blank {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 21%;
    height: 175px;
  }
  &-1x1 {
    height: 175px;
  }
  &-1x1 {
    height: 175px;
  }
  &-1x2 {
    height: 370px;
  }
  &-2x1 {
    height: 175px;
  }
  &-2x2 {
    height: 370px;
  }
}
.grid-stack-placeholder > .placeholder-content {
  border-radius: 4px;
  padding: 10px;
  border: solid 1px #2b84eb !important;
  background-color: rgba(56, 113, 180, 0.11) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.73;
  letter-spacing: normal;
  text-align: center;
  color: #2b84eb;
  &:before {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.73;
    letter-spacing: normal;
    text-align: center;
    color: #2b84eb;
  }
}
.hover-block-blue {
  border: solid 1px #2b84eb;
  background-color: rgba(56, 113, 180, 0.11);
}

// popups
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

.grid-stack-item {
  padding: 0;
}

.dashboard-sub-headline {
  font-size: 16px;
  color: #241c15;
}

.dashboard-sub-headline span {
  font-weight: 600;
  color: #2b84eb;
}
</style>
