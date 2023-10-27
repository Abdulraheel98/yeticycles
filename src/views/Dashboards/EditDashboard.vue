<template>
  <v-container fluid class="dashboard-container px-sm-10 px-3">
    <PageHeader
      :header-text="dashboard.name ? ('Edit - ' + dashboard.name) : ''"
    >
      <template #subheader>
        <v-row no-gutters>
          <v-col
            v-if="dashboard.name && !$vuetify.breakpoint.xsOnly"
            :sm="8"
          >
            <a
              class="simple-text-button button--blue"
              @click="showEditDashboardDialog = true"
            >
              <v-icon size="12" color="#2b84eb">
                mdi-pencil
              </v-icon>
              Edit Name
            </a>
          </v-col>
          <v-col
            v-if="canDeleteDashboard && !$vuetify.breakpoint.xsOnly"
            class="text-md-right"
            :sm="4"
          >
            <v-btn
              class="custom-button custom-button--red-outline"
              height="34px"
              width="100px"
              depressed
              @click="deleteDashboard"
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </PageHeader>

    <div
      v-if="$vuetify.breakpoint.xsOnly"
      class="mobile-hint mb-5 px-1 mt-5"
    >
      To edit your dashboards, please view on desktop
    </div>
    <v-container
      v-else
      fluid
      class="pb-15 px-0"
    >
      <div
        id="advanced-grid"
        class="grid-stack grid-stack-4"
        style="z-index: 4;"
        @dragleave="handleDragLeaveItem"
        @dragover.capture="handleDragOver"
      >
        <v-row
          style="margin:0;"
        >
          <v-col
            v-for="i in minPlaceholders"
            :key="i"
            cols="3"
            style="padding: 10px;"
          >
            <div
              class="cell cell-blank"
              @click="startAddingWidget(i)"
            >
              <div class="text-placeholder">
                <v-icon>
                  mdi-
                </v-icon>
                Click To Add
              </div>
            </div>
          </v-col>
        </v-row>

        <div
          v-for="dashboardWidget in dashboardWidgets"
          :id="'dashboard-widget-' + dashboardWidget.id"
          :key="'dashboard-widget-' + dashboardWidget.id"
          class="grid-stack-item ui-draggable ui-resizable-disabled ui-resizable-autohide"
          :gs-x="dashboardWidget.xPosition"
          :gs-y="dashboardWidget.yPosition"
          :gs-w="dashboardWidget.width"
          :gs-h="dashboardWidget.height"
        >
          <div class="grid-stack-item-content">
            <component
              :is="dashboardWidget.component"
              :config="dashboardWidget"
              :data="dashboardWidget.data"
              @open-settings="handleOpenSettings"
              @delete-widget="handleDeleteWidget"
            />
          </div>
        </div>
      </div>
    </v-container>
    <v-dialog v-model="showEditDialog" scrollable max-width="560px">
      <EditWidgetDialog
        v-if="showEditDialog"
        :widget="widgetBeingConfigured"
        :edit-widget="dashboardWidgetBeingEdited"
        @dismiss="showEditDialog = false"
        @close="showEditDialog = false"
        @save="widget => saveWidget(widget)"
      />
    </v-dialog>
    <v-dialog v-model="showConfigureNewDialog" scrollable max-width="560px" @click:outside="undoAddingWidget">
      <EditWidgetDialog
        v-if="showConfigureNewDialog"
        :widget="widgetBeingConfigured"
        @dismiss="showConfigureNewDialog = false"
        @close="showConfigureNewDialog = false"
        @save="widget => saveWidget(widget, true)"
      />
    </v-dialog>
    <!-- dialog opens after drop -->
    <v-dialog v-model="showAddNewDialog" scrollable max-width="560px" @click:outside="undoAddingWidget">
      <WidgetSelectionDialog
        v-if="showAddNewDialog"
        :widgets="availableWidgets"
        @dismiss="showAddNewDialog = false"
        @close="showAddNewDialog = false"
        @save="setConfigureNewWidget"
      />
    </v-dialog>
    <v-dialog v-model="showEditDashboardDialog" scrollable max-width="560px">
      <NewDashboardDialog
        :dashboard-name="dashboard.name"
        title="Edit Dashboard Name"
        @save="editDashboard"
        @dismiss="showEditDashboardDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="isShowingConfirmDelete" scrollable max-width="560px">
      <v-card class="popup-card">
        <v-card-title class="px-6 pt-4 pb-4">
          Delete dashboard confirmation
        </v-card-title>
        <v-divider />
        <v-card-text class="px-6 pt-5">
          <p>
            Are you sure you want to delete this dashboard? This action can't be undone.
          </p>
          <v-card-actions class="d-flex justify-end align-center pa-0 mt-5">
            <div class="simple-text-button button--gray px-9" @click="isShowingConfirmDelete = false">
              No
            </div>
            <v-btn
              class="custom-button custom-button--blue"
              height="34px"
              width="100px"
              depressed
              @click="submitDeleteDashboard"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import "gridstack/dist/gridstack.min.css";
