<template>
  <div class="chatbox">
    <header>
      <h1>Konwersacja</h1>
    </header>
    <!-- <div class="messages"> -->
    <ul class="messages">
      <li
        class="messages--single"
        v-for="(singleMessage, index) in messages"
        :key="index"
        :class="index % 2 ? 'uneven-row' : 'even-row'"
      >
        <p v-if="singleMessage.system">
          Gracz {{ singleMessage.name }} opuścił rozgrywkę.
        </p>
        <p v-else>
          <span class="nickname">{{ singleMessage.name }}</span
          >: <span class="text">{{ singleMessage.message }}</span>
        </p>
      </li>
    </ul>
    <!-- </div> -->
    <div class="input">
      <v-text-field
        class="input--text"
        placeholder="Twoja wiadomość"
        v-model="message"
        type="text"
        dark
      ></v-text-field>
      <v-btn elevation="4" dark @click="sendMessage()">Wyślij</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    socket: {},
  },
})
export default class Board extends Vue {
  mounted(): void {
    this.loadSocketsListeners();
  }

  loadSocketsListeners(): void {
    this.$props.socket.on("message", (name: string, message: string) => {
      console.log(message, this.messages);
      this.messages.push({ name, message, system: false });
    });

    this.$props.socket.on("user-has-left", (name: string) => {
      console.log(name);
      this.messages.push({
        name: name,
        message: "",
        system: true,
      });
    });
  }

  // updateMessage(text: string): void {
  //   this.message = text;
  // }

  sendMessage(): void {
    console.log("trying to send a message", this.message);
    if (this.message != "") this.$props.socket.emit("message", this.message);
  }

  message = "";
  messages: { name: string; message: string; system: boolean }[] = [];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chatbox {
  margin-top: 50px;
  border-radius: 15px;
  background-color: #6e6e6e30;
  display: flex;
  flex-flow: column;

  header {
    padding: 15px;
  }

  .messages {
    list-style-type: none;
    min-height: 19vh;
    max-height: 19vh;
    background-color: #6e6e6e30;
    overflow-y: auto;
    text-align: left;

    .uneven-row {
      background-color: #a1a1a130;
    }

    &--single {
      padding: 10px;

      .nickname {
        color: #869440;
      }
    }
  }

  .input {
    color: white;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &--text {
      margin: 0 30px 0 10px;
    }
  }
}
</style>
