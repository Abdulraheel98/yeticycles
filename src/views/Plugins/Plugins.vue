<template>
  <v-container class="mt-5 mb-15 px-10">
    <PageHeader header-text="Plugins">
      <template #subheader>
        Manage your plugins configured for this account
      </template>
    </PageHeader>

    <v-container
      v-if="account_plugins.length > 0"
      class="pa-0 d-flex flex-column align-center d-sm-block"
      :class="{ 'mobile-view': $vuetify.breakpoint.xsOnly }"
    >
      <div class="accounts-box-head mt-10 mb-3">
        Active
      </div>
      <div class="d-flex flex-wrap justify-start">
        <plugin-card
          v-for="account_plugin in account_plugins"
          :key="account_plugin.id"
          :plugin="account_plugin.plugin"
          :installed="true"
          @install="configure_plugin(account_plugin, true)"
        />
      </div>
    </v-container>

    <div class="accounts-box-head mt-10 mb-3">
      All Plugins
    </div>
    <SearchFieldRowWithPagination
      search-field-placeholder="Search for plugin"
      no-pagination
      @search="(search_string) => on_search(search_string)"
    />

    <v-container
      class="pa-0 d-flex flex-column align-center d-sm-block"
      :class="{ 'mobile-view': $vuetify.breakpoint.xsOnly }"
    >
      <div class="d-flex flex-wrap justify-start">
        <plugin-card
          v-for="plugin in (only_inactive_plugins ? inactive_plugins : plugins)"
          :key="plugin.id"
          :plugin="plugin"
          @install="configure_plugin(plugin, false)"
        />
      </div>
    </v-container>

    <v-dialog v-model="dialog" scrollable max-width="520px" max-height="90px">
      <ConfigurePluginDialog
        :plugin="selected_plugin"
        @dismiss="dialog = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import PluginCard from "@/views/Plugins/components/PluginCard";
import ConfigurePluginDialog from "@/views/Plugins/components/ConfigurePluginDialog";
import SearchFieldRowWithPagination from "@/sharedComponents/SearchFieldRowWithPagination";
import PageHeader from "@/sharedComponents/PageHeader";

export default {
  name: "PluginsView",
  metaInfo: {
    title: 'Integrations and Plugins'
  },
  components: {
    PluginCard,
    SearchFieldRowWithPagination,
    PageHeader,
    ConfigurePluginDialog,
  },
  data() {
    return {
      only_inactive_plugins: true,
      dialog: false,
      selected_plugin: null,
      plugins: [],
      account_plugins: [],
    };
  },
  computed: {
    inactive_plugins() {
      return this.plugins.filter((plugin) => {
        const accountPlugin = this.account_plugins
          .find(accountPlugin =>
            accountPlugin.plugin.componentName === plugin.componentName
          );
        if (accountPlugin) {
          return !accountPlugin.isActive;
        }

        return true;
      });
    },
  },
  async created() {
    await this.get_available_plugins();
    await this.get_account_plugins();
  },
  methods: {
    configure_plugin(plugin, installed) {
      let componentName = plugin.componentName;

      // pass plugin id
      if (installed) {
        componentName = plugin.plugin.componentName;
      }

      return this.$router.push({
        name: componentName,
        params: { id: plugin.id },
        query: { installed }
      });
    },

    on_search(search_string) {
      this.get_available_plugins({ name: search_string });
    },

    async get_available_plugins(params) {
      const resp = await this.$rest.plugins.get_plugins({
        ...params,
        ignorePagination: true,
      });
      this.plugins = resp.data.items;
    },
    async get_account_plugins(params) {
      const resp = await this.$rest.plugins.get_account_plugins({
        ...params,
        ignorePagination: true,
      });
      this.account_plugins = resp.data.items;
    },
  },
};
</script>

<style lang="scss" scoped>
.active-accounts-checkbox {
  .v-input__control {
    .v-messages {
      display: none;
    }
  }
}
.mobile-view {
  > div {
    width: 265px;
  }
}
</style>
