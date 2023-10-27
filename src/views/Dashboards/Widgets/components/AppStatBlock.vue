<template>
  <div
    :class="'stat-block cell cell-' + size"
    :name="config.name"
    :wid="config.id"
    :width="size.split('x')[0]"
    :height="size.split('x')[1]"
  >
    <div
      class="d-flex flex-column justify-space-between pa-4"
      style="height: 100%"
    >
      <div class="d-flex align-start justify-space-between">
        <div>
          <div class="stat-block__title pt-2 pb-1">
            {{ config.name }}
          </div>
          <div class="stat-block__number">
            <slot name="stat-number" />
          </div>
        </div>
        <div v-if="show_edit_buttons" class="mt--2">
          <v-icon
            color="#ffffff"
            size="25"
            style="cursor: pointer"
            @click="handleOpenSettings"
          >
            mdi-cog-outline
          </v-icon>
          <v-icon
            color="#ffffff"
            size="25"
            class="ml-2"
            style="cursor: pointer"
            @click="handleDeleteWidget"
          >
            mdi-delete-outline
          </v-icon>
        </div>
      </div>
      <slot name="stat-trend-line" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AppStatBlock",
  props: {
    name: {
      default: 'Widget Title',
      type: String,
    },
    config: {
      default: () => ({}),
      type: Object,
    },
    size: {
      default: '1x1',
      type: String
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
        size: this.size,
        component: this.config?.component
      });
    },
    handleDeleteWidget() {
      this.$emit('delete-widget', this.config.id);
    },
  }
};
</script>

<style lang="scss" scoped>
.stat-block {
  &__title {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: normal;
    color: rgba(255, 255, 255, 0.79);
  }
  &__number {
    font-family: "Open Sans", sans-serif;
    font-size: 38px;
    font-weight: 600;
    line-height: normal;
    color: #ffffff;
  }
  &__description {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    line-height: normal;
    color: #ffffff;
  }
}
.stat-block-1 {
  background-image: linear-gradient(314deg, #137fb5, #80d6d3);
}
.stat-block-2 {
  background-image: linear-gradient(325deg, #3b98a4, #3ba47a);
}
.stat-block-3 {
  background-image: linear-gradient(314deg, #dc698f, #dd6060);
}
.stat-block-4 {
  background-image: linear-gradient(317deg, #6f509f, #6a7ee0);
}
</style>
