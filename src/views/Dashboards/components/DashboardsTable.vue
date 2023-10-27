<template>
  <div class="dashboards-table">
    <v-simple-table>
      <thead>
        <tr class="dashboards-table__header">
          <th>Dashboard Name</th>
          <th>Date Created</th>
          <th>Created By</th>
          <th>Widgets</th>
          <th />
          <th />
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in dashboards" :key="i">
          <td class="dashboards-table__header">
            <v-icon
              v-if="is_default_dashboard_id(item)"
              class="star-icon"
              size="14"
              color="#e4a61a"
            >
              mdi-star
            </v-icon>
            {{ item.name }}
          </td>
          <td class="dashboards-table__text">
            <div v-if="item.accountExist" :title="getDateWithDayNameAndTime(item.createdAt)">
              {{ getDate(item.createdAt) }}
            </div>
            <div v-else>
              Auto Generated
            </div>
          </td>
          <td class="dashboards-table__text">
            {{ item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : 'Pulse Health' }}
          </td>
          <td class="dashboards-table__text">
            {{ `${item.dashboardWidgetCount} widgets` }}
          </td>
          <td>
            <div
              v-if="!is_default_dashboard_id(item)"
              class="simple-text-button button--blue d-flex justify-end"
              @click="$emit('set-default', item)"
            >
              <v-icon size="12" color="#2b84eb" class="mr-1">
                mdi-star-outline
              </v-icon>
              <div>Set default</div>
            </div>
          </td>
          <td>
            <div
              v-if="canCloneDashboard(item)"
              class="simple-text-button button--blue d-flex justify-end"
              :class="{ 'toggle-to-right': $vuetify.breakpoint.mdAndUp }"
              @click="$emit('clone', item)"
            >
              <v-icon size="12" color="#2b84eb" class="mr-1">
                $copy
              </v-icon>
              <div>Clone</div>
            </div>
          </td>

          <td>
            <div
              v-if="can_edit_dashboard(item)"
              :block="$vuetify.breakpoint.xsOnly"
              class="simple-text-button button--blue"
              @click="$emit('edit-dashboard', item)"
            >
              <v-icon size="12" color="#2b84eb">
                mdi-pencil
              </v-icon>
              Edit
            </div>
            <div
              v-else
              :block="$vuetify.breakpoint.xsOnly"
              class="simple-text-button button--gray"
            >
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >Edit</span>
                </template>
                <span>
                  You cannot customize dashboards you did not create. In order to make changes, first make a clone of the dashboard.
                </span>
              </v-tooltip>
            </div>
          </td>
          <td>
            <v-btn
              class="elevation-0 outlined-btn px-lg-10 px-xl-15 ml-5 ml-lg-10 ml-xl-20"
              height="34px"
              plain
              @click="$router.push({name: 'DashboardView', params: {id: item.id}})"
            >
              View
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import datesMixin from "@/utils/datesMixin.js";

export default {
  name: "DashboardsTable",
  components: {},
  mixins: [datesMixin],
  props: {
    dashboards: {
      default: () => [],
      type: Array,
    },
  },
  methods: {
    can_edit_dashboard(item) {
      return !(
        item.accountExist === false
        || item.createdBy === undefined
        || item.createdBy.id !== this.$store.getters["user/user_info"].id
      );
    },
    canCloneDashboard(item) {
      // accountNotExists => system => can clone
      // createdBy the same logged in user => can clone
      return !item.accountExist || item.createdBy.id === this.$store.getters["user/user_info"].id;
    },
    is_default_dashboard_id(item) {
      return (item.id === JSON.parse(localStorage.getItem('defaultDashboard'))?.id)
    }
  }
};
</script>

<style lang="scss">
.dashboards-table {
  &__header {
    font-size: 13px !important;
    color: #241c15 !important;
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    th {
      font-size: 13px !important;
      color: #241c15 !important;
      font-family: "Open Sans", sans-serif;
      font-weight: 600;
    }
  }
  &__text {
    font-size: 13px !important;
    color: #241c15 !important;
    font-family: "Open Sans", sans-serif;

    &--blue {
      font-size: 13px !important;
      color: #2b84eb !important;
      font-weight: 600;
      font-family: "Open Sans", sans-serif;
    }
  }
  .star-icon {
    position: absolute;
    margin-left: -35px;
    margin-top: 3px;
  }
  .align-button-to-right {
    text-align: right;
    width: 150px;
  }
  .toggle-to-right {
    margin-left: 6vw;
  }

  thead {
    tr > th {
      border-bottom: solid 1px #dee7ee !important;
    }
  }
  tbody {
    // table border colors
    tr {
      height: 77px !important;
      td {
        .simple-text-button {
          font-weight: 400;
        }
        border-bottom: solid 1px #dee7ee;
      }
    }
    tr:hover {
      background: inherit !important;
    }
  }
}
</style>
