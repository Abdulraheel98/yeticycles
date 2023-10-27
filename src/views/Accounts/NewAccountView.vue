<template>
  <v-container class="new-account mt-5 px-10">
    <PageHeader header-text="New Account" class="mb-7">
      <template #subheader>
        <div>Fill out the form below to create a new account</div>
      </template>
    </PageHeader>

    <div class="d-flex align-center mb-7">
      <div v-if="!account_fields.logoFile" class="upload-background d-flex align-center justify-center" @click="$refs.logo_container.click()">
        <input ref="logo_container" type="file" accept=".jpg, .jpeg, .png" style="width: 0; height: 0" @change="handle_file_upload">
        <v-icon size="18" color="66788e">
          mdi-upload-outline
        </v-icon>
      </div>
      <div v-else class="upload-background d-flex align-center justify-center">
        <img ref="logo_preview" style="max-width: 92px; max-height: 92px;">
        <v-icon size="24" color="warning" style="position: absolute" @click="account_fields.logoFile = null">
          mdi-close
        </v-icon>
      </div>
      <div>
        <div class="title-text mb-1">
          Logo
        </div>
        <div class="text-field-hint">
          Choose your account’s logo that will be visible to other users
        </div>
      </div>
    </div>

    <validation-observer v-slot="{ invalid }">
      <v-row class="py-0">
        <v-col cols="12" sm="4" class="py-0">
          <CustomTextInput
            v-model="account_fields.name"
            header="Account Name"
            placeholder="My Account"
          />
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <CustomDropdown
            :value="account_fields.accountType"
            header="Account Type"
            placeholder="HCP / Patient"
            :items="accountTypes"
            @change="change_account_type_and_default_values($event)"
          />
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <CustomDatePicker
            :date="account_fields.subscriptionStartDate"
            placeholder="Pick the date"
            header="Subscription Start Date"
            @input="(date) => (account_fields.subscriptionStartDate = date)"
          />
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="12" sm="4" class="py-0">
          <CustomDropdown
            v-model="account_fields.subscriptionTerm"
            header="Subscription Term"
            placeholder="Select an option"
            :items="subscriptionTerms"
          />
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <CustomDropdown
            v-model="account_fields.passwordStrengthLevel"
            header="Required Password Strength"
            placeholder="Select an option"
            :items="passwordStrengthLevels"
          />
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-8" />
      <!-- custom fields  -->
      <div
        class="d-flex flex-wrap flex-sm-nowrap align-center mb-3 mb-sm-7 justify-center justify-sm-space-between justify-lg-start"
      >
        <div class="field__subheader">
          Add any custom fields you’d like to use within this account
        </div>
        <div
          class="simple-text-button button--blue mx-10 mx-sm-0 ml-lg-9 mt-4 mt-sm-0"
          @click="add_custom_field"
        >
          <v-icon color="#2b84eb" size="16" class="mr-0">
            mdi-plus
          </v-icon>
          Add Field
        </div>
      </div>
      <CustomFields
        :custom_fields="custom_fields"
        @action="(item, field) => handle_action(item, field)"
      />
      <v-divider class="mt-4 mb-8" />
      <div class="text-center mb-5">
        Account Settings
      </div>
      <div class="field__header">
        KPI Email
      </div>
      <v-row class="py-0">
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.min_open_rate"
            header="Min Open Rate"
            placeholder="Min Open Rate"
            decimal
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.max_open_rate"
            header="Max Open Rate"
            placeholder="Max Open Rate"
            decimal
          />
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.min_click_rate"
            header="Min Click Rate"
            placeholder="Min Click Rate"
            decimal
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.max_click_rate"
            header="Max Click Rate"
            placeholder="Max Click Rate"
            decimal
          />
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.min_ctor"
            header="Min CTOR"
            placeholder="Min CTOR"
            decimal
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.email.max_ctor"
            header="Max CTOR"
            placeholder="Max CTOR"
            decimal
          />
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-8" />
      <div class="field__header">
        KPI Banner
      </div>
      <v-row class="py-0">
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.banners.min_click_rate"
            header="Min Click Rate"
            placeholder="Min Click Rate"
            decimal
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CustomTextInput
            v-model="account_fields.kpiSettings.banners.max_click_rate"
            header="Max Click Rate"
            placeholder="Max Click Rate"
            decimal
          />
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-8" />
      <v-row class="mt-10">
        <v-col cols="12" sm="6">
          <div class="field__header mb-5">
            Lead Score Look Back Period
          </div>
          <div class="py-0">
            <v-col cols="12" class="py-0 px-0">
              <CustomTextInput
                v-model="account_fields.leadScoreLookBackPeriod"
                type="number"
                hint="This represents the number of months that the lead score calculation will look back when calculating scores."
              />
            </v-col>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-8" />
      <v-row class="mt-10">
        <v-col cols="12" sm="6">
          <div class="field__header mb-5">
            Tactic List
          </div>
          <div class="ml-4">
            <v-checkbox v-for="(item, index) in tactic_lists_with_values" :key="index" v-model="tactic_lists_with_values[index].value">
              <div slot="label" class="ml-2">
                <!--Here we hardcode path to statistic query schema for getting label to display-->
                <span class="point-text">{{ item.name }}</span>&nbsp;
              </div>
            </v-checkbox>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-8" />
      <v-row class="mt-12 mb-10">
        <v-col cols="12" class="d-flex justify-end flex-wrap">
          <v-btn
            v-if="newAccount"
            class="custom-button mr-2 px-5"
            height="34px"
            outlined
            :block="$vuetify.breakpoint.xsOnly"
            @click="newAccountDialog = true"
          >
            View Account Creation Status
          </v-btn>
          <v-btn
            v-if="!newAccountFailed"
            class="custom-button custom-button--blue px-13"
            height="34px"
            depressed
            :disabled="!!newAccount || invalid"
            width="150px"
            :block="$vuetify.breakpoint.xsOnly"
            @click="save_account"
          >
            {{ newAccount ? 'Creating Account' : 'Create Account' }}
          </v-btn>
          <v-btn
            v-if="newAccountFailed"
            class="custom-button custom-button--blue px-13"
            height="34px"
            depressed
            width="150px"
            :block="$vuetify.breakpoint.xsOnly"
            :disabled="invalid"
            @click="newAccountFailed = false; newAccountDialog = false; newAccount = null;"
          >
            Creation Failed - Retry
          </v-btn>
        </v-col>
      </v-row>
    </validation-observer>

    <v-dialog v-model="dialog" scrollable max-width="560px">
      <AddOrEditCustomFieldDialog
        v-if="dialog"
        :field="active_custom_field"
        :existed-name="existedName"
        @dismiss="dialog = false"
        @save="(data) => save_custom_field(data)"
      />
    </v-dialog>

    <v-dialog v-model="newAccountDialog" scrollable max-width="560px">
      <NewAccountStatusDialog
        v-if="newAccountDialog"
        :account="newAccount"
        @update="(status) => newAccount.status = status"
        @dismiss="newAccountDialog = false"
        @failed="(errMsg) => { newAccountFailed = true; newAccount.failedMessage = errMsg; }"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeader from "@/sharedComponents/PageHeader";
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import CustomDatePicker from "@/sharedComponents/CustomDatePicker";
import CustomFields from "@/views/Accounts/components/CustomFields";
import AddOrEditCustomFieldDialog from "@/views/Accounts/components/AddOrEditCustomFieldDialog";
import NewAccountStatusDialog from "@/views/Accounts/components/NewAccountStatusDialog";
import {parseImageFileToBase64} from "@/utils/helper";
import dayjs from "dayjs";

