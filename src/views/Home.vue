<template>
  <div class="home">
    <Board />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import Board from "../components/Board.vue";

export default Vue.extend({
  name: "Home",
  components: {
    Board,
  },
});
</script>
