<template>
  <div class="local">
    <div class="header">
      <h1 class="h1 title ">Rozgrywka Lokalna - Dwóch Graczy</h1>
    </div>
    <LocalGame />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import LocalGame from "../../components/LocalGame.vue";

export default Vue.extend({
  name: "Home",
  components: {
    LocalGame,
  },
});
</script>
<style lang="scss" scoped>
.local {
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.header {
  font-size: 30px;
  padding: 15px;
  // min-height: 15vh;
  background-color: #6e6e6e30;
}
</style>
