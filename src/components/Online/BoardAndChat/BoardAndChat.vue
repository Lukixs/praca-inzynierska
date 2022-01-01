<template>
  <div v-if="choosingColorState">
    <button
      :disabled="!availableColors.white"
      @click="joinAsGiveColor('white')"
    >
      Biały
    </button>
    <button
      :disabled="!availableColors.black"
      @click="joinAsGiveColor('black')"
    >
      Czarny
    </button>
    <button>Obserwator</button>
  </div>
  <div v-else class="BoardAndChat">
    <Chat :socket="$props.socket" />
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
export default class BoardAndChat extends Vue {
  choosingColorState = true;
  availableColors = { white: false, black: false };
  mounted(): void {
    this.$props.socket.emit("get-available-colors");

    this.$props.socket.on("available-colors", (colors: any) => {
      this.availableColors = colors;
    });

    this.$props.socket.on("color-setted", () => {
      this.choosingColorState = false;
    });
  }

  joinAsGiveColor(color: string) {
    this.availableColors = { white: false, black: false };
    this.$props.socket.emit("set-player-color", color);
  }
}
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
