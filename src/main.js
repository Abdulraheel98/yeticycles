import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import store from "./store/index";
import router from "@/router/router";
import VueKonva from "vue-konva";
import { vue_rest } from "@/api/rest.api";
import { snackbar } from "@/plugins/snackbar";
import VueMeta from 'vue-meta'
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import '@/scss/heatmaps.scss';
import '@/scss/buttons.scss';

var jQuery = require("jquery")
window.jQuery = window.$ = jQuery;

import VueClipboards from 'vue-clipboards'
Vue.use(VueClipboards)

Chart.plugins.register(ChartDataLabels);

Vue.config.productionTip = false;
Vue.use(vue_rest);
Vue.use(snackbar, { store });
Vue.use(VueKonva);
Vue.use(VueMeta);
extend("required", {
  ...required,
  message: "This field is required"
});
extend("decimal", {
  validate(
    value,
  ) {
    const regex = new RegExp("(^\\d+\\.?\\d+$)|(^\\d+$)");

    return regex.test(String(value));
  },
  message: "This field only allows numbers with decimals"
});
extend("min", {
  validate(value, args) {
    return value.length >= args.length;
  },
  params: ["length"],
  message: "This value is too short"
});

extend("max", {
  validate(value, args) {
    return value.length <= args.length;
  },
  params: ["length"],
  message: "This value is too long"
});

extend("passmin", {
  validate(value, args) {
    return value.length >= args.length;
  },
  params: ["length"],
  message: "Password is too short"
});

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match"
});

extend("email", { ...email, message: "This is not a valid email." });

/**
 * Format datetime
 * @param {String} format
 * @return {String}
 */
Date.prototype.format = function(format) {

  var self = this;
  var half = false;

  if (format && format[0] === '!') {
    half = true;
    format = format.substring(1);
  }

  if (format === undefined || format === null || format === '')
    return self.getFullYear() + '-' + (self.getMonth() + 1).toString().padLeft(2, '0') + '-' + self.getDate().toString().padLeft(2, '0') + 'T' + self.getHours().toString().padLeft(2, '0') + ':' + self.getMinutes().toString().padLeft(2, '0') + ':' + self.getSeconds().toString().padLeft(2, '0') + '.' + self.getMilliseconds().toString().padLeft(3, '0') + 'Z';

  var h = self.getHours();

  if (half) {
    if (h >= 12)
      h -= 12;
  }

  return format.replace(regexpDATEFORMAT, function(key) {
    switch (key) {
      case 'yyyy':
        return self.getFullYear();
      case 'yy':
        return self.getYear();
      case 'MM':
        return (self.getMonth() + 1).toString().padLeft(2, '0');
      case 'M':
        return (self.getMonth() + 1);
      case 'dd':
        return self.getDate().toString().padLeft(2, '0');
      case 'd':
        return self.getDate();
      case 'HH':
      case 'hh':
        return h.toString().padLeft(2, '0');
      case 'H':
      case 'h':
        return self.getHours();
      case 'mm':
        return self.getMinutes().toString().padLeft(2, '0');
      case 'm':
        return self.getMinutes();
      case 'ss':
        return self.getSeconds().toString().padLeft(2, '0');
      case 's':
        return self.getSeconds();
      case 'w':
      case 'ww':
        var tmp = new Date(+self);
        tmp.setHours(0, 0, 0);
        tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
        tmp = Math.ceil((((tmp - new Date(tmp.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
        if (key === 'ww')
          return tmp.toString().padLeft(2, '');
        return tmp;
      case 'a':
        var a = 'AM';
        if (self.getHours() >= 12)
          a = 'PM';
        return a;
    }
  });
};

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
