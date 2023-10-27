<template>
  <v-container class="manager-user mt-5 px-10">
    <PageHeader
      header-text="Search Actions"
      regular-button-text="Export"
    >
      <template #subheader>
        <div class="d-flex">
          <div class="flex-fill">
            Search and export actions
          </div>
        </div>
      </template>
      <template #regular-button>
        <v-btn
          v-if="!$store.getters['user/isReporting'] && selectedChannel && totalItems > 0"
          class="my-1 page-header-btn"
          width="185px"
          height="46px"
          :block="$vuetify.breakpoint.xsOnly"
          tile
          color="primary"
          @click="exportDialog = true"
        >
          {{ `Export all (${totalItems.toLocaleString()})` }}
        </v-btn>

        <v-dialog
          v-model="exportDialog"
          scrollable
          max-width="560px"
        >
          <ExportDialog
            v-if="exportDialog"
            header="Export Contacts"
            :fields-to-export="exportFields"
            @export="handleExportClick"
            @dismiss="exportDialog = false;"
          >
            <template #top>
              <div class="mb-6" style="color: #000;">
                Exporting <span class="blue-highlight-text">{{ totalItems.toLocaleString() }}</span> actions
              </div>
            </template>
          </ExportDialog>
        </v-dialog>
      </template>
    </PageHeader>

    <v-row class="justify-end mt-0">
      <v-col cols="4">
        <CustomDateRangePicker
          v-model="dateRanges"
          :format="showDateFormat"
          :max-date="new Date()"
        />
      </v-col>
    </v-row>
    <v-row class="form-container">
      <v-col cols="12" sm="4" class="py-0">
        <CustomDropdown
          v-model="selectedChannel"
          header="Channel"
          placeholder="Select a Channel first"
          :items="channels"
          item-text="title"
          item-value="value"
          autocomplete
          @change="clearSelections"
        />
      </v-col>
      <v-col
        v-if="selectedChannel === 'emails'"
        cols="12"
        sm="4"
        class="py-0"
      >
        <CustomDropdown
          v-model="selectedCampaign"
          header="Campaign"
          :items="campaigns"
          item-text="name"
          item-value="id"
          multiple
          autocomplete
          @change="handleAllValuesValue($event, 'campaign')"
        />
      </v-col>
      <v-col cols="12" sm="4" class="py-0">
        <CustomDropdown
          v-model="selectedCreative"
          header="Creative"
          :items="selectedChannel ? actionChannels[selectedChannel] : []"
          item-text="name"
          item-value="id"
          autocomplete
          multiple
          @change="handleAllValuesValue($event, 'creative')"
        />
      </v-col>
      <v-col
        v-if="selectedChannel !== 'web'"
        cols="12"
        sm="4"
        class="py-0"
      >
        <CustomDropdown
          v-model="actionTypeSelection"
          header="Action Type"
          :items="selectedChannel ? actionCodes[selectedChannel] : []"
          item-text="name"
          item-value="id"
          autocomplete
          multiple
          @change="handleAllValuesValue($event, 'actionType')"
        />
      </v-col>
      <v-col cols="12" sm="4" class="py-0">
        <CustomDropdown
          v-model="actionSourceSelection"
          header="Action Source"
          :items="sources"
          item-text="name"
          item-value="id"
          autocomplete
          multiple
          @change="handleAllValuesValue($event, 'source')"
        />
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn
          class="custom-button custom-button--blue px-13"
          height="34px"
          depressed
          :block="$vuetify.breakpoint.xsOnly"
          @click="search"
        >
          Search
        </v-btn>

        <PaginationButtons
          v-if="loadedItems !== null && loadedItems.length > 0"
          :current-page-number="currentPageNumber"
          :current-page-size="currentPageSize"
          :count-total="totalItems"
          :page-sizes="[25, 50, 100]"
          @next-page="nextPage"
          @prev-page="prevPage"
          @change-page-size="changePageSize"
        />
      </v-col>
    </v-row>

    <component
      :is="components[selectedChannel]"
      v-if="selectedChannel && loadedItems"
      :records="loadedItems"
      class="mt-4"
    />
  </v-container>
</template>

<script>
import PageHeader from "@/sharedComponents/PageHeader";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import ActionEmailTable from "@/views/Actions/components/ActionEmailTable";
import ActionBannerTable from "@/views/Actions/components/ActionBannerTable";
import ActionDirectMailTable from "@/views/Actions/components/ActionDirectMailTable";
import ActionEventTable from "@/views/Actions/components/ActionEventTable";
import ActionWebTable from "@/views/Actions/components/ActionWebTable";
import ActionFormTable from "@/views/Actions/components/ActionFormTable";
import CustomDateRangePicker from "@/sharedComponents/CustomDateRangePicker";
import dayjs from "dayjs";
import PaginationButtons from "@/sharedComponents/pagination/PaginationButtons";
import ExportDialog from "@/sharedComponents/ExportDialog";

const showDateFormat = 'MM/DD/YYYY'
const systemDateFormat = "YYYY-MM-DD";

