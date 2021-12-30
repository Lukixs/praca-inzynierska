<template>
  <div class="menu">
    <h1 class="h1 title ">DARA</h1>
    <div class="menu--options">
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        x-large
        dark
        text
        :to="item.link"
        >{{ item.title }}</v-btn
      >
    </div>
    <!-- <router-link to="/local">Local Game</router-link> |
    <router-link to="/about">AI Game - Easy</router-link> |
    <router-link to="/minimax">MiniMax Game</router-link> |
    <router-link to="/online">Online</router-link> -->
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
  data() {
    return {
      items: [
        { title: "GRAJ LOKALNIE", link: "/local" },
        { title: "GRAJ ONLINE", ilink: "/about" },
        { title: "OPCJE", link: "/minimax" },
        { title: "INSTRUKCJA", icon: "mdi-forum", link: "/online" },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.menu {
  color: white;
}
/* @import "../styles/styles.scss"; */
</style>
