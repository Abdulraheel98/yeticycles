<template>
  <div class="cell cell-2x2 hover-block-blue" />
</template>

<script>
export default {
  name: "Block2x2",
  props: {
    config: {
      default: () => {},
      type: Object,
    },
  },
};
</script>
