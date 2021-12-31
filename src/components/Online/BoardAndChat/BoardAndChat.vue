<template>
  <div class="BoardAndChat">
    <Board :socket="$props.socket" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Board from "./Board/OnlineBoard.vue";

import Component from "vue-class-component";

@Component({
  props: {
    socket: {},
  },
  components: {
    Board,
  },
})
export default class BoardAndChat extends Vue {}
</script>

<style lang="scss" scoped>
.BoardAndChat {
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>
