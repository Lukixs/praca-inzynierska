<template>
  <div class="menu">
    <div class="header">
      <h1 class="h1 title ">Wybierz poziom trudności</h1>
    </div>

    <div class="options">
      <div class="options--list">
        <v-btn
          dark
          text
          v-for="(item, index) in items"
          :key="index"
          :to="item.link"
        >
          {{ item.title }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
  data() {
    return {
      items: [
        { title: "DWÓCH GRACZY", link: "/local" },
        {
          title: "Sztuczna Inteligecnja - ŁATWA",
          link: {
            name: "AI Game Easy",
          },
        },
        {
          title: "Sztuczna Inteligecnja - ŚREDNIA",
          link: {
            name: "AI Game Medium",
          },
        },
        {
          title: "Sztuczna Inteligecnja - TRUDNA",
          link: {
            name: "AI Game Hard",
          },
        },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.menu {
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

.header {
  font-size: 30px;
  padding: 15px;
  // min-height: 10vh;
  background-color: #6e6e6e30;
}

.options {
  margin-top: 15vh;
  font-size: 44px;
  display: flex;

  justify-content: center;
  &--list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .v-btn {
    font-size: 44px;
    height: 110px !important;
  }
}
/* @import "../styles/styles.scss"; */
</style>
