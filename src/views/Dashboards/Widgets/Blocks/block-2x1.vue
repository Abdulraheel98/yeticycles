<template>
  <div class="cell cell-2x1 hover-block-blue" />
</template>

<script>
export default {
  name: "Block2x1",
  props: {
    config: {
      default: () => {},
      type: Object,
    },
  },
};
</script>
