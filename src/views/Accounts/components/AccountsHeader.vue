<template>
  <div>
    <div class="header mb-3">
      Account Selection
    </div>
    <div class="subheader mb-1">
      Hi <a href="#">{{ user }}</a>, it’s nice to see you 👋
    </div>
    <div class="subheader">
      Please select which account you’d like to manage
    </div>
  </div>
</template>

<script>
export default {
name: "AccountsHeader",
    props: {
        user: {
            default: () => 'John Doe',
            type: String
        }
    }
}
</script>

<style lang="scss" scoped>
    .header {
        font-family: 'Playfair Display', serif;
        font-size: 40px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #241c15;
    }
    .subheader {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #241c15;
        a {
            font-weight: 600;
            color: #2b84eb;
            text-decoration: none;
        }
    }

</style>
