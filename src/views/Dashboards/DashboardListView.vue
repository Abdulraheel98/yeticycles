<template>
  <v-container class="mt-3 px-sm-10 px-0 elevation-0">
    <PageHeader
      header-text="Your Dashboards"
      :regular-button-text="
        $vuetify.breakpoint.smAndUp ? 'New Dashboard' : null
      "
      class="mb-7 px-3"
      :regular-button-visible="!$store.getters['user/isReadOnly'] && !$store.getters['user/isReporting']"
      @regular-button-click="dialog = true"
    >
      <template #subheader>
        Manage all of your existing dashboards or create a new one
      </template>
    </PageHeader>

    <div v-if="$vuetify.breakpoint.xsOnly" class="mobile-hint mb-5 px-3">
      To edit your dashboards, please view on desktop
    </div>

    <DashboardsTable
      v-if="$vuetify.breakpoint.smAndUp"
      :dashboards="dashboards"
      class="px-3"
      @set-default="set_default_dashboard($event.id)"
      @clone="clone = true; dashboard_to_clone = $event.id"
      @edit-dashboard="
        (dashboard) =>
          $router.push({ name: 'EditDashboard', params: { id: dashboard.id } })
      "
    />
    <DashboardsTableMobile v-else :dashboards="dashboards" />

    <v-dialog v-model="dialog" scrollable max-width="560px">
      <NewDashboardDialog
        @save="add_new_dashboard($event)"
        @dismiss="dialog = false"
      />
    </v-dialog>
    <v-dialog v-model="clone" scrollable max-width="560px">
      <NewDashboardDialog
        @save="clone_dashboard(dashboard_to_clone, $event)"
        @dismiss="clone = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeader from "@/sharedComponents/PageHeader";
import DashboardsTable from "@/views/Dashboards/components/DashboardsTable";
import DashboardsTableMobile from "@/views/Dashboards/components/DashboardsTableMobile";
import NewDashboardDialog from "@/views/Dashboards/components/NewDashboardDialog";

export default {
  name: "DasboardList",
  metaInfo: {
    title: 'Your Dashboards'
  },
  components: {
    NewDashboardDialog,
    PageHeader,
    DashboardsTable,
    DashboardsTableMobile,
  },
  data() {
    return {
      dialog: false,
      clone: false,
      dashboard_to_clone: false,
      dashboards: [],
    };
  },
  created() {
    this.get_available_dashboards();
  },
  methods: {
    async get_available_dashboards() {
      const resp = await this.$rest.dashboards.get_collection({});
      this.dashboards = resp.data.items;
    },
    async add_new_dashboard(name) {
      const created_dashboard = (await this.$rest.dashboards.post_resource({ name })).data;
      await this.$router.push({name: 'EditDashboard', params: {id: created_dashboard.id}})
    },
    async clone_dashboard(id, name){
      const created_dashboard = (await this.$rest.dashboards.clone_resource(id, name)).data;
      await this.$router.push({name: 'EditDashboard', params: {id: created_dashboard.id}})
    },

    async set_default_dashboard(id) {
      await this.$rest.user.set_default_dashboard(id);
      const selected_account = (await this.$rest.user.set_default_dashboard(id)).data;
      localStorage.setItem('defaultDashboard', JSON.stringify(selected_account.defaultDashboard))
      this.$store.commit('user/update_default_dashboard', selected_account.defaultDashboard.id)
      await this.get_available_dashboards();
    }
  },
};
</script>

<style lang="scss" scoped>
.mobile-hint {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: #66788e;
}
</style>
