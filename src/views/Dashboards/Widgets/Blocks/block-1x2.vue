<template>
  <div class="cell cell-1x2 hover-block-blue" />
</template>

<script>
export default {
  name: "Block1x2",
  props: {
    config: {
      default: () => {},
      type: Object,
    },
  },
};
</script>
