<template>
  <WidgetCard
    color="white"
    class="grid-stack-item-content"
    width="142"
    height="100"
    :widget="widget"
  />
</template>

<script>
import WidgetCard from "@/views/Dashboards/components/WidgetCard";

export default {
  name: "WidgetsDragCard",
  components: {
    WidgetCard
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
