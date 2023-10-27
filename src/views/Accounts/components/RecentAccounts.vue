<template>
  <div>
    <div class="box-head">
      Recent
    </div>
    <div class="d-flex flex-wrap justify-center justify-sm-start">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
name: "RecentAccounts",
}
</script>

<style lang="scss" scoped>
.box-head {
    font-family: 'Open Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
    padding-bottom: 24px;
}

</style>
