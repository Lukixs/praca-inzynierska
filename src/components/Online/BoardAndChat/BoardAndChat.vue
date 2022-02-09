<template>
  <div class="colors" v-if="choosingColorState">
    <div class="white">
      <div class="field">
        &#9920;
      </div>
      <v-btn
        :disabled="!availableColors.white"
        @click="joinAsGiveColor('white')"
        x-large
      >
        Biały
      </v-btn>
    </div>
    <div class="random">
      <div class="field">
        ?
      </div>
      <v-btn
        :disabled="!availableColors.black || !availableColors.white"
        @click="joinAsRandomColor()"
        x-large
      >
        Losowy
      </v-btn>
    </div>
    <div class="black">
      <div class="field">
        &#9922;
      </div>
      <v-btn
        :disabled="!availableColors.black"
        @click="joinAsGiveColor('black')"
        x-large
      >
        Czarny
      </v-btn>
    </div>
  </div>
  <div v-else class="BoardAndChat">
    <OnlineBoard :socket="$props.socket" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OnlineBoard from "./Board/OnlineBoard.vue";

import Component from "vue-class-component";

@Component({
  props: {
    socket: {},
  },
  components: {
    OnlineBoard,
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
    this.$props.socket.emit("set-player-color", color);
  }

  joinAsRandomColor() {
    const colors = ["white", "black"];
    this.$props.socket.emit(
      "set-player-color",
      colors[Math.round(Math.random())]
    );
  }
}
</script>

<style lang="scss" scoped>
.colors {
  margin-top: 40px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  background-color: #6e6e6e30;
  border: 2px solid white;
  border-radius: 30px;
  padding: 40px;
}

.v-btn {
  margin: 20px;
}

.white,
.black,
.random {
  border: 1px solid white;
  border-radius: 30px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.black {
  color: black;
}

.field {
  width: 120px;
  height: 120px;
  font-size: 80px;
  line-height: 90px;
  background-color: #999;
  margin: 20px;
  border: 1px solid white;
}
</style>
