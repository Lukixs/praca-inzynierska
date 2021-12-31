<template>
  <div class="online">
    <div class="header">
      <h1 class="h1 title ">Rozgrywka On-line</h1>
    </div>
    <div v-if="!joinedRoom">
      <input
        name="NameInput"
        ref="NameInput"
        type="text"
        placeholder="Nickname"
      />
      <p>Wybierz pokoj</p>
      <ul>
        <li style="display:block" v-for="(room, id) in rooms" :key="id">
          <span @click="joinRoom(room)">{{ room.name }}</span>
          [<span v-for="(player, jd) in room.players" :key="jd"
            >{{ player.name }},</span
          >]
        </li>
      </ul>
    </div>
    <div v-else><BoardAndChat :socket="socket" /></div>
    <!-- <div><BoardAndChat :socket="socket" /></div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as io from "socket.io-client";
import BoardAndChat from "./BoardAndChat/BoardAndChat.vue";
import { onlineRoom } from "../../types/online";

@Component({
  props: {
    msg: {
      type: String,
    },
  },
  components: {
    BoardAndChat,
  },
})
export default class Board extends Vue {
  protected socket = io.connect("ws://localhost:8081");
  $refs!: {
    NameInput: HTMLInputElement;
  };

  mounted(): void {
    console.log("Created", {
      connected: this.socket.connected,
      id: this.socket,
    });

    this.loadSocketsListeners();
  }

  loadSocketsListeners(): void {
    this.socket.on("rooms", (rooms: onlineRoom[]) => {
      this.rooms = rooms;
    });

    this.socket.on("joined", () => {
      this.joinedRoom = true;
    });
  }

  joinRoom(room: onlineRoom): void {
    if (room.players.length >= 2) return;
    this.socket.emit("joinRoom", this.$refs.NameInput.value, room.name);
  }

  joinedRoom = false;
  message: string;
  playerName: string;
  messages: { name: string; message: string }[] = [];
  rooms: onlineRoom[] = [];
  //=================================================
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
  font-size: 30px;
  padding: 15px;
  // min-height: 15vh;
  background-color: #6e6e6e30;
}
</style>