export default {
  name: "NewAccountView",
  metaInfo: {
    title: 'Create Account'
  },
  components: {
    PageHeader,
    CustomTextInput,
    CustomDropdown,
    CustomDatePicker,
    CustomFields,
    AddOrEditCustomFieldDialog,
    NewAccountStatusDialog,
  },
  data() {
    return {
      logo_preview: '',
      account_fields: {
        logoFile: null,
        name: null,
        accountType: 'HCP',
        subscriptionTerm: 12,
        passwordStrengthLevel: "3",
        subscriptionStartDate: dayjs().format('YYYY-MM-DD'),
        customFieldDefinition: {
          contact: [],
        },
        kpiSettings: {
          email: {
            min_open_rate: 5,
            max_open_rate: 12,
            min_click_rate: 1,
            max_click_rate: 3,
            min_ctor: 20,
            max_ctor: 25,
          },
          banners: {
            min_click_rate: 0.1,
            max_click_rate: 2.0
          }
        },
        allowedTactics: [],
        leadScoreLookBackPeriod: 12,
      },
      API_key: null,
      API_key_visible: false,
      active_custom_field: {},
      dialog: false,
      custom_fields: [],
      accountTypes: [
        { label: "HCP", value: "HCP" },
        { label: "Patient", value: "Patient" },
      ],
      subscriptionTerms: [
        { label: "1 month", value: 1 },
        { label: "3 months", value: 3 },
        { label: "1 year", value: 12 },
      ],
      passwordStrengthLevels: [
        { label: "Medium", value: "2" },
        { label: "Strong", value: "3" },
        { label: "Very Strong", value: "4" }
      ],
      tactic_lists: [],
      tactic_lists_with_values: [],
      newAccountDialog: false,
      newAccountFailed: false,
      newAccount: null,
    };
  },
  computed: {
    existedName() {
      return this.custom_fields.map(field => field.name);
    }
  },
  async created() {
    await this.get_tactics()
    this.set_tactics_default_values()
  },
  methods: {
    change_account_type_and_default_values(type) {
      this.account_fields.accountType = type

      this.account_fields.kpiSettings.email = {
        min_open_rate: type === 'Patient' ? 11 : 5,
        max_open_rate:  type === 'Patient' ? 15 : 12,
        min_click_rate: type === 'Patient' ? 3 : 1,
        max_click_rate: type === 'Patient' ? 5 : 3,
        min_ctor: type === 'Patient' ? 27 : 20,
        max_ctor: type === 'Patient' ? 33 : 25,
      }
    },
    async handle_file_upload(event) {
      let file = null;
      if (event.target.files.length) {
        file = event.target.files[0];
      }

      if (!(file instanceof File)) {
        this.account_fields.logoFile = {};
        this.$refs.logo_preview.src = '';
        return;
      }

      parseImageFileToBase64(file).then(imgLoaded => {
        this.account_fields.logoFile = {
          data: imgLoaded.data,
          fileName: imgLoaded.name,
        };
        this.$nextTick(() => {
          this.$refs.logo_preview.src = imgLoaded.data;
        })
      }).catch(() => {
        this.account_fields.logoFile = {};
        this.$refs.logo_preview.src = '';
      });
    },
    async get_tactics() {
      this.tactic_lists = (await this.$rest.tactic.get_collection()).data;
    },
    set_tactics_default_values() {
      this.tactic_lists.forEach(item => {
        item.value = ['Email', 'Banners', 'Web', 'Event'].includes(item.name);
        this.tactic_lists_with_values.push(item)
      })
    },
    async save_account() {
      this.account_fields.customFieldDefinition.contact = this.custom_fields;
      this.account_fields.allowedTactics = [];
      this.tactic_lists_with_values.forEach(item => {
        if (item.value) {
          this.account_fields.allowedTactics.push(item.id);
        }
      })

      const result = await this.$rest.account.post_resource(this.account_fields);
      this.newAccount = result.data;
      this.newAccountDialog = true;
    },
    add_custom_field() {
      this.clear_active_custom_field();
      this.dialog = true;
    },
    clear_active_custom_field() {
      this.active_custom_field = {};
    },
    async handle_action(item, field) {
      this.active_custom_field = field;
      if (item.value === "delete") {
        for (let i = 0; i < this.custom_fields.length; i++) {
          if (field.name === this.custom_fields[i].name) {
            this.custom_fields.splice(i, 1);
            break;
          }
        }
      } else if (item.value === "edit") {
        this.dialog = true;
      }
    },
    async save_custom_field(field) {
      for (let i = 0; i < this.custom_fields.length; i++) {
        if (field.id === this.custom_fields[i].id) {
          this.custom_fields.splice(i, 1);
          break;
        }
      }
      this.custom_fields.push(field);
    }
  },
};
</script>

<style lang="scss" scoped>
.new-account {
  .upload-background {
    cursor: pointer;
    width: 95px;
    min-width: 95px;
    height: 95px;
    margin: 0 14px 0 0;
    border-radius: 3px;
    background-color: #ecf1f5;
    * {
      cursor: pointer;
    }
  }

  .v-input.v-input--selection-controls {
    margin: 0;
    .v-input__slot {
      margin-bottom: 0;
    }
  }
}
.field {
  &__header {
    margin-bottom: 25px;
  }
}

::v-deep .custom-button--blue.theme--light.v-btn.v-btn--disabled {
  background-color: #80b1e9 !important;
}
</style>
