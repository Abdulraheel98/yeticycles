<template>
  <v-card
    class="mr-md-4 my-2 elevation-0 account-card"
    height="160px"
    max-width="265px"
    min-width="265px"
    width="265px"
    @click="$emit('click')"
  >
    <v-btn
      v-if="$store.getters['user/isPulseAdmin']"
      class="edit-icon"
      text
      icon
      transition="fade-transition"
      @click.stop="$router.push(`/edit_account/${$attrs.id}`)"
    >
      <v-icon size="18px">
        mdi-cog-outline
      </v-icon>
    </v-btn>

    <v-img
      v-if="img"
      :src="img"
      height="108px"
      contain
    />
    <div v-else class="account-image-placeholder">
      <div class="subheader">
        {{ name }}
      </div>
    </div>
    <v-card-actions>
      <v-btn
        v-if="isActive"
        class="text-capitalize"
        color="primary"
        text
      >
        <v-icon class="mr-0" size="16px" left>
          mdi-check
        </v-icon>
        Active
      </v-btn>
      <v-btn
        v-else
        class="text-capitalize"
        color="gray"
        text
      >
        Inactive
      </v-btn>

      <v-spacer />

      <v-btn
        text
        color="#66788e"
        class="text-none"
      >
        {{ accountType }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
name: "AccountCard",
  props: {
    img: {
      default:() => null,
      type: String,
    },
    name: {
      default:() => null,
      type: String,
    },
    accountType: {
      default: () => 'HCP',
      type: String,
    },
    isActive: {
      default: () => true,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-image{
    background-color: rgba(216, 216, 216, 0.2);
    border-bottom: 1px solid #dee7ee;
}
.account-card {
    width: 262px;
    height: 159px;
    margin: 0 1px 0 0;
    padding: 0 0 17px;
    border-radius: 5px;
    border: solid 1px #dee7ee;
    background-color: #ffffff;
    position: relative;
}
.account-image-placeholder {
    height: 108px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(216, 216, 216, 0.2);
    border-bottom: 1px solid #dee7ee;
}
.edit-icon {
  pointer-events: none;
  opacity: 0;
  cursor: none;
  position: absolute;
  right: 0;
  top: 0;
  margin: 4px 4px 0 0;
  z-index: 1;
  // transition-property: opacity;
  // transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  // transition-duration: 250ms;
}
.account-card:hover .edit-icon {
  opacity: 1;
  pointer-events: auto;
  cursor: pointer;
}


@media (max-width: 727px) {
  .account-card {
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style>
