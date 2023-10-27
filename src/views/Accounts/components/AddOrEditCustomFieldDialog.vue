<template>
  <v-card class="custom-field-popup-card">
    <v-card-title class="px-6 pt-4 pb-4">
      {{ field.name ? "Edit Custom Field" : "Add Custom Field" }}
    </v-card-title>
    <v-divider />
    <v-card-text class="px-6 pt-5 pb-3">
      <div v-if="field.name && isEditingField">
        <div class="input-label">
          Field Name
        </div>
        <DisabledTextInput :value="temp_field.name" class="my-4" />
      </div>
      <CustomTextInput
        v-else
        v-model="temp_field.name"
        header="Field Name"
        header-class="input-label"
        placeholder="Field Name"
        class="mb-6"
        :rules="[duplicatedName, nameRule]"
      />

      <div class="input-label">
        Field Type
      </div>
      <v-radio-group
        v-model="temp_field.type"
        :disabled="!!field.type && isEditingField"
        row
        class="custom-field-radio-group mb-3"
        @change="onSelectFieldType"
      >
        <v-radio
          v-for="type in fieldTypes"
          :key="type.value"
          :label="type.label"
          :value="type.value"
          class="mr-6"
        />
      </v-radio-group>

      <div class="input-label mb-3">
        Options:
      </div>
      <v-row class="mb-4">
        <v-col cols="6">
          <v-checkbox
            v-model="temp_field.isViewable"
            label="Is Viewable"
            :value="true"
          />
        </v-col>
        <v-col cols="6">
          <v-checkbox
            v-model="temp_field.isUnique"
            label="Is Unique per contact"
            :value="true"
            :disabled="isEditingField"
          />
        </v-col>
        <v-col cols="6">
          <CustomDropdown
            v-model="searchType"
            header="Search Type"
            header-class="input-label"
            placeholder="Search Type"
            :items="filteredSearchTypes"
            @change="onSearchTypeSelected"
          />
        </v-col>
        <v-col
          v-if="searchType === 'choice'"
          cols="6"
        >
          <CustomDropdown
            v-model="temp_field.searchType"
            header="Search Dropdown Type"
            header-class="input-label"
            :items="dropdownOptions"
          />
        </v-col>
        <v-col
          v-if="temp_field.searchType === 'choice'"
          cols="12"
        >
          <div class="input-label mb-3">
            Search Drop Down Options
          </div>
          <v-row v-if="temp_field.searchChoices && temp_field.searchChoices.length" class="px-1 mt-2 pb-0">
            <v-col cols="12">
              The <strong>Label</strong> is what you see when using the dropdown. These values should be easy to read and find.<br>
              The <strong>Value</strong> is what actually gets exists in the database. These values are what you're expecting to search by.
              It will be the same value as Label in most cases.
            </v-col>
            <v-col cols="6" class="font-weight-bold pt-0 px-2 pb-0">
              Label
            </v-col>
            <v-col cols="6" class="font-weight-bold pt-0 px-2 pb-0">
              Value
            </v-col>
          </v-row>
          <v-row v-for="(item, index) in temp_field.searchChoices" :key="index" class="px-1 mt--2 mb-1">
            <v-col cols="6" class="pt-0 px-2 pb-0">
              <CustomTextInput
                v-model="item.label"
                placeholder="Option Label"
              />
            </v-col>
            <v-col cols="6" class="pt-0 px-2 pb-0">
              <CustomTextInput
                v-model="item.value"
                placeholder="Option Value"
              />
            </v-col>
          </v-row>
          <div
            class="simple-text-button button--blue pb-5 pt-3"
            @click="temp_field.searchChoices.push({label: null, value: null})"
          >
            Add Another Search Choice +
          </div>
        </v-col>
        <v-col cols="6">
          <CustomDropdown
            v-model="editType"
            header="Edit Type"
            header-class="input-label"
            placeholder="Edit Type"
            :items="filteredEditTypes"
            @change="onEditTypeSelected"
          />
        </v-col>
        <v-col
          v-if="editType === 'choice'"
          cols="6"
        >
          <CustomDropdown
            v-model="temp_field.editType"
            header="Edit Dropdown Type"
            header-class="input-label"
            :items="dropdownOptions"
          />
        </v-col>
        <v-col
          v-if="temp_field.editType === 'database'"
          cols="6"
        >
          <v-checkbox
            v-model="temp_field.editCanAddNewValue"
            label="Allow user to set a value not in the edit dropdown"
            :value="true"
            style="margin-top:32px;"
          />
        </v-col>
        <v-col
          v-if="temp_field.editType === 'choice'"
          cols="12"
        >
          <div class="input-label mb-3">
            Edit Drop Down Options
          </div>
          <v-row v-if="temp_field.editChoices && temp_field.editChoices.length" class="px-1 mt-2 pb-0">
            <v-col cols="12">
              The <strong>Label</strong> is what you see when using the dropdown. These values should be easy to read and find.<br>
              The <strong>Value</strong> is what actually gets saved in the database. It will be the same value as Label in most cases.
            </v-col>
            <v-col cols="6" class="font-weight-bold pt-0 px-2 pb-0">
              Label
            </v-col>
            <v-col cols="6" class="font-weight-bold pt-0 px-2 pb-0">
              Value
            </v-col>
          </v-row>
          <v-row v-for="(item, index) in temp_field.editChoices" :key="index" class="px-1 mt--2 mb-1">
            <v-col cols="6" class="pt-0 px-2 pb-0">
              <CustomTextInput
                v-model="item.label"
                placeholder="Option Label"
              />
            </v-col>
            <v-col cols="6" class="pt-0 px-2 pb-0">
              <CustomTextInput
                v-model="item.value"
                placeholder="Option Value"
              />
            </v-col>
          </v-row>
          <div
            class="simple-text-button button--blue pb-5 pt-3"
            @click="temp_field.editChoices.push({label: null, value: null})"
          >
            Add Another Edit Choice +
          </div>
        </v-col>
        <v-col
          v-if="!defaultValueChoices"
          cols="6"
        >
          <CustomTextInput
            v-model="temp_field.defaultValue"
            header="Default Value"
            header-class="input-label"
            placeholder="Optional default value"
          />
        </v-col>
        <v-col
          v-else
          cols="6"
        >
          <CustomDropdown
            v-model="temp_field.defaultValue"
            header="Default Value"
            header-class="input-label"
            placeholder="Optional default value"
            :items="defaultValueChoices"
          />
        </v-col>
      </v-row>

      <div class="input-label mt-2">
        Validation Rules
      </div>
      <v-alert
        v-if="isEditingField"
        type="info"
        class="mt-2"
        style="font-size: 12px;"
      >
        Editing an existing field's validation rules only affect newly added contacts, and updates to existing contacts after the field update is saved.
        It will not change or invalidate any existing data that is currently in the database. We recommend exporting the data, and updating
        any contacts that do not meet the updated validation rules, in order to maintain clean and valid data at all times.
      </v-alert>
      <v-list>
        <v-list-item
          v-for="(item, key) in temp_field.validationConstraints"
          :key="key"
          class="align-center pl-0 pb-2"
        >
          <v-row>
            <v-col v-if="key > 0" cols="12">
              <v-divider />
            </v-col>
            <v-col cols="11">
              <CustomDropdown
                v-model="item.constraint"
                placeholder="Choose a rule"
                :items="filteredValidationConstraints"
              />
            </v-col>
            <v-col
              cols="1"
            >
              <v-btn
                icon
                small
                style="margin-top:24px;"
                @click="deleteConstraint(key)"
              >
                <v-icon color="#66788e" size="18">
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              v-for="(constraint, constraintKey) in getConstraintParameters(item.constraint)"
              :key="'constraint-' + key + '-' + constraintKey"
              :cols="getConstraintParameters(item.constraint).length > 1 ? 6 : 12"
            >
              <CustomTextInput
                v-if="['text', 'number'].includes(constraint.type)"
                v-model="temp_field.validationConstraints[key].constraintOptions[constraint.parameter]"
                :header="constraint.label"
                :hint="constraint.hint || ''"
                :placeholder="constraint.placeholder || ''"
              />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>

      <div
        class="simple-text-button button--blue py-5"
        @click="temp_field.validationConstraints.push({constraint: null, constraintOptions: {}})"
      >
        Add Validation Constraint +
      </div>
    </v-card-text>

    <v-card-actions
      class="divider-with-shadow d-flex justify-end px-6 pb-3 pt-3"
    >
      <div
        class="simple-text-button button--gray mx-8 d-flex align-center"
        @click="cancel"
      >
        Cancel
      </div>
      <v-btn
        height="34px"
        class="elevation-0 custom-button custom-button--blue"
        width="150px"
        @click="save()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CustomTextInput from "@/sharedComponents/CustomTextInput";
