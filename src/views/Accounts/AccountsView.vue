<template>
  <v-container class="mt-5 px-10">
    <PageHeader
      header-text="Account Selection"
      :regular-button-text="
        $store.getters['user/isPulseAdmin'] ? 'NEW ACCOUNT' : null
      "
      :regular-button-visible="$store.getters['user/isPulseAdmin']"
      @regular-button-click="$router.push({name: 'NewAccount'})"
    >
      <template #subheader>
        <div v-if="$store.getters['user/user_info'].first_name.length > 0" class="mb-1">
          Hi
          <span class="name">{{ $store.getters["user/user_info"].first_name }}</span>
          , it’s nice to see you
          <img
            src="@/assets/icons/waving-hands.png"
            width="16px"
            height="16px"
          >
        </div>
        <div>Please select which account you’d like to manage</div>
      </template>
    </PageHeader>

    <v-row
      v-if="recent_accounts.length !== 0"
      class="mb-6"
    >
      <v-col>
        <recent-accounts>
          <account-card
            v-for="account in recent_accounts"
            :id="account.id"
            :key="account.id"
            :img="account.logoUrl"
            :is-active="account.isActive"
            :account-type="account.accountType"
            :name="account.name"
            @click="select_account(account.accountId, account.logoUrl)"
          />
        </recent-accounts>
      </v-col>
    </v-row>

    <template v-if="all_accounts.length > 0">
      <div class="box-head">
        All Accounts
      </div>
      <SearchFieldRowWithPagination
        v-if="isLoaded && all_accounts.length > 0"
        search-field-placeholder="Search for accounts"
        :current-page-number="1"
        :current-page-size="999"
        :count-total="all_accounts_total"
        :page-sizes="[0]"
        @search="(searchString) => onSearch(searchString)"
      >
        <v-checkbox
          v-model="is_active_filter"
          :false-value="null"
          class="search-field-row-checkbox mt-1"
          label="Only Show Active"
          @change="getAllAccounts()"
        />
      </SearchFieldRowWithPagination>
      <v-row>
        <v-col>
          <all-accounts>
            <account-card
              v-for="account in all_accounts"
              :id="account.id"
              :key="account.id"
              :img="account.logoUrl"
              :is-active="account.isActive"
              :account-type="account.accountType"
              :name="account.name"
              @click="select_account(account.accountId, account.logoUrl)"
            />
          </all-accounts>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import RecentAccounts from "@/views/Accounts/components/RecentAccounts";
import AccountCard from "@/views/Accounts/components/AccountCard";
import AllAccounts from "@/views/Accounts/components/AllAccounts";
import SearchFieldRowWithPagination from "@/sharedComponents/SearchFieldRowWithPagination";
import PageHeader from "@/sharedComponents/PageHeader";

export default {
  name: "AccountsView",
  metaInfo: {
    title: 'Accounts'
  },
  components: {
    AllAccounts,
    AccountCard,
    RecentAccounts,
    SearchFieldRowWithPagination,
    PageHeader,
  },
  data() {
    return {
      is_active_filter: null,
      all_accounts: [],
      recent_accounts: [],
      search_string: "",
      all_accounts_total: 999,
      isLoaded: false,
    };
  },
  async created() {
    await this.get_recent_accounts();
    await this.getAllAccounts();
    this.isLoaded = true;
    const user_details = (await this.$rest.user.get_user_details()).data;
    this.$store.commit("user/update_user_info", {
      ...user_details,
      accountTotal: this.available_accounts_total
    });
    this.$store.commit("user/update_roles", user_details.roles);
    localStorage.setItem('user', JSON.stringify({
      ...user_details,
      accountTotal: this.available_accounts_total,
    }));
    if (this.available_accounts_total === 1 && !this.$store.getters['user/isPulseAdmin']) {
      await this.select_account(this.all_accounts[0].accountId, this.all_accounts[0].logoUrl);
    }
  },
  methods: {
    onSearch(searchString) {
      this.search_string = searchString;
      this.getAllAccounts(searchString);
    },
    async get_recent_accounts() {
      const resp = await this.$rest.account.get_collection({
        limit: 5,
        page: 1,
        lastAccessedDate: true,
      });
      this.recent_accounts = resp.data.items;
    },
    async getAllAccounts(searchString) {
      localStorage.removeItem("account");
      localStorage.removeItem("defaultDashboard");
      this.$store.getters["user/account"].accountId = undefined;
      this.$store.commit("user/update_selected_account", undefined);
      const resp = await this.$rest.account.get_collection({
        ignorePagination: true,
        name: searchString || this.search_string,
        isActive: this.is_active_filter ? true : null,
        sort: ['name:asc'],
      });
      this.all_accounts = resp.data.items;
      this.all_accounts_total = resp.data.totalCount;
      // <= 5 then get the unique one
      if (this.all_accounts_total <= 5) {
        this.all_accounts = [
          ...resp.data.items.filter((account) => {
            return !this.recent_accounts.find((recentAccount) => recentAccount.id == account.id);
             }),
        ];
      }
    },
    async select_account(id, logo) {
      const selectedAccount = await this.$store.dispatch('user/selectAccount', id, logo);

      this.$notifier.success(`Successfully selected account ${selectedAccount.account.name}`)
      await this.$router.push(
        this.$route.query.next
          ? { path: this.$route.query.next }
          : {
              name: "DashboardView",
              params: { id: this.$store.getters["user/defaultDashboard"] },
              query: {
                accid: id,
              },
            }
      );
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .search-field-row-checkbox {
  .v-input__control {
    .v-messages {
      display: none;
    }
    .v-label {
      font-family: "Open Sans", sans-serif;
      font-size: 13px;
      font-weight: normal;
    }
    .v-icon {
      font-size: 18px;
    }
  }
}

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

span.name {
  color: #2b84eb;
  font-weight: 600;
}
</style>
