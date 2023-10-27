// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended" // Use this if you are using Vue.js 2.x.,
  ],
  rules: {
    // override/add rules settings here, such as:
    "no-undef": "off",
    "vue/require-prop-types": "off",
    "vue/custom-event-name-casing": "off",
    "vue/prop-name-casing": "off",
    "vue/vue/no-mutating-props": "off",
      "vue/no-v-html": "off",
    "vue/no-unused-vars": "warn",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 5,
        multiline: {
          max: 3,
          allowFirstLine: true
        }
      }
    ]
  }
};