import CustomDropdown from "@/sharedComponents/CustomDropdown";
import DisabledTextInput from "@/sharedComponents/DisabledTextInput";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "AddOrEditCustomFieldDialog",
  components: { CustomTextInput, CustomDropdown, DisabledTextInput },
  props: {
    field: {
      default: () => [],
    },
    existedName: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      temp_field: {
        type: 'text',
        defaultValue: null,
        isViewable: true,
        isUnique: false,
        searchType: 'text',
        searchChoices: [],
        editType: 'text',
        editChoices: [],
        editCanAddNewValue: false,
        validationConstraints: [],
      },
      fieldTypes: [
        {label: 'Text', value: 'text'},
        {label: 'Number', value: 'number'},
        {label: 'Date', value: 'date'},
        {label: 'Yes or No', value: 'boolean'},
      ],
      allSearchTypes: {
        "text": [
          { label: "Do not allow searching", value: null },
          { label: "Text Box", value: "text" },
          { label: "Drop Down", value: "choice" },
        ],
        "number": [
          { label: "Do not allow searching", value: null },
          { label: "Numeric Search", value: "number" },
        ],
        "date": [
          { label: "Do not allow searching", value: null },
          { label: "Date Picker", value: "date" },
        ],
        "boolean": [
          { label: "Do not allow searching", value: null },
          { label: "Yes/No Drop Down", value: "yes_or_no" },
        ]
      },
      searchType: null,
      editType: null,
      allEditTypes: {
        "text": [
          { label: "Do not allow editing", value: null },
          { label: "Text Box", value: "text" },
          { label: "Drop Down", value: "choice" },
        ],
        "number": [
          { label: "Do not allow editing", value: null },
          { label: "Text Box", value: "number" },
          { label: "Drop Down", value: "choice" },
        ],
        "date": [
          { label: "Do not allow editing", value: null },
          { label: "Date Picker", value: "date" },
        ],
        "boolean": [
          { label: "Do not allow editing", value: null },
          { label: "Yes/No Drop Down", value: "yes_or_no" },
        ]
      },
      isViewableValues: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      dropdownOptions: [
        { label: 'Generate options from database values', value: 'database' },
        { label: 'Create your own options', value: 'choice' },
      ],
      allValidationConstraints: null,
      duplicatedName: value => value != this.existedName || "This custom field name already existed",
      nameRule: value => {
        const pattern = /^[a-zA-Z0-9 ]+$/;
        return pattern.test(value) || 'Invalid custom field name'
      }
    };
  },
  computed: {
    isEditingField() {
      // If the custom field has a fieldName property, it has been saved before since this gets generated by the
      // backend while saving
      return !!this.field.fieldName;
    },
    filteredSearchTypes() {
      return this.allSearchTypes[this.temp_field.type];
    },
    filteredEditTypes() {
      return this.allEditTypes[this.temp_field.type];
    },
    filteredValidationConstraints() {
      if (!this.allValidationConstraints) {
        return [];
      }
      return this.allValidationConstraints[this.temp_field.type].map(item => ({ label: item.label, value: item.constraint}));
    },
    defaultValueChoices() {
      if (['text', 'number'].includes(this.temp_field.type)) {
        if (this.temp_field.editType !== 'choice') {
          return null;
        }

        const choices = this.temp_field.editChoices.filter(elem => !!elem.value && !!elem.label)
        choices.unshift({ label: 'No Default Value (NULL)', value: null });

        return choices;
      } else if (this.temp_field.type === 'boolean') {
        return [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ];
      }

      return null;
    }
  },
  mounted() {
    this.loadValidationConstraints();

    this.temp_field = { ...this.temp_field, ...JSON.parse(JSON.stringify(this.field)) };

    if (['choice', 'database'].includes(this.temp_field.searchType)) {
      this.searchType = 'choice';
    }
    if (['choice', 'database'].includes(this.temp_field.editType)) {
      this.editType = 'choice';
    }
  },
  methods: {
    async loadValidationConstraints() {
      const resp = await this.$rest.account.get_custom_field_constraints();
      this.allValidationConstraints = resp.data;
    },
    deleteConstraint(index) {
      this.temp_field.validationConstraints.splice(index, 1);
    },
    cancel() {
      this.$emit("dismiss");
    },
    save() {
      this.temp_field.searchChoices = this.temp_field.searchChoices.filter(choice => {
        return !!choice.label && !!choice.value;
      });
      this.temp_field.editChoices = this.temp_field.editChoices.filter(choice => {
        return !!choice.label && !!choice.value;
      });
      this.temp_field.validationConstraints = this.temp_field.validationConstraints.filter(constraint => {
        return !!constraint.constraint;
      });
      if(!this.temp_field.id) this.temp_field.id = uuidv4();
      this.$emit("save", this.temp_field);
      this.$emit("dismiss");
    },
    onSelectFieldType() {
      // check if the new field type is able to select the edit type
      const editChoice = this.filteredEditTypes.filter(item => item.value === this.temp_field.editType);
      if (editChoice.length === 0) {
        this.editType = null;
        this.temp_field.editType = null; // need to reset this
        this.temp_field.editChoices = [];
      }

      // check if the new field type is able to select the search type
      const searchChoice = this.filteredSearchTypes.filter(item => item.value === this.temp_field.searchType);
      if (searchChoice.length === 0) {
        this.searchType = null;
        this.temp_field.searchType = null; // need to reset this
        this.temp_field.searchChoices = [];
      }

      const constraintsChosen = Object.keys(this.filteredValidationConstraints);
      this.temp_field.validationConstraints = this.temp_field.validationConstraints.filter(
        item => constraintsChosen.includes(item.constraint)
      );
    },
    onSearchTypeSelected($evt) {
      if ($evt === 'choice') {
        if (!['choice', 'database'].includes(this.temp_field.searchType)) {
          this.temp_field.searchType = 'database';
        }
      } else {
        this.temp_field.searchType = $evt;
        this.temp_field.searchChoices = [];
      }
    },
    onEditTypeSelected($evt) {
      if ($evt === 'choice') {
        if (!['choice', 'database'].includes(this.temp_field.editType)) {
          this.temp_field.editType = 'database';
        }
      } else {
        this.temp_field.editType = $evt;
        this.temp_field.editChoices = [];
        this.temp_field.editCanAddNewValue = false;
      }
    },
    getConstraintParameters(constraint) {
      if (constraint === null || !this.allValidationConstraints) {
        return [];
      }
      const constraintDef = this.allValidationConstraints[this.temp_field.type].find(item => {
        return item.constraint === constraint
      });

      return constraintDef.parameters;
    }
  },
};
</script>

<style lang="scss" scoped>
.custom-field-popup-card {
  .v-card__title {
    font-family: "Open Sans", sans-serif;
    font-size: 16px !important;
    font-weight: 600 !important;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
  }
  .input-label {
    font-family: "Open Sans", sans-serif;
    font-size: 15px !important;
    font-weight: 600 !important;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
  }
  .field-subheader {
    color: #241c15;
  }
}
.custom-field-radio-group {
    margin-top: 8px;
    .v-icon {
      font-size: 22px;
      color: #a5a9b8;
    }
    .v-label {
      font-family: "Open Sans", sans-serif;
      font-size: 15px;
      color: #241c15;
      margin-bottom: 3px;
    }
    .v-messages {
      display: none;
    }
  }
.divider-with-shadow {
  box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.11);
}
.custom-fields-row-checkbox {
  .v-input__control {
    .v-messages {
      display: none;
    }
    .v-label {
      font-family: "Open Sans", sans-serif;
      font-size: 13px;
      font-weight: normal;
      color: #241c15;
    }
    .v-icon {
      font-size: 18px;
    }
  }
}
</style>
