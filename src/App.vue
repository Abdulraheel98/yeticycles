<template>
  <v-app id="mainApp">
    <Navigation
      v-if="!$route.meta.public"
      id="navigation"
      v-model="sideMenu"
      @toggle-side-menu="setNavigationStatus"
    />
    <Header />

    <v-main id="mainBlock">
      <v-container class="px-0 py-0" fluid>
        <v-overlay :value="$store.getters.loading" :z-index="1000">
          <v-progress-circular
            indeterminate
            size="64"
          />
        </v-overlay>
        <router-view :key="$route.path" />
        <Snackbar />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "@/sharedComponents/navigation/Navigation";
import Snackbar from "@/sharedComponents/snackbar/Snackbar";
import Header from "@/sharedComponents/header/Header";
export default {
  name: "App",
  metaInfo: {
    title: 'PEC',
    titleTemplate: '%s | Pulse Engagement Cloud'
  },
  components: {
    Header,
    Navigation,
    Snackbar,
  },
  data: () => ({
    sideMenu: true,
    navigation_width: null,
    main_left_padding: null,
    navigation_opened: false,
  }),
  async created() {
    if (localStorage.getItem('account')) {
      try {
        const selected_account = (await this.$rest.account.select_account(JSON.parse(localStorage.getItem('account')).accountId))
          .data;
        const current_account = JSON.parse(localStorage.getItem('account'));
        localStorage.setItem('account', JSON.stringify({
          ...selected_account.account,
          logo: current_account.logo,
        }));
        localStorage.setItem('defaultDashboard', JSON.stringify(selected_account.defaultDashboard))
        this.$store.commit('user/update_default_dashboard', selected_account.defaultDashboard.id)
        this.$store.commit("user/update_selected_account", {
          ...selected_account.account,
          logo: current_account.logo
        });
        this.$store.commit("user/update_roles", selected_account.roles);
      } catch (e) {
        console.error(e);
      }
    }
    if (localStorage.getItem('user')) {
      const user_details = JSON.parse(localStorage.getItem('user'));
      this.$store.commit('user/update_user_info', {
        ...user_details
      });
      this.$store.commit('user/update_roles', user_details.roles);

      await this.$store.dispatch('user/start_logout_check');
    }
  },
  mounted() {
    window.addEventListener("resize", this.recalculateBodySize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.recalculateBodySize);
  },
  methods: {
    setNavigationStatus(status) {
      this.navigation_opened = status;
    },
    recalculateBodySize() {
      const nav = document.getElementById("navigation");
      if (nav){
        const navStyle = getComputedStyle(nav);
        this.navigation_width = parseInt(navStyle.width);

        const main = document.getElementById("mainBlock");
        const mainStyle = getComputedStyle(main);
        this.main_left_padding = parseInt(mainStyle.paddingLeft);

        if (!this.navigation_opened) {
            main.style.paddingLeft = "0px";
        } else if (this.navigation_width !== this.main_left_padding) {
            main.style.paddingLeft = `${this.navigation_width}px`;
        }
      }
    },
  },
};
</script>

