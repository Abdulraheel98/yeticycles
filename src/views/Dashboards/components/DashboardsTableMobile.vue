<template>
  <div class="dashboards-mobile-table">
    <div
      v-for="(item, i) in dashboards"
      :key="i"
      class="dashboards-mobile-table__item py-4 px-8"
    >
      <v-icon
        v-if="item.isDefault"
        class="star-icon-mobile"
        size="14"
        color="#e4a61a"
      >
        mdi-star
      </v-icon>
      <div class="dashboards-mobile-table__name mb-1">
        {{ item.name }}
      </div>
      <div class="dashboards-mobile-table__description d-flex">
        <div v-if="item.accountExist" :title="getDateWithDayNameAndTime(item.createdAt)">
          {{ getDate(item.createdAt) }}
        </div>
        
        <div v-else>
          Auto Generated
        </div>


        <div class="px-2">
          |
        </div>
        <div>{{ item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : 'Pulse Health' }}</div>
        <div class="px-2">
          |
        </div>
        <div>{{ `${item.dashboardWidgetCount} widgets` }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import datesMixin from "@/utils/datesMixin.js";

export default {
  name: "DashboardsTableMobile",
  mixins: [datesMixin],
  props: {
    dashboards: {
      default: () => [],
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboards-mobile-table {
  &__item {
    width: 100%;
    border-top: 1px solid #dee7ee;
  }
  &__item:last-child {
    border-bottom: 1px solid #dee7ee;
  }
  &__name {
    font-size: 15px;
    color: #241c15;
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    line-height: normal;
  }
  &__description {
    font-size: 12px;
    color: #66788e;
    font-family: "Open Sans", sans-serif;
    line-height: normal;
  }
  .star-icon-mobile {
    position: absolute;
    margin-left: -22px;
    margin-top: 3px;
  }
}
</style>
