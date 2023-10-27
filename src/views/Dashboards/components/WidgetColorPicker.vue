<template>
  <div class="d-flex my-2">
    <div
      v-for="(item, index) in colors"
      :key="index"
      class="color-pick mr-2"
      :style="`background: ${item.code}`"
      :class="{ 'color-pick--selected': selected_color === item.name }"
      @click="on_color_pick(item.name)"
    />
  </div>
</template>

<script>
export default {
  name: "WidgetColorPicker",
  props: {
    color: {
      default: () => "red",
    },
  },
  data() {
    return {
      colors: [
        { name: "blue", code: "#2b84eb" },
        { name: "red", code: "#dc6475" },
        { name: "violet", code: "#6d66bf" },
        { name: "green", code: "#3b9e8d" },
        { name: "light-blue", code: "#79d0d1" },
        { name: "orange", code: "#e1774a" },
      ],
      selected_color: null,
    };
  },
  mounted() {
    this.selected_color = this.color;
  },
  methods: {
    on_color_pick(name) {
      this.selected_color = name;
      this.$emit("pick-color", name);
    },
  },
};
</script>

<style lang="scss" scoped>
.color-pick {
  height: 27px;
  width: 27px;
  cursor: pointer;
  border-radius: 50%;
  border: solid 1px white;

  &--selected {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
    border: solid 3px #ffffff;
  }
}
</style>