<template>
  <div class="online">
    <div class="header">
      <h1 class="h1 title ">Rozgrywka On-line</h1>
    </div>
    <div class="content" v-if="!joinedRoom">
      <div v-if="!nameSetted" class="name-field">
        <span class="label">Podaj swój pseudonim</span>
        <v-text-field
          class="input"
          v-model="playerName"
          placeholder="Nick"
          dark
          outlined
          @keydown.enter="verifyNameInput()"
        ></v-text-field>

        <v-btn @click="verifyNameInput()">Potwierdź</v-btn>
      </div>

      <div v-else class="rooms">
        <span class="rooms--header">Dołącz do któregoś z dostępnych pokoi</span>
        <!-- <ul class="list">
          <li style="display:block" v-for="(room, id) in rooms" :key="id">
            <span @click="joinRoom(room)">{{ room.name }}</span>
            [<span v-for="(player, jd) in room.players" :key="jd"
              >{{ player.name }},</span
            >]
          </li>
        </ul> -->
        <div class="rooms--list">
          <div
            class="rooms--list--item"
            v-for="(room, id) in rooms"
            :key="id"
            @click="joinRoom(room)"
          >
            <span>{{ room.name }}</span>
            [<span v-for="(player, jd) in room.players" :key="jd"
              >{{ player.name }},</span
            >]
          </div>
        </div>
      </div>
    </div>
    <BoardAndChat v-else :socket="socket" />
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
      console.log("Emituje nowe roomy", rooms);
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

  verifyNameInput() {
    // console.log(this.$refs.NameInput.value);
    console.log(this.playerName);
    if (this.playerName && this.playerName != "") this.nameSetted = true;
  }

  closeSocket() {
    this.socket.disconnect();
  }

  joinedRoom = false;
  nameSetted = false;
  message: string;
  playerName = "";
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

.content {
  margin: 0 auto;

  .name-field {
    margin-top: 80px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background-color: #6e6e6e30;
    border: 2px solid white;
    border-radius: 30px;
    padding: 40px;

    .label {
      font-size: 40px;
      margin: 0 0 30px 0;
    }
    .input {
      max-width: 20vw;
    }
  }

  .rooms {
    margin-top: 80px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background-color: #6e6e6e30;
    border: 2px solid white;
    border-radius: 30px;
    padding: 20px 40px 40px 40px;

    &--header {
      font-size: 30px;
      line-height: 70px;
      margin: 0 0 20px 0;
      border-bottom: 2px solid white;
    }

    &--list {
      // margin-top: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      &--item {
        font-size: 25px;
        width: 80%;
        background-color: #6e6e6e60;
        padding: 10px;
        margin: 10px;
      }
    }
  }
}
</style>
