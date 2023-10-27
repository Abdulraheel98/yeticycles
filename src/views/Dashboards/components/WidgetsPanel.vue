<template>
  <v-row class="widgets-row d-flex justify-center pa-0">
    <v-slide-group show-arrows>
      <div class="draggable-widget-panel d-flex">
        <div
          v-for="(item, i) in widgets"
          :key="i"
          :gs-id="item.componentName"
          :gs-h="item.height || 1"
          :gs-w="item.width || 1"
          class="widget-card-container grid-stack-item ui-draggable-disabled ui-resizable-disabled"
          style="inset: 10px !important;"
          :data-component-name="item.componentName"
          @dragstart.capture="$emit('dragstart', item)"
        >
          <v-slide-item>
            <WidgetsDragCard :widget="item" />
          </v-slide-item>
        </div>
      </div>
    </v-slide-group>
  </v-row>
</template>

<script>
import WidgetsDragCard from "@/views/Dashboards/components/WidgetsDragCard";

export default {
  name: "WidgetsPanel",
  components: {
    WidgetsDragCard,
  },
  props: {
    widgets: {
      default: () => [],
      required: true
    },
  }
};
</script>

<style lang="scss" scoped>
.widgets-row {
  background: #ecf1f5;
  height: 131px;

  .draggable-widget-panel {
    > div {
      margin: 4px 12px;
    }
  }
}
</style>
