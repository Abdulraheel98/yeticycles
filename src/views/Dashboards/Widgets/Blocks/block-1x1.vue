<template>
  <div class="cell cell-1x1 hover-block-blue">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "Block1x1",
  props: {
    config: {
      default: () => {},
      type: Object,
    },
    text: {
      default: ()=> 't'
    }
  },
};
</script>

