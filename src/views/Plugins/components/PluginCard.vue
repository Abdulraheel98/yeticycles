<template>
  <v-card
    class="mr-4 my-2 elevation-0 account-card"
    height="160px"
    max-width="265px"
    min-width="265px"
    width="265px"
  >
    <div class="card-background d-flex align-center justify-center">
      <v-img v-if="plugin.image" :src="pluginLogo" max-height="100px" contain />
    </div>
    <v-card-actions>
      <div class="point-name">
        {{ plugin.name || 'Unnamed plugin' }}
      </div>
      <v-icon v-if="plugin.isActive" color="#1f9f43" size="18" class="ml-1">
        mdi-check-circle
      </v-icon>
      <v-spacer />

      <v-btn
        class="custom-button custom-button--blue"
        height="34px"
        width="90px"
        depressed
        @click="$emit('install')"
      >
        {{ installed ? 'Configure' : 'Install' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "PluginCard",
  props: {
    plugin: {
      default: () => {},
      type: Object,
    },
    installed: {
      default: false,
      type: Boolean,
    },

  },
  data() {
    return {
      outer_menu_opened: false,
    }
  },
  computed: {
    pluginLogo() {
      if(this.plugin.image){
        return require("@/assets/plugins/" + this.plugin.image)
      }
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.account-card {
  width: 262px;
  height: 159px;
  margin: 0 1px 0 0;
  padding: 0 0 17px;
  border-radius: 5px;
  border: solid 1px #dee7ee;
  background-color: #ffffff;

  .card-background {
    background: #f7f7f7;
    height: 108px;
    border-bottom: 1px solid #dee7ee;
  }
}

.point-name {
  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #241c15;
}
</style>
