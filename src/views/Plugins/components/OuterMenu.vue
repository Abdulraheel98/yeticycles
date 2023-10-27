<template>
  <v-list class="out-menu-white">
    <v-list-item
      class="out-menu-white__header pb-1"
      style="height: 35px; min-height: 35px"
    >
      <v-list-item-icon class="ml-0 mr-1 my-1 d-flex">
        <v-icon size="18" color="#2b84eb">
          mdi-lock-outline
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content class="py-0 mb-1">
        <v-list-item-title style="font-weight: 700">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item style="min-height: 40px">
      <v-list-item-content>
        <v-list-item-title>
          Please contact our sales team to unlock this plugin
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "OuterList",
  props: {
    title: {
      default: () => {},
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.out-menu-white {
  padding-top: 5px !important;
  background-color: white !important;
  width: 164px;

  .v-list-item {
    padding: 0 10px 0 14px;
  }

  .v-list-item__title {
    font-family: "Open Sans", sans-serif;
    font-size: 13px;
    font-weight: 400 !important;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #66788e !important;
    white-space: initial;
  }

  &__header {
    .v-list-item__title {
      font-weight: 700 !important;
      color: #241c15 !important;
    }
  }
  .v-divider.theme--light {
    background: #dee7ee;
  }
}
::v-deep {
  .menuable__content__active.v-menu__content.theme--light {
    max-width: 300px !important;
    width: 300px !important;
    min-width: 300px !important;
  }
}
</style>
