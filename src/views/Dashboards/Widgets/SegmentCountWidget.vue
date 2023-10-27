<template>
  <AppStatBlock
    v-bind="{ config }"
    class="stat-block-info"
    :class="{'stat-block-2': !hasBackgroundColor}"
    :style="dynamicStyling"
    @open-settings="$emit('open-settings', $event)"
    @delete-widget="$emit('delete-widget', $event)"
  >
    <template #stat-number>
      {{ data.count ? data.count.toLocaleString() : 0 }}
    </template>
  </AppStatBlock>
</template>

<script>
import AppStatBlock from "@/views/Dashboards/Widgets/components/AppStatBlock";
import {dynamicBackground} from "@/mixins/dynamicBackground";

export default {
  name: "SegmentCountWidget",
  components: {
    AppStatBlock,
  },
  mixins: [dynamicBackground],
  props: {
    config: {
      default: () => ({
        size: "1x1",
        name: "Segment Count",
      }),
    },
    data: {
      default: () => ({
        count: 0
      }),
    }
  },
};
</script>

<style lang="scss" scoped>
.stat-block.stat-block-info {
  background-image: var(--bgImage);
}
</style>