export default {
  name: "SearchActions",
  components: {
    CustomDateRangePicker,
    CustomDropdown,
    PageHeader,
    PaginationButtons,
    ExportDialog
  },
  data: () => ({
    channels: [
      {
        title: "Email",
        value: "emails",
      },
      {
        title: "Banner",
        value: "banners",
      },
      {
        title: "Direct Mail",
        value: "directMails",
      },
      {
        title: "Event/Conferences",
        value: "events",
      },
      {
        title: "Website Views",
        value: "web",
      },
      {
        title: "Form",
        value: "forms",
      },
    ],
    actionChannels: {
      emails: [],
      banners: [],
      directMails: [],
      events: [],
      web: [],
      forms: [],
    },
    actionCodes: {
      emails: [],
      banners: [],
      directMails: [],
      events: [],
      web: [],
      forms: [],
    },
    actionCreativeParams: {
      emails: 'emailMessageId',
      banners: 'bannerCreativeId',
      directMails: 'directMailCreativeId',
      events: 'eventCreativeId',
      web: 'websiteId',
      forms: 'formId',
    },
    exportTypes: [],
    exportDialog: false,
    sources: [],
    selectedChannel: "emails",
    selectedCreative: null,
    selectedCampaign: null,
    campaigns: [],
    actionTypeSelection: null,
    actionSourceSelection: null,
    loadedItems: null,
    components: {
      emails: ActionEmailTable,
      banners: ActionBannerTable,
      directMails: ActionDirectMailTable,
      events: ActionEventTable,
      web: ActionWebTable,
      forms: ActionFormTable,
    },
    showDateFormat,
    dateRanges: null,
    currentPageNumber: 1,
    totalItems: 0,
    currentPageSize: 25,
  }),
  computed: {
    exportType() {
      let type = '';

      switch (this.selectedChannel) {
        case 'emails':
          type = 'email_action';
          break;
        case 'banners':
          type = 'banner_action';
          break;
        case 'directMails':
          type = 'direct_mail_action';
          break;
        case 'events':
          type = 'event_action';
          break;
        case 'web':
          type = 'web_action';
          break;
        case 'forms':
          type = 'form_action';
          break;
      }

      return type;
    },
    exportFields() {
      if (!this.exportType) {
        return [];
      }

      if (!this.exportTypes[this.exportType]) {
        return [];
      }
      return this.exportTypes[this.exportType]?.headers ?? [];
    },
  },
  created() {
    this.loadCreatives();
    this.loadCampaigns();
    this.loadActionCodes();
    this.loadSources();
    this.loadExportFields();
  },
  methods: {
    async loadSources() {
      this.sources = (await this.$rest.source.get_collection()).data.items;
      this.sources.unshift({id: null, name: 'All Sources'});
    },
    async loadCampaigns() {
      this.campaigns = (await this.$rest.campaign.get_collection({
        ignorePagination: true,
        sort: ["startDate:desc"],
      })).data.items.map(campaign => {
        if (!campaign.isArchived) {
          return {...campaign};
        }

        return {
          ...campaign,
          name: campaign.name + ' [Archived]',
        };
      });
      this.campaigns.unshift({id: null, name: 'All Campaigns'});
    },
    handleAllValuesValue(val, prop) {
      if (!val.includes(null)) {
        return;
      }

      if (prop === 'campaign') {
        this.selectedCampaign = null;
      }
      if (prop === 'creative') {
        this.selectedCreative = null;
      }
      if (prop === 'actionType') {
        this.actionTypeSelection = null;
      }
      if (prop === 'source') {
        this.actionSourceSelection = null;
      }
    },
    async loadCreatives() {
      const params = {
        fields: ['id', 'name', 'url', 'isArchived'],
        ignorePagination: true,
        isArchived: false
      };
      const [
        { data: bannerCreatives },
        { data: eventCreatives },
        { data: emailCreatives },
        { data: directMailCreatives },
        { data: websites },
        { data: formCreatives },
      ] = await Promise.all([
        this.$rest.banners.get_collection(params),
        this.$rest.events.get_collection(params),
        this.$rest.creative.email.get_collection(params),
        this.$rest.directmails.get_collection(params),
        this.$rest.website.get_collection(params),
        this.$rest.forms.get_collection(params),
      ]);

      const archivedMapFunc = ((creative) => {
        if (!creative.isArchived) {
          return {
            ...creative,
            name: creative.name ?? creative.url,
          };
        }

        return {
          ...creative,
          name: (creative.name ?? creative.url) + ' [Archived]',
        };
      });

      this.$set(
        this.actionChannels,
        'banners',
        [{id: null, name: 'All Creatives'}, ...bannerCreatives.items.map(archivedMapFunc)]
      );
      this.$set(
        this.actionChannels,
        'events',
        [{id: null, name: 'All Creatives'}, ...eventCreatives.items.map(archivedMapFunc)]
      );
      this.$set(
        this.actionChannels,
        'emails',
        [{id: null, name: 'All Creatives'}, ...emailCreatives.items.map(archivedMapFunc)]
      );
      this.$set(
        this.actionChannels,
        'directMails',
        [{id: null, name: 'All Creatives'}, ...directMailCreatives.items.map(archivedMapFunc)]
      );
      this.$set(
        this.actionChannels,
        'web',
        [{id: null, name: 'All Websites'}, ...websites.items.map(archivedMapFunc)]
      );
      this.$set(
        this.actionChannels,
        'forms',
        [{id: null, name: 'All Creatives'}, ...formCreatives.items.map(archivedMapFunc)]
      );
    },
    async loadExportFields() {
      this.exportTypes = (await this.$rest.exports.get_export_types({
        types: {
          'email_action': true,
          'banner_action': true,
          'direct_mail_action': true,
          'event_action': true,
        }
      })).data;
    },
    async loadActionCodes() {
      const params = {
        fields: ['id', 'name'],
        ignorePagination: true,
      };
      const [
        { data: bannerActionCodes },
        { data: eventActionCodes },
        { data: emailActionCodes },
        { data: directMailActionCodes },
        { data: formActionCodes },
      ] = await Promise.all([
        this.$rest.action_codes.getCollection({...params, tactic: 5}),
        this.$rest.action_codes.getCollection({...params, tactic: 8}),
        this.$rest.action_codes.getCollection({...params, tactic: 1}),
        this.$rest.action_codes.getCollection({...params, tactic: 2}),
        this.$rest.action_codes.getCollection({...params, tactic: 10}),
      ]);

      this.$set(this.actionCodes, 'banners', [{id: null, name: 'All Action Types'}, ...bannerActionCodes]);
      this.$set(this.actionCodes, 'events', [{id: null, name: 'All Action Types'}, ...eventActionCodes]);
      this.$set(this.actionCodes, 'emails', [{id: null, name: 'All Action Types'}, ...emailActionCodes]);
      this.$set(this.actionCodes, 'directMails', [{id: null, name: 'All Action Types'}, ...directMailActionCodes]);
      this.$set(this.actionCodes, 'forms', [{id: null, name: 'All Action Types'}, ...formActionCodes]);
    },
    async handleExportClick(details) {
      if (!this.loadedItems || !this.exportType || this.loadedItems.length <= 0) {
        return;
      }

      await this.$rest.exports.post_resource({
        "exportType": this.exportType,
        "exportData": {
          actionCodes: this.actionTypeSelection ?? [],
          creative: this.selectedCreative,
          campaign: this.selectedCampaign,
          source: this.selectedSource,
          startDate: this.startDate,
          endDate: this.endDate,
          ...details
        },
      })
      await this.$router.push({name: "ExportsView"})
    },
    async search() {
      if (!this.selectedChannel) {
        return this.$store.commit('snackbar/showMessage', {
          content: 'Please select Channel',
          color: 'error',
        });
      }

      const requestData = {
        actionCode: this.actionTypeSelection,
        source: this.actionSourceSelection,
        sort: ['actionDate:desc'],
        page: this.currentPageNumber,
        limit: this.currentPageSize,
      };

      // add creative if selected
      if (this.selectedCreative) {
        const creativeParamName = this.actionCreativeParams[this.selectedChannel];
        requestData[creativeParamName] = this.selectedCreative;
      }
      if (this.selectedCampaign && this.selectedChannel === 'emails') {
        requestData.campaignId = this.selectedCampaign;
      }

      // add date range if input
      if (this.dateRanges?.start && this.dateRanges?.end) {
        requestData.startDate = dayjs(this.dateRanges.start).format(systemDateFormat);
        requestData.endDate = dayjs(this.dateRanges.end).format(systemDateFormat);
      }

      try {
        const { data } = await this.$rest.actions[this.selectedChannel](requestData);

        this.loadedItems = [
          ...data.items.map(item => {
            // get action code name from cached list
            const actionCodeName = this.actionCodes[this.selectedChannel]?.find(
                code => code.id === item.actionCode
            )?.name || 'Unknown';

            // get creative name
            const creativeName = item.emailMessage?.name
              ?? item.banner?.name
              ?? item.directMail?.name
              ?? item.event?.name
              ?? item.website?.url
              ?? item.form?.name;

            return {
              ...item,
              actionCodeName,
              creativeName
            };
          }),
        ];
        this.totalItems = data.totalCount;
      } catch (e) {
        return this.$store.commit('snackbar/showMessage', {
          content: 'Error while loading the data, please try again',
          color: 'error',
        });
      }
    },
    clearSelections() {
      this.loadedItems = null;
      this.actionTypeSelection = null;
      this.selectedCreative = null;
      this.selectedCampaign = null;
    },
    nextPage() {
      this.currentPageNumber++;
      this.search();
    },
    prevPage() {
      this.currentPageNumber--;
      this.search();
    },
    changePageSize(pageSize) {
      this.currentPageSize = pageSize;
      this.currentPageNumber = 1;
      this.search();
    }
  },
}
</script>

<style lang="scss" scoped>
.blue-highlight-text {
  color: #2b84eb;
  font-weight: 600;
  text-decoration: none;
}
</style>