<template>
  <v-card color="white" class="widget-card" @click="$emit('click', widget)">
    <div
      class="d-flex flex-column align-center justify-space-between"
      style="height: 100%"
    >
      <div class="widget-card__title">
        {{ widget.name }}
      </div>
      <WidgetCardImage :widget="widget" />

      <div class="widget-card__size">
        {{ `${widget.width} × ${widget.height}` || '1 × 1' }}
      </div>
    </div>
  </v-card>
</template>

<script>
import WidgetCardImage from "@/views/Dashboards/components/WidgetCardImage";

export default {
  name: "WidgetCard",
  components: {
    WidgetCardImage
  },
  props: {
    widget: {
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.widget-card {
  padding: 8px 2px 4px;
  border-radius: 2px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
  border: solid 1px #dee7ee;
  background-color: #ffffff;
  cursor: pointer;

  &__title {
    font-size: 11px;
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    line-height: normal;
    text-align: center;
    color: #66788e;
  }
  &__size {
    font-size: 11px;
    font-family: "Open Sans", sans-serif;
    line-height: normal;
    text-align: center;
    color: #66788e;
  }
}
</style>
