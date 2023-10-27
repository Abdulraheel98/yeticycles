<template>
  <div class="search-table">
    <v-simple-table>
      <thead>
        <tr class="search-table__header">
          <th>Contact</th>
          <th>Action Code Type</th>
          <th>Form Name</th>
          <th>Action Source</th>
          <th>Date Time</th>
        </tr>
      </thead>
      <tbody class="search-table__content">
        <tr v-for="(item, index) in records" :key="index">
          <td class="search-table__id" style="text-align: left;display: flex;">
            <div>
              <v-menu :close-on-content-click="false" open-on-hover>
                <template #activator="{ on, attrs }">
                  <span class="id-icon">
                    <v-btn color="#2b84eb" icon small v-bind="attrs" v-on="on">
                      <v-icon color="#2b84eb" size="18">$eye</v-icon>
                    </v-btn>
                  </span>
                </template>

                <item-details-popup
                  :id="item.contact.id"
                  :key="item.contact.id"
                  :contact="item.contact"
                  :title="`${item.contact.firstName} ${item.contact.lastName}`"
                  @open-details="$router.push({name: 'ContactDetails', params: {id: item.contact.id}})"
                />
              </v-menu>
            </div>

            <div>
              <a class="fake-link" @click="goToContactPage(item)">
                <span v-if="item.contact.firstName || item.contact.lastName">
                  {{ item.contact.firstName }} {{ item.contact.lastName }}
                </span>
                <span v-else>
                  N/A
                </span>
                <br>
                <small class="text--disabled" style="font-size: 11px;">ID: {{ item.contact.id }}</small>
              </a>
            </div>
          </td>
          <td>{{ item.actionCodeName }}</td>
          <td
            class="search-table__creative"
            @click="goToSearchForm(item.creativeName)"
          >
            {{ item.creativeName }}
          </td>
          <td>
            {{ item.source.name || '-' }}
          </td>
          <td>
            {{ getDateWithTime(item.actionDate) }}
          </td>
        </tr>
        <tr v-if="!records.length">
          <td colspan="4">
            No record found.
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import ItemDetailsPopup from "@/views/Contacts/components/ItemDetailsPopup";
import datesMixin from "@/utils/datesMixin.js";

export default {
  name: "ActionFormTable",
  components: { ItemDetailsPopup },
  mixins: [datesMixin],
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  methods: {
    goToContactPage(record) {
      this.$router.push({
        name: "ContactDetails",
        params: {
          id: record.contact.id,
        },
      });
    },
    goToSearchForm() {
      /*this.$router.push({
        name: "Forms",
        query: {
          keyword: formName,
        },
      });*/
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/contact-info-table.scss";
</style>

