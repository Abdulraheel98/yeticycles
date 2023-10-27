<template>
  <div class="widget__image-container">
    <img v-if="widget.componentName === 'app.widget.geographicheatmapwidget'" src="@/assets/widgets/bitmap.png" height="44px" width="71px" alt="">
    <img v-else-if="widget.componentName === 'app.widget.topemaildomainswidget'" src="@/assets/widgets/pie-2.png" height="38px" width="38px" alt="">
    <div 
      v-else-if="widget.componentName === 'app.widget.campaigncountwidget'" 
      class="widget__image widget-card--violet"
    >
      8
    </div>
    <div 
      v-else-if="widget.componentName === 'app.widget.emailcountwidget'" 
      class="widget__image widget-card--crimson"
    >
      65
    </div>
    <div 
      v-else-if="widget.componentName === 'app.widget.segmentcountwidget'" 
      class="widget__image widget-card--green"
    >
      4
    </div>
    <div 
      v-else-if="widget.componentName === 'app.widget.contactcountwidget'" 
      class="widget__image widget-card--blue"
    >
      479
    </div>
    <img v-else-if="widget.componentName === 'app.widget.contactbestdaywidget'" src="@/assets/widgets/pie-2.png" height="38px" width="38px" alt="">
    <img v-else-if="widget.componentName === 'app.widget.contentpreferencewidget'" src="@/assets/widgets/pie-1.png" height="38px" width="38px" alt="">
    <img v-else-if="widget.componentName === 'app.widget.latestemailstatisticswidget'" src="@/assets/widgets/pie-1.png" height="38px" width="38px" alt="">
    <img v-else-if="widget.componentName === 'app.widget.bannerstatisticswidget'" src="@/assets/widgets/pie-1.png" height="38px" width="38px" alt="">
    <img v-else-if="widget.componentName === 'app.widget.emailtimelinewidget'" src="@/assets/widgets/pie-2.png" height="38px" width="38px" alt="">
  </div>
</template>

<script>

export default {
  name: "WidgetCardImage",
  components: {},
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
.widget {
  &__image-container {
    height: 55.6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Roboto", sans-serif;
  }
  
  &__image {
    font-size: 38px;
    line-height: 40px;
    font-weight: 800;
    background-image: linear-gradient(302deg, #137fb5, #80d6d3);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &--blue {
    background-image: linear-gradient(302deg, #137fb5, #80d6d3);
  }
  &--green {
    background-image: linear-gradient(325deg, #3b98a4 86%, #3ba47a 13%);
  }
  &--crimson {
    background-image: linear-gradient(314deg, #dc698f, #dd6060);
  }
  &--violet {
    background-image: linear-gradient(317deg, #6f509f, #6a7ee0);
  }
}
</style>