import { debounce } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
// OR to get legacy jquery-ui drag&drop (support Mobile touch devices, h5 does not yet)
import EditWidgetDialog from "@/views/Dashboards/components/EditWidgetDialog";
import WidgetSelectionDialog from "@/views/Dashboards/components/WidgetSelectionDialog";
import NewDashboardDialog from "@/views/Dashboards/components/NewDashboardDialog";

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
  name: "EditDashboard",
  metaInfo: {
    title: 'Edit Dashboard'
  },
  components: {
    PageHeader,
    WidgetSelectionDialog,
    EditWidgetDialog,
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
    NewDashboardDialog,
  },
  props: {
    id: {
      default: () => 1,
      type: [Number, String]
    }
  },
  data() {
    return {
      drag_over: false,
      drag_in_progress: false,
      draggable_object: false,
      widgetBeingConfigured: {},
      dashboardWidgetBeingEdited: {},
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
      grid_config: {},
      grid_scheme: [],
      grid_selector: "#advanced-grid",
      availableWidgets: [],
      showEditDialog: false,
      showAddNewDialog: false,
      showConfigureNewDialog: false,
      showEditDashboardDialog: false,
      dashboard: {},
      isLoadingGrid: false,
      dashboardWidgets: [],
      positionToAddWidgetTo: {},
      cellHeight: 195,
      minimumRows: 0,
      isShowingConfirmDelete: false,
    };
  },
  computed: {
    minPlaceholders() {
      return this.minimumRows * 4;
    },
    canDeleteDashboard() {
      return !(
        this.dashboard.accountExist === false
        || this.dashboard.createdBy === undefined
        || this.dashboard.createdBy.id !== this.$store.getters["user/user_info"].id
      );
    },
  },
  async created() {
    this.isLoadingGrid = true;
    await this.get_dashboard_info(this.id);

    if (!this.dashboard.createdBy || this.dashboard.createdBy.id !== this.$store.getters["user/user_info"].id) {
      await this.$router.push({name: 'DashboardList'})
    }

    await this.get_dashboard_widgets(this.id);

    this.isLoadingGrid = false;

    await this.init_grid();

    await this.get_available_widgets();
  },
  methods: {
    save_dashboard() {
      this.$router.push({name: 'DashboardList'})
    },
    undoAddingWidget() {
      this.showAddNewDialog = false
      this.widgetBeingConfigured = {}
      this.positionToAddWidgetTo = {}
    },
    handleDragOver: debounce(
      function(i) {
        const placeholderContent = document.querySelector(".grid-stack-placeholder > .placeholder-content")
        if (!placeholderContent) {
          return;
        }

        placeholderContent.innerHTML = `${this.draggable_object.name}<br/><br/>${this.draggable_object.width}x${this.draggable_object.height}`;

        this.drag_over = i;
      },
      100,
      {leading: true}
    ),
    init_grid() {
      this.grid_config = this.generate_grid_config(4);
      this.grid = GridStack.init(this.grid_config, this.grid_selector);
      this.grid.enableResize(false, false);
      window.grid = this.grid;

      // This event gets triggered when widgets are moved - so it's able to detect when multiple widgets move
      this.grid.on('change', (e) => {
        if (!e.detail || !e.detail.length) {
          return;
        }

        e.detail.forEach(async (changedWidget) => {
          const dashboardWidgetId = changedWidget.el.childNodes[0].childNodes[0].getAttribute('wid');
          let changedDashboardWidget = [...this.dashboardWidgets].find(i => i.id == dashboardWidgetId)

          changedDashboardWidget.xPosition = changedWidget.x;
          changedDashboardWidget.yPosition = changedWidget.y;

          try {
            await this.saveWidget(changedDashboardWidget)
          } catch (e) {
            console.error(e);
          }
        })
      });

      this.grid.on("dragstart", (e) => {
        this.drag_in_progress = true
        this.draggable_object = {};
        this.draggable_object.name = e.target.childNodes[0].childNodes[0].getAttribute('name')
        this.draggable_object.width = e.target.childNodes[0].childNodes[0].getAttribute('width')
        this.draggable_object.height = e.target.childNodes[0].childNodes[0].getAttribute('height')
      })
    },
    handleOpenSettings(component) {
      const widgetBeingEdited = component.config;

      const configuration = widgetBeingEdited.account_config ? widgetBeingEdited.account_config : widgetBeingEdited.configuration;
      const widgetBeingConfigured = cloneDeep(this.availableWidgets.find(item => item.componentName === widgetBeingEdited.componentName));

      if (configuration) {
        for (let [key, item] of Object.entries(configuration)) {
          if (item) {
            widgetBeingConfigured.widgetConfig[key].value = item;
          }
        }
      }
      widgetBeingConfigured.configuration = {...configuration};

      this.widgetBeingConfigured = widgetBeingConfigured;
      this.dashboardWidgetBeingEdited = widgetBeingEdited;

      this.showEditDialog = true;
    },
    async handleDeleteWidget(id) {
      await this.$rest.dashboards.delete_widget(id);

      const index = this.dashboardWidgets.findIndex(i => i.id == id);
      if (index !== -1) {
        this.grid.removeWidget('#dashboard-widget-' + id);
        this.$delete(this.dashboardWidgets, index);
      }

      this.calculateMinRows();
    },
    async get_available_widgets() {
      const resp = await this.$rest.dashboards.get_available_widgets();
      this.availableWidgets = [];

      resp.data.items.forEach((item) => {
        if (item.componentName && this.widgets_library.widgets[item.componentName]) {
          this.availableWidgets.push(item)
        }
      })
    },
    async get_dashboard_widgets(id) {
      this.dashboardWidgets = [];
      const resp = await this.$rest.dashboards.get_widgets(id);

      this.dashboardWidgets = this.prepareDashboardWidgets(resp.data);
    },
    prepareDashboardWidgets(apiData) {
      const widgets = apiData.filter((elem) => {
        return this.widgets_library.widgets[elem.componentName] !== undefined;
      });
      widgets.forEach(async (elem) => {
        elem.data = {};
        elem.component = this.widgets_library.widgets[elem.componentName];
        elem.configuration = elem.widget_config;
        delete elem.widget_config;

        if (!this.dashboardWidgets.find(i => i.id == elem.id)) {
          const dataResp = await this.$rest.dashboards.get_dashboard_widget_data(elem.id);
          elem.data = dataResp.data.data;
        }
      });
      widgets.sort((a, b) => {
        if (a.yPosition > b.yPosition) {
          return -1;
        }
        if (a.xPosition > b.xPosition) {
          return -1;
        }

        return 0;
      });

      return widgets;
    },
    async get_dashboard_info(id) {
      const resp = await this.$rest.dashboards.get_resource(id);
      this.dashboard = resp.data;
    },
    async saveWidget(widget, isNew = false) {
      if (!isNew) {
        widget.xPosition = parseInt(widget.xPosition);
        widget.yPosition = parseInt(widget.yPosition);

        widget.updateKey = widget.update_key

        await this.$rest.dashboards.update_widget(widget)

        const index = this.dashboardWidgets.findIndex(i => i.id == widget.id);
        if (index !== -1) {
          const dataResp = await this.$rest.dashboards.get_dashboard_widget_data(widget.id)
          widget.data = dataResp.data.data

          this.$set(this.dashboardWidgets, index, widget);
        }

        this.calculateMinRows();
        return;
      }

      let x = this.positionToAddWidgetTo.x;
      if (x + widget.width > 4) {
        // The widget widget goes past what's allowed by the columns, adjust the x position to make up for it
        x = 4 - widget.width;
      }

      const body = {
        widgetId: String(widget.id),
        name: widget.name,
        configuration: widget.configuration,
        xPosition: x,
        yPosition: this.positionToAddWidgetTo.y,
      };
      const resp = await this.$rest.dashboards.add_widget(this.id, body);
      let addedWidget = resp.data;
      addedWidget.componentName = addedWidget.widget.componentName;
      addedWidget.width = addedWidget.widget.width;
      addedWidget.height = addedWidget.widget.height;
      addedWidget.widget_id = addedWidget.widget.id;
      addedWidget.widget_config = {...widget.configuration};

      addedWidget = this.prepareDashboardWidgets([addedWidget]);

      this.$set(this.dashboardWidgets, this.dashboardWidgets.length, addedWidget[0]);

      this.$nextTick(() => {
        this.grid.makeWidget('#dashboard-widget-' + resp.data.id);
        this.grid.movable('#dashboard-widget-' + resp.data.id, true);
        this.grid.resizable('#dashboard-widget-' + resp.data.id, false);

        this.calculateMinRows();
      })
    },
    createWidgetConfiguration(widgetConfig) {
      if (!widgetConfig) {
        return {};
      }

      let config = {};
      for (let [key, item] of Object.entries(widgetConfig)) {
        if (item.value) {
          config[key] = item.value;
        } else if (item.defaultValue) {
          config[key] = item.defaultValue;
        } else {
          config[key] = '';
        }
      }
      return config;
    },
    calcY(num) {
      return num * 1; //Because y axis measure is equal to CellHeight
    },
    calculateMinRows() {
      // find lowest widget
      const domWidgets = document.querySelectorAll('.grid-stack-item');

      let highestRow = 0;
      for (const domWidget of domWidgets) {
        const row = parseInt(domWidget.getAttribute('gs-y')) + parseInt(domWidget.getAttribute('gs-h'));

        if (highestRow < row) {
          highestRow = row;
        }
      }

      // Add one row so there's always 1 row after the last widget
      highestRow ++;

      if (highestRow * this.cellHeight <= window.innerHeight) {
        // The highest row doesn't use the browser's height so lets calculate how many rows
        // are needed to take full height. It's ok to go over by one row if necessary
        highestRow =  Math.ceil(window.innerHeight / this.cellHeight);
      }

      this.minimumRows = highestRow;
    },
    generate_grid_config(cols) {
      let elem = document.querySelector(`${this.grid_selector}`);
      //remove old class with grid count
      elem.classList.value =
        elem.classList.value.replace(/grid-stack-[\d+]/g, "") +
        `grid-stack-${cols}`;

      this.calculateMinRows();
      return {
        column: cols,
        cellHeight: this.cellHeight + "px", // minimum size when height of block equals 1. Should be high as much as possible, small value (1px) may cause performance issues
        minRow: this.minimumRows,
        float: true, // Option to correctly flow added widgets
      };
    },
    handleDragLeaveItem() {
      this.drag_over = false;
    },
    startAddingWidget(blankNumClicked) {
      const blankNum = parseInt(blankNumClicked) - 1;
      this.positionToAddWidgetTo = {
        x: blankNum < 4 ? blankNum : (blankNum % 4),
        y: Math.floor(blankNum / 4)
      };

      this.showAddNewDialog = true;
    },
    setConfigureNewWidget(selectedWidget) {
      this.widgetBeingConfigured = selectedWidget;
      this.widgetBeingConfigured.configuration = this.createWidgetConfiguration(this.widgetBeingConfigured?.widgetConfig);

      this.dashboardWidgetBeingEdited = {};
      this.showConfigureNewDialog = true;
    },
    editDashboard(newName) {
      this.$rest.dashboards.put_resource(this.dashboard.id, {
        name: newName
      }).then(() => {
        this.dashboard.name = newName;
        this.showEditDashboardDialog = false;
      });
    },
    deleteDashboard() {
      if (!this.canDeleteDashboard) {
        return;
      }

      // show confirmation
      this.isShowingConfirmDelete = true;
    },
    async submitDeleteDashboard() {
      if (!this.canDeleteDashboard) {
        return;
      }

      try {
        await this.$rest.dashboards.delete_resource(this.dashboard.id);

        this.$store.commit('snackbar/showMessage', {
          color: "info",
          content: "Dashboard deleted successfully!",
        });

        // back to dashboard list
        await this.$router.replace({name: "DashboardList"});
      } catch (e) {
        this.$store.commit('snackbar/showMessage', {
          color: "error",
          content: "Failed while trying delete the dashboard, please try again",
        });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import url("../../../node_modules/gridstack/dist/gridstack-extra.css");

.expanded {
  z-index: 10;
}

.margin-10px {
  margin: 10px;
}
.grid-stack-item {
  padding: 10px;
  z-index: 10;

  .grid-stack-item-content{
    position: relative !important;;
    inset: 0 !important;
  }
}
.cell {
  border: solid 1px #dee7ee;
  background-color: rgba(217, 227, 235, 0.15);
  border-radius: 4px;
  height: 175px;

  &-blank {
    display: flex;
    justify-content: center;
    align-items: center;

    .text-placeholder {
      display: none;
      font-family: "Open Sans", sans-serif;
      color: #2b84eb;
    }

    &:hover {
      cursor: pointer;
      border: solid 1px #2b84eb !important;
      background-color: rgba(56, 113, 180, 0.11) !important;

      .text-placeholder {
        display: block;
      }
    }
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
#advanced-grid::v-deep .grid-stack-placeholder .placeholder-content {
  border-radius: 4px;
  border: solid 1px #2b84eb !important;
  background-color: rgba(56, 113, 180, 0.11) !important;
  justify-content: center;
  align-items: center;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #2b84eb;
  padding: 20px;
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
</style>
