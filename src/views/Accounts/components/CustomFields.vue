<template>
  <v-container class="pa-0">
    <v-row class="px-2 mb-7">
      <v-col
        v-for="field in custom_fields"
        :key="field.id"
        cols="12"
        sm="4"
        lg="3"
        class="px-0 px-sm-1 py-1"
      >
        <div class="segment-block d-flex align-center justify-space-between py-2 px-3">
          <div class="mr-3">
            <div class="d-flex align-start mb-1">
              <div class="segment-block__name pr-3">
                {{ field.name }}
              </div>
            </div>
            <div class="segment-block__created">
              {{
                `${field_type(field.type)} • ${
                  field.isUnique ? "Unique" : "Not Unique"
                }`
              }}
            </div>
          </div>
          <div>
            <v-menu nudge-top="-5px" nudge-left="125px" :offset-y="true">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="#66788e">
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
              <OuterList
                title="Actions"
                :items="outer_list_items"
                @click="(item) => $emit('action', item, field)"
              />
            </v-menu>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OuterList from "@/sharedComponents/OuterList";

export default {
  name: "CustomFields",
  components: { OuterList },
  props: {
    custom_fields: {
      default: () => {},
    },
  },
  data() {
    return {
      outer_list_items: [
        {
          label: "Edit Field",
          icon: "mdi-pencil",
          value: "edit",
        },
        {
          label: "Remove Field",
          icon: "mdi-delete-outline",
          value: "delete",
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {
    field_type(type) {
      switch (type) {
        case "text":
          return "Text";
        case "number":
          return "Number";
        case "date":
          return "Date";
        default:
          return "Yes/No";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.segment-block {
  border-radius: 4px;
  border: solid 1px #dee7ee;

  &__name {
    font-family: "Open Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #241c15;
  }
  &__icon {
    margin-top: 2px;
  }

  &__created {
    font-family: "Open Sans", sans-serif;
    font-size: 11px;
    font-weight: normal;
    line-height: normal;
    color: #66788e;
  }
}
</style>
