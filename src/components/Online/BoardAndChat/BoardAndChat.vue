<template>
  <div class="BoardAndChat">
    <Chat :socket="$props.socket" />
    <Board :socket="$props.socket" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Board from "./Board/OnlineBoard.vue";
import Chat from "./Chat/ChatWindow.vue";
import Component from "vue-class-component";

@Component({
  props: {
    socket: {},
  },
  components: {
    Board,
    Chat,
  },
})
export default class BoardAndChat extends Vue {}
</script>

<style scoped></style>
