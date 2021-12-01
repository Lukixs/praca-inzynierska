<template>
  <div class="hello">
    Webowa Aplikacja do gry Dara

    <div v-if="!joinedRoom">
      <p>Wybierz pokoj</p>
      <ul>
        <li style="display:block" v-for="(room, id) in rooms" :key="id">
          <span @click="joinRoom(room)">{{ room.name }}</span>
          [<span v-for="(player, jd) in room.players" :key="jd"
            >{{ player.name }},</span
          >]
        </li>
      </ul>
      <!-- <input
        name="NameInput"
        v-on:input="updatePlayerName($event.target.value)"
        type="text"
        placeholder="Name"
      /> -->
    </div>
    <div v-else><BoardAndChat :socket="socket" /></div>
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
    this.socket.emit("joinRoom", this.playerName, room.name);
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
<style scoped>
.board {
  width: 720px;
  height: 600px;

  display: flex;
  flex-wrap: wrap-reverse;

  margin: 20px;
  border: 25px solid #333;
  margin-left: auto;
  margin-right: auto;
}

.row {
  display: flex;
}

.black {
  float: left;
  width: 120px;
  height: 120px;
  background-color: #999;
  font-size: 80px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.white {
  float: left;
  width: 120px;
  height: 120px;
  background-color: #fff;
  font-size: 80px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.yellowgreen {
  background-color: yellowgreen;
}

.darkgreen {
  background-color: darkgreen;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
