<template>
  <div
    :class="'cell cell-' + config.width + 'x' + config.height + ' widget-block pa-4'"
    :wid="config.id"
    :name="config.name"
    :width="config.width"
    :height="config.height"
  >
    <div :id="'img_' +_uid" ref="canvas" class="d-flex flex-column justify-space-between" />
    <div v-if="!isDragging" :id="'elem_' +_uid" ref="content" class="d-flex flex-column justify-space-between" style="height: 100%">
      <div class="d-flex align-center">
        <div class="widget-block__title">
          {{ config.name }}
        </div>
        <template v-if="show_edit_buttons">
          <v-icon
            color="#9f9fb0"
            size="25"
            style="cursor: pointer"
            class="ml-2"
            @click="handleOpenSettings"
          >
            mdi-cog-outline
          </v-icon>
          <v-icon
            color="#9f9fb0"
            size="25"
            class="ml-2"
            style="cursor: pointer"
            @click="handleDeleteWidget"
          >
            mdi-delete-outline
          </v-icon>
        </template>
        <div class="ml-auto">
          <slot name="right-corner" />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "AppWidgetBlock",
  props: {
    name: {
      default: 'Widget Title',
      type: String,
    },
    config: {
      default: () => ({}),
      type: Object,
    },
    id: {
      default: () => false
    },
  },
  data(){
    return {
      event_source: '',
      screenshot: '',
      isDragging: false
    }
  },
  computed: {
    show_edit_buttons() {
      return window.location.pathname.includes('edit')
    }
  },
  methods: {
    onClassChange(classAttrValue) {
      const classList = classAttrValue.split(' ');
      let elem = document.querySelector(`#img_${this._uid}`).childNodes[0]
      if (classList.includes('ui-droppable-over')) {
        elem.style='display: block'
        this.isDragging = true
      } else {
        elem.style='display: none'
        this.isDragging = false
      }
    },
    handleOpenSettings() {
      this.$emit('open-settings', {
        name: this.name,
        config: this.config,
        size: this.config.width + 'x' + this.config.height,
        component: this.config?.component
      });
    },
    handleDeleteWidget() {
      this.$emit('delete-widget', this.config.id);
    },
    data_update_handler(payload){
      this.$emit('update:data', [...this.data, JSON.parse(payload.data)])
    },
  }
};
</script>

<style lang="scss" scoped>
.cell.widget-block {
  border: solid 1px #dee7ee;
  background-color: #ffffff;

  .widget-block__title {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    line-height: 15px;
    font-weight: 600;
    color: #241c15;
  }
  .legend-cube {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }
  .legend-text {
    font-family: "Open Sans", sans-serif;
    font-size: 11px;
    line-height: normal;
    color: #66788e;
  }
}
</style>
